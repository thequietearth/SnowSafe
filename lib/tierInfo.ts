import {
  EMERGENCY,
  EMERGENCY_MUTED,
  MONITOR,
  MONITOR_MUTED,
  SEEK_CARE,
  SEEK_CARE_MUTED,
} from '@/constants/colors';

import type { OutcomeTier } from './types';

export interface TierInfo {
  shortLabel: string;
  label: string;
  description: string;
  color: string;
  mutedColor: string;
}

export const TIER_INFO: Record<OutcomeTier, TierInfo> = {
  EMERGENCY: {
    shortLabel: 'Emergency',
    label: 'Call Ski Patrol / Emergency Services Now',
    description:
      'One or more answers suggest a possible serious head or spine injury. Avoid moving them unnecessarily and get emergency help immediately.',
    color: EMERGENCY,
    mutedColor: EMERGENCY_MUTED,
  },
  SEEK_CARE: {
    shortLabel: 'Seek Care',
    label: 'Seek Medical Evaluation Soon',
    description:
      'Symptoms suggest a concussion may have occurred. Arrange to see a medical professional today, and watch closely for any worsening symptoms.',
    color: SEEK_CARE,
    mutedColor: SEEK_CARE_MUTED,
  },
  MONITOR: {
    shortLabel: 'Monitor',
    label: 'Monitor & Rest, Reassess if Symptoms Change',
    description:
      'No red-flag symptoms were reported. Rest, avoid returning to activity today, and reassess if new symptoms appear.',
    color: MONITOR,
    mutedColor: MONITOR_MUTED,
  },
};
