import { computeOutcome, isTriageComplete } from './triageLogic';
import { TRIAGE_QUESTIONS } from './triageQuestions';

describe('computeOutcome', () => {
  it('returns MONITOR when no answers are given', () => {
    expect(computeOutcome([]).tier).toBe('MONITOR');
  });

  it('returns MONITOR when no flagged options are chosen', () => {
    const result = computeOutcome([
      { questionId: 'loss_of_consciousness', optionValue: 'no' },
      { questionId: 'currently_alert', optionValue: 'yes' },
    ]);
    expect(result.tier).toBe('MONITOR');
    expect(result.reasons).toEqual([]);
  });

  it('returns SEEK_CARE for a moderate-severity answer', () => {
    const result = computeOutcome([
      { questionId: 'headache_severity', optionValue: 'moderate' },
    ]);
    expect(result.tier).toBe('SEEK_CARE');
    expect(result.reasons).toHaveLength(1);
  });

  it('returns EMERGENCY when any answer flags EMERGENCY, even alongside lower-severity answers', () => {
    const result = computeOutcome([
      { questionId: 'loss_of_consciousness', optionValue: 'briefly' },
      { questionId: 'headache_severity', optionValue: 'severe_and_worsening' },
    ]);
    expect(result.tier).toBe('EMERGENCY');
    expect(result.reasons).toEqual([
      'How severe is their headache? — Severe and worsening',
    ]);
  });

  it('takes the max severity across multiple EMERGENCY-flagging answers and lists all of them', () => {
    const result = computeOutcome([
      { questionId: 'currently_alert', optionValue: 'no' },
      { questionId: 'seizure', optionValue: 'yes' },
    ]);
    expect(result.tier).toBe('EMERGENCY');
    expect(result.reasons).toHaveLength(2);
  });

  it('ignores answers referencing unknown questions or options', () => {
    const result = computeOutcome([
      { questionId: 'nonexistent_question', optionValue: 'no' },
      { questionId: 'loss_of_consciousness', optionValue: 'nonexistent_option' },
    ]);
    expect(result.tier).toBe('MONITOR');
    expect(result.reasons).toEqual([]);
  });
});

describe('isTriageComplete', () => {
  it('is not complete before any answers are given', () => {
    expect(isTriageComplete([])).toBe(false);
  });

  it('continues after a SEEK_CARE answer', () => {
    expect(
      isTriageComplete([{ questionId: 'headache_severity', optionValue: 'moderate' }])
    ).toBe(false);
  });

  it('stops as soon as any EMERGENCY option is chosen', () => {
    const emergencyAnswers = TRIAGE_QUESTIONS.flatMap((q) =>
      q.options
        .filter((o) => o.tier === 'EMERGENCY')
        .map((o) => ({ questionId: q.id, optionValue: o.value }))
    );
    expect(emergencyAnswers.length).toBeGreaterThan(0);
    for (const answer of emergencyAnswers) {
      expect(isTriageComplete([answer])).toBe(true);
    }
  });

  it('completes only once every question is answered when there is no emergency', () => {
    const answers = TRIAGE_QUESTIONS.map((q) => ({
      questionId: q.id,
      optionValue: q.options[0].value,
    }));
    expect(computeOutcome(answers).tier).toBe('MONITOR');
    expect(isTriageComplete(answers.slice(0, -1))).toBe(false);
    expect(isTriageComplete(answers)).toBe(true);
  });
});
