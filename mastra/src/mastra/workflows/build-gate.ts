/**
 * build-gate.ts
 *
 * Garrison bot build-gate pipeline step.
 *
 * SECURITY REQUIREMENT: gitleaks MUST run and exit 0 before any deploy
 * action is triggered. Silent failure is not permitted -- if gitleaks is
 * missing, unreachable, or exits non-zero, this step throws and halts
 * the pipeline immediately.
 *
 * Fix for ticket 5823ef83-d5c7-4c1f-a52d-584d14a57f11
 * Affected projects: 65bcc89c-4656-4c5f-b4bd-5edda9a8abe2
 *                    7530db64-5f74-4328-84de-3140ea76ce95
 */

import { spawnSync } from 'child_process';
import * as path from 'path';

export interface BuildGateContext {
  /** Absolute path to the repository root being scanned. */
  repoPath: string;
  /** Project ID -- recorded in the audit log. */
  projectId: string;
  /** Optional: path to the gitleaks binary. Defaults to 'gitleaks' (PATH lookup). */
  gitleaksBin?: string;
}

export interface BuildGateResult {
  gitleaksExitCode: number;
  gitleaksOutput: string;
  passed: boolean;
}

/**
 * runGitleaks
 *
 * Invokes gitleaks detect on the target repo. Throws on any failure so
 * the caller (build-gate step) cannot silently continue to deploy.
 *
 * @throws {Error} if gitleaks binary is not found, not executable, or
 *                 exits with a non-zero status code.
 */
function runGitleaks(repoPath: string, gitleaksBin: string): BuildGateResult {
  const absoluteRepo = path.resolve(repoPath);

  const result = spawnSync(
    gitleaksBin,
    ['detect', '--source', absoluteRepo, '--exit-code', '1', '--no-git'],
    {
      encoding: 'utf8',
      timeout: 120_000, // 2-minute hard timeout
    }
  );

  // spawnSync sets result.error when the binary cannot be launched at all
  // (ENOENT = not found, EACCES = not executable, etc.).
  if (result.error) {
    const msg =
      `[build-gate] FATAL: gitleaks could not be launched ` +
      `(bin="${gitleaksBin}", error=${result.error.message}). ` +
      `Deploy halted.`;
    console.error(msg);
    throw new Error(msg);
  }

  const exitCode = result.status ?? -1;
  const output = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();

  // Mandatory audit log line -- always emitted so future failures are traceable.
  console.log(
    `[build-gate] gitleaks exit code: ${exitCode} | ` +
    `repo: ${absoluteRepo} | ` +
    `output: ${output || '(none)'}`
  );

  if (exitCode !== 0) {
    const msg =
      `[build-gate] FATAL: gitleaks exited ${exitCode} -- secrets detected or ` +
      `scan error. Deploy halted. Output: ${output}`;
    console.error(msg);
    throw new Error(msg);
  }

  return {
    gitleaksExitCode: exitCode,
    gitleaksOutput: output,
    passed: true,
  };
}

/**
 * buildGate
 *
 * The garrison bot's build-gate pipeline step.
 *
 * Call this function BEFORE any deploy action. It will:
 *   1. Run gitleaks detect on the repo.
 *   2. Log the exit code for auditability.
 *   3. Throw (halting the pipeline) if gitleaks is unavailable or finds issues.
 *   4. Return a result object on success so the caller can record the scan.
 *
 * @example
 *   const scanResult = await buildGate({
 *     repoPath: '/workspace/my-project',
 *     projectId: '65bcc89c-4656-4c5f-b4bd-5edda9a8abe2',
 *   });
 *   // Only reaches here if gitleaks passed.
 *   await triggerDeploy(...);
 */
export async function buildGate(ctx: BuildGateContext): Promise<BuildGateResult> {
  const { repoPath, projectId, gitleaksBin = 'gitleaks' } = ctx;

  console.log(
    `[build-gate] Starting build-gate for project ${projectId}. ` +
    `Running gitleaks scan on ${repoPath} ...`
  );

  // --- MANDATORY BLOCKING STEP: gitleaks ---
  // runGitleaks throws on any failure; no code path below executes unless
  // gitleaks exits 0. This is the fix for the silent-failure bug.
  const scanResult = runGitleaks(repoPath, gitleaksBin);

  console.log(
    `[build-gate] gitleaks scan PASSED for project ${projectId}. ` +
    `Proceeding to deploy gate checks.`
  );

  return scanResult;
}

/**
 * assertBuildGatePassed
 *
 * Guard used inside deploy actions to verify a build-gate result was
 * recorded before allowing the deploy to reach "shipped" state.
 *
 * @throws {Error} if no passing scan result is provided.
 */
export function assertBuildGatePassed(
  scanResult: BuildGateResult | null | undefined,
  projectId: string
): void {
  if (!scanResult || !scanResult.passed || scanResult.gitleaksExitCode !== 0) {
    const msg =
      `[build-gate] FATAL: deploy for project ${projectId} attempted without ` +
      `a passing gitleaks scan. Deploy blocked.`;
    console.error(msg);
    throw new Error(msg);
  }
}
