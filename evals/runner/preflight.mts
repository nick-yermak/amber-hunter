import type { Role } from './contracts.mts';

export const REQUIRED_LIVE_CHECKS = [
  'filesystem-boundaries', 'role-permissions', 'fresh-session', 'network-boundaries',
  'model-auth-separation', 'external-credentials', 'external-services',
  'grader-and-evidence-isolation', 'cli-configuration-and-capabilities',
] as const;

export type LiveCheck = typeof REQUIRED_LIVE_CHECKS[number];

export function livePreflight(role: Role) {
  // AE-1 has no trusted verifier for these checks or live authorization input.
  // Never turn caller assertions, environment variables or flags into authorization.
  return {
    version: 1,
    role,
    status: 'BLOCKED' as const,
    allowed: false as const,
    reasons: [
      'Owner decision: all model-backed evaluation runs are NO-GO.',
      ...REQUIRED_LIVE_CHECKS.map((check) => `${check}: unverified`),
      ...(role === 'reviewer' ? ['effective read-only sandbox and never approval: unverified'] : []),
    ],
  };
}

export interface CliRequest {
  executable: 'codex';
  args: string[];
  stdin: string;
}

export function describeCliRequest(role: Role, cwd: string, prompt: string): CliRequest {
  return {
    executable: 'codex',
    args: [
      'exec', '--json', '--ephemeral', '--cd', cwd,
      '--sandbox', role === 'reviewer' ? 'read-only' : 'workspace-write',
      '--ask-for-approval', 'never', '-',
    ],
    stdin: prompt,
  };
}
