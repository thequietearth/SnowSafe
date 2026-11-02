import AsyncStorage from '@react-native-async-storage/async-storage';

import { getAllSessions, hasUnreadableSessions, loadResult, saveSession } from './storage';
import type { TriageSession } from './types';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));

const SESSIONS_KEY = 'snowsafe.triageSessions.v1';
const UNREADABLE_KEY = 'snowsafe.triageSessions.unreadable';

const getItem = AsyncStorage.getItem as jest.Mock;
const setItem = AsyncStorage.setItem as jest.Mock;
const removeItem = AsyncStorage.removeItem as jest.Mock;

function makeSession(id: string): TriageSession {
  return {
    id,
    createdAt: '2026-01-01T00:00:00.000Z',
    answers: [{ questionId: 'seizure', optionValue: 'yes' }],
    outcomeTier: 'EMERGENCY',
    outcomeReasons: ['Any seizure or convulsion since the crash? — Yes'],
  };
}

beforeEach(() => {
  getItem.mockReset();
  setItem.mockReset();
  removeItem.mockReset();
});

describe('loadResult', () => {
  it('returns the session just finished when writing to storage fails', async () => {
    getItem.mockResolvedValue(null);
    setItem.mockRejectedValue(new Error('disk full'));
    const session = makeSession('write-fails');

    await expect(saveSession(session)).rejects.toThrow('disk full');
    await expect(loadResult(session.id)).resolves.toEqual(session);
  });

  it('returns the session just finished when corrupt data cannot be set aside', async () => {
    getItem.mockResolvedValue('not json');
    setItem.mockRejectedValue(new Error('disk full'));
    const session = makeSession('corrupt-data');

    await expect(saveSession(session)).rejects.toThrow('disk full');
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

describe('unreadable stored data', () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = new Map();
    getItem.mockImplementation(async (key: string) => store.get(key) ?? null);
    setItem.mockImplementation(async (key: string, value: string) => {
      store.set(key, value);
    });
    removeItem.mockImplementation(async (key: string) => {
      store.delete(key);
    });
  });

  it('reports nothing unreadable when stored data is valid', async () => {
    store.set(SESSIONS_KEY, JSON.stringify([makeSession('valid')]));

    await expect(getAllSessions()).resolves.toHaveLength(1);
    await expect(hasUnreadableSessions()).resolves.toBe(false);
  });

  it.each([
    ['corrupt JSON', 'not json'],
    ['JSON that is not a list', '{}'],
  ])('sets aside %s and keeps the original data', async (_name, raw) => {
    store.set(SESSIONS_KEY, raw);

    await expect(getAllSessions()).resolves.toEqual([]);
    await expect(hasUnreadableSessions()).resolves.toBe(true);
    expect(store.get(UNREADABLE_KEY)).toBe(raw);
    expect(store.has(SESSIONS_KEY)).toBe(false);
  });

  it('saves new sessions after setting corrupt data aside', async () => {
    store.set(SESSIONS_KEY, 'not json');
    const session = makeSession('after-corruption');

    await saveSession(session);

    await expect(getAllSessions()).resolves.toEqual([session]);
    expect(store.get(UNREADABLE_KEY)).toBe('not json');
  });
});
