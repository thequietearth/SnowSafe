import { computeOutcome } from './triageLogic';

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
