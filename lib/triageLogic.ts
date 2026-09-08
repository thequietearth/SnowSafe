import { TRIAGE_QUESTIONS } from './triageQuestions';
import type { OutcomeTier, TriageAnswer } from './types';

const TIER_SEVERITY: Record<OutcomeTier, number> = {
  MONITOR: 0,
  SEEK_CARE: 1,
  EMERGENCY: 2,
};

export interface TriageOutcome {
  tier: OutcomeTier;
  reasons: string[];
}

export function computeOutcome(answers: TriageAnswer[]): TriageOutcome {
  let tier: OutcomeTier = 'MONITOR';
  const reasonsByTier: Record<OutcomeTier, string[]> = {
    MONITOR: [],
    SEEK_CARE: [],
    EMERGENCY: [],
  };

  for (const answer of answers) {
    const question = TRIAGE_QUESTIONS.find((q) => q.id === answer.questionId);
    const option = question?.options.find((o) => o.value === answer.optionValue);
    if (!question || !option?.tier) continue;

    reasonsByTier[option.tier].push(`${question.prompt} — ${option.label}`);
    if (TIER_SEVERITY[option.tier] > TIER_SEVERITY[tier]) {
      tier = option.tier;
    }
  }

  return { tier, reasons: reasonsByTier[tier] };
}
