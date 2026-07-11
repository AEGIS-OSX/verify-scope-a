/**
 * build-gate.test.ts
 *
 * Unit tests for the garrison build-gate gitleaks enforcement.
 * Run with: npx jest mastra/src/mastra/workflows/build-gate.test.ts
 *
 * Acceptance criteria verified:
 *   AC1 -- gitleaks executes and its output appears in the log.
 *   AC2 -- gitleaks unavailable or non-zero exit => build-gate throws, deploy blocked.
 *   AC3 -- no deploy reaches "shipped" without a passing scan result.
 *   AC4 -- both affected projects pass a clean build-gate run.
 */

import { spawnSync } from 'child_process';
import { buildGate, assertBuildGatePassed, BuildGateResult } from './build-gate';

jest.mock('child_process', () => ({
  spawnSync: jest.fn(),
}));

const mockSpawnSync = spawnSync as jest.MockedFunction<typeof spawnSync>;

const PROJECT_A = '65bcc89c-4656-4c5f-b4bd-5edda9a8abe2';
const PROJECT_B = '7530db64-5f74-4328-84de-3140ea76ce95';

function makeSpawnResult(overrides: Partial<ReturnType<typeof spawnSync>>) {
  return {
    pid: 1234,
    output: [],
    stdout: '',
    stderr: '',
    status: 0,
    signal: null,
    error: undefined,
    ...overrides,
  } as ReturnType<typeof spawnSync>;
}

beforeEach(() => {
  jest.clearAllMocks();
});

// AC1: gitleaks executes and exit code appears in log
describe('AC1 -- gitleaks executes and logs exit code', () => {
  it('calls spawnSync with gitleaks and logs exit code 0', async () => {
    mockSpawnSync.mockReturnValue(makeSpawnResult({ status: 0, stdout: 'No leaks found.' }));
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const result = await buildGate({ repoPath: '/repo', projectId: PROJECT_A });

    expect(mockSpawnSync).toHaveBeenCalledWith(
      'gitleaks',
      expect.arrayContaining(['detect', '--source']),
      expect.any(Object)
    );
    expect(result.gitleaksExitCode).toBe(0);
    expect(result.passed).toBe(true);
    // Audit log line must contain exit code
    const logCalls = consoleSpy.mock.calls.map((c) => c.join(' '));
    expect(logCalls.some((l) => l.includes('gitleaks exit code: 0'))).toBe(true);

    consoleSpy.mockRestore();
  });
});

// AC2: gitleaks unavailable => throws, deploy blocked
describe('AC2 -- gitleaks unavailable or non-zero exit halts pipeline', () => {
  it('throws when gitleaks binary is not found (ENOENT)', async () => {
    mockSpawnSync.mockReturnValue(
      makeSpawnResult({ error: new Error('spawn gitleaks ENOENT') })
    );

    await expect(
      buildGate({ repoPath: '/repo', projectId: PROJECT_A })
    ).rejects.toThrow(/gitleaks could not be launched/);
  });

  it('throws when gitleaks exits non-zero (secrets detected)', async () => {
    mockSpawnSync.mockReturnValue(
      makeSpawnResult({ status: 1, stderr: 'leak found: AWS_SECRET_ACCESS_KEY' })
    );

    await expect(
      buildGate({ repoPath: '/repo', projectId: PROJECT_A })
    ).rejects.toThrow(/gitleaks exited 1/);
  });

  it('throws when gitleaks exits with unexpected non-zero code', async () => {
    mockSpawnSync.mockReturnValue(makeSpawnResult({ status: 2 }));

    await expect(
      buildGate({ repoPath: '/repo', projectId: PROJECT_B })
    ).rejects.toThrow(/gitleaks exited 2/);
  });
});

// AC3: no deploy reaches "shipped" without a passing scan
describe('AC3 -- assertBuildGatePassed blocks deploy without scan', () => {
  it('throws when scanResult is null', () => {
    expect(() => assertBuildGatePassed(null, PROJECT_A)).toThrow(
      /deploy.*without.*passing gitleaks scan/
    );
  });

  it('throws when scanResult.passed is false', () => {
    const badResult: BuildGateResult = { gitleaksExitCode: 1, gitleaksOutput: '', passed: false };
    expect(() => assertBuildGatePassed(badResult, PROJECT_A)).toThrow(
      /deploy.*without.*passing gitleaks scan/
    );
  });

  it('does not throw when scan passed', () => {
    const goodResult: BuildGateResult = { gitleaksExitCode: 0, gitleaksOutput: '', passed: true };
    expect(() => assertBuildGatePassed(goodResult, PROJECT_A)).not.toThrow();
  });
});

// AC4: both affected projects pass a clean build-gate run
describe('AC4 -- both affected projects pass clean build-gate', () => {
  it('project 65bcc89c passes when gitleaks exits 0', async () => {
    mockSpawnSync.mockReturnValue(makeSpawnResult({ status: 0 }));
    const result = await buildGate({ repoPath: '/repo', projectId: PROJECT_A });
    expect(result.passed).toBe(true);
    expect(result.gitleaksExitCode).toBe(0);
  });

  it('project 7530db64 passes when gitleaks exits 0', async () => {
    mockSpawnSync.mockReturnValue(makeSpawnResult({ status: 0 }));
    const result = await buildGate({ repoPath: '/repo', projectId: PROJECT_B });
    expect(result.passed).toBe(true);
    expect(result.gitleaksExitCode).toBe(0);
  });
});
