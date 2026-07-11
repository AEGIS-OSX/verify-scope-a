#!/usr/bin/env bash
# build-gate-gitleaks.sh
# Mandatory secrets scan gate. Called by CI before next build.
# Exits non-zero on any failure: binary missing, scan error, or secrets found.
# Every run emits an audit log line with the gitleaks exit code.

set -euo pipefail

SCAN_DIR="${1:-.}"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo "[build-gate] ${TIMESTAMP} Starting gitleaks scan on: ${SCAN_DIR}"

# Verify gitleaks is reachable
if ! command -v gitleaks &>/dev/null; then
  echo "[build-gate] ERROR: gitleaks binary not found. Install gitleaks before running the build gate."
  echo "[build-gate] gitleaks exit code: BINARY_NOT_FOUND"
  exit 1
fi

GITLEAKS_VERSION="$(gitleaks version 2>/dev/null || echo 'unknown')"
echo "[build-gate] gitleaks version: ${GITLEAKS_VERSION}"

# Run the scan
gitleaks detect \
  --source="${SCAN_DIR}" \
  --no-git \
  --redact \
  --exit-code=1 \
  2>&1

EXIT_CODE=$?

echo "[build-gate] gitleaks exit code: ${EXIT_CODE}"

if [ "${EXIT_CODE}" -ne 0 ]; then
  echo "[build-gate] FAIL: gitleaks scan did not pass (exit code ${EXIT_CODE}). Deploy halted."
  exit "${EXIT_CODE}"
fi

echo "[build-gate] PASS: gitleaks scan clean. Deploy may proceed."
exit 0
