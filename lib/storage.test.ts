import AsyncStorage from '@react-native-async-storage/async-storage';

import { loadResult, saveSession } from './storage';
import type { TriageSession } from './types';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn(), setItem: jest.fn() },
}));

const getItem = AsyncStorage.getItem as jest.Mock;
const setItem = AsyncStorage.setItem as jest.Mock;

function makeSession(id: string): TriageSession {
  return {
    id,
    createdAt: '2026-01-01T00:00:00.000Z',
    answers: [{ questionId: 'seizure', optionValue: 'yes' }],
    outcomeTier: 'EMERGENCY',
    outcomeReasons: ['Any seizure or convulsion since the crash? — Yes'],
  };
}

describe('loadResult', () => {
  beforeEach(() => {
    getItem.mockReset();
    setItem.mockReset();
  });

  it('returns the session just finished when writing to storage fails', async () => {
    getItem.mockResolvedValue(null);
    setItem.mockRejectedValue(new Error('disk full'));
    const session = makeSession('write-fails');

    await expect(saveSession(session)).rejects.toThrow('disk full');
    await expect(loadResult(session.id)).resolves.toEqual(session);
  });

  it('returns the session just finished when stored data is corrupt', async () => {
    getItem.mockResolvedValue('not json');
    const session = makeSession('corrupt-data');

    await expect(saveSession(session)).rejects.toThrow();
    await expect(loadResult(session.id)).resolves.toEqual(session);
  });

  it('falls back to storage for a session not finished in this run', async () => {
    const older = makeSession('older');
    getItem.mockResolvedValue(JSON.stringify([older]));

    await expect(loadResult(older.id)).resolves.toEqual(older);
  });

  it('returns undefined when an older session cannot be read', async () => {
    getItem.mockRejectedValue(new Error('read failed'));

    await expect(loadResult('unreadable')).resolves.toBeUndefined();
  });
});
