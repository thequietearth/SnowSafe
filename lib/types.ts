export type OutcomeTier = 'EMERGENCY' | 'SEEK_CARE' | 'MONITOR';

export interface TriageAnswer {
  questionId: string;
  optionValue: string;
}

export interface TriageSession {
  id: string;
  createdAt: string;
  answers: TriageAnswer[];
  outcomeTier: OutcomeTier;
  outcomeReasons: string[];
  notes?: string;
}
