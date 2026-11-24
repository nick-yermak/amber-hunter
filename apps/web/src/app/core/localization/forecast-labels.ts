import type { Safety } from '../../shared/forecast/forecast';
import type { MessageKey } from './en';

export const sampleSafetyLabels = {
  clear: 'clearScenario',
  unsafe: 'unsafeScenario',
  restricted: 'restrictedScenario',
  unknown: 'unknownScenario',
} as const satisfies Record<Safety, MessageKey>;
