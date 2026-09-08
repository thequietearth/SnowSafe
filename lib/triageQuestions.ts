import type { OutcomeTier } from './types';

export type QuestionType = 'binary' | 'choice';

export interface TriageQuestionOption {
  value: string;
  label: string;
  tier?: OutcomeTier;
}

export interface TriageQuestion {
  id: string;
  prompt: string;
  helpText?: string;
  type: QuestionType;
  options: TriageQuestionOption[];
}

export const TRIAGE_QUESTIONS: TriageQuestion[] = [
  {
    id: 'loss_of_consciousness',
    prompt: 'Did they lose consciousness (pass out)?',
    type: 'choice',
    options: [
      { value: 'no', label: 'No' },
      { value: 'briefly', label: 'Briefly, less than 30 seconds', tier: 'SEEK_CARE' },
      { value: 'longer_or_unsure', label: 'Yes, longer or unsure', tier: 'EMERGENCY' },
    ],
  },
  {
    id: 'currently_alert',
    prompt: 'Are they currently awake, alert, and responding normally?',
    type: 'binary',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No', tier: 'EMERGENCY' },
    ],
  },
  {
    id: 'vomiting',
    prompt: 'Has vomiting occurred since the crash?',
    type: 'choice',
    options: [
      { value: 'no', label: 'No' },
      { value: 'once', label: 'Once', tier: 'SEEK_CARE' },
      { value: 'more_than_once', label: 'More than once', tier: 'EMERGENCY' },
    ],
  },
  {
    id: 'seizure',
    prompt: 'Any seizure or convulsion since the crash?',
    type: 'binary',
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes', tier: 'EMERGENCY' },
    ],
  },
  {
    id: 'neck_or_spine_symptoms',
    prompt: 'Severe neck or spine pain, or numbness, tingling, or weakness in the arms or legs?',
    type: 'binary',
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes', tier: 'EMERGENCY' },
    ],
  },
  {
    id: 'headache_severity',
    prompt: 'How severe is their headache?',
    type: 'choice',
    options: [
      { value: 'none_or_mild', label: 'None or mild' },
      { value: 'moderate', label: 'Moderate', tier: 'SEEK_CARE' },
      { value: 'severe_and_worsening', label: 'Severe and worsening', tier: 'EMERGENCY' },
    ],
  },
  {
    id: 'confusion_or_memory_gaps',
    prompt: 'Are they confused, or do they have gaps in memory about the crash?',
    type: 'binary',
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes', tier: 'SEEK_CARE' },
    ],
  },
  {
    id: 'slurred_speech',
    prompt: 'Slurred speech or trouble communicating?',
    type: 'binary',
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes', tier: 'SEEK_CARE' },
    ],
  },
  {
    id: 'dizziness_or_sensitivity',
    prompt: 'Dizziness, balance problems, or sensitivity to light or noise?',
    type: 'binary',
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes', tier: 'SEEK_CARE' },
    ],
  },
  {
    id: 'pupils_or_fluid',
    prompt: 'Unequal pupil size, or clear fluid or blood from the ears or nose?',
    type: 'binary',
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes', tier: 'EMERGENCY' },
    ],
  },
];
