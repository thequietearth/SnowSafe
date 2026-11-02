import AsyncStorage from '@react-native-async-storage/async-storage';

import type { TriageSession } from './types';

const STORAGE_KEY = 'snowsafe.triageSessions.v1';
const UNREADABLE_KEY = 'snowsafe.triageSessions.unreadable';

// The session just finished, kept in memory so its result can be shown even if AsyncStorage fails.
let latestSession: TriageSession | undefined;

function parseSessions(raw: string): TriageSession[] | undefined {
  try {
    const sessions = JSON.parse(raw);
    return Array.isArray(sessions) ? sessions : undefined;
  } catch {
    return undefined;
  }
}

async function readAll(): Promise<TriageSession[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  const sessions = parseSessions(raw);
  if (sessions) return sessions;

  // Set unreadable data aside rather than overwriting it, so new sessions can still be saved.
  await AsyncStorage.setItem(UNREADABLE_KEY, raw);
  await AsyncStorage.removeItem(STORAGE_KEY);
  return [];
}

async function writeAll(sessions: TriageSession[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export async function getAllSessions(): Promise<TriageSession[]> {
  const sessions = await readAll();
  return sessions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function hasUnreadableSessions(): Promise<boolean> {
  return (await AsyncStorage.getItem(UNREADABLE_KEY)) !== null;
}

export async function getSessionById(id: string): Promise<TriageSession | undefined> {
  const sessions = await readAll();
  return sessions.find((s) => s.id === id);
}

export async function loadResult(id: string): Promise<TriageSession | undefined> {
  if (latestSession?.id === id) return latestSession;
  try {
    return await getSessionById(id);
  } catch {
    return undefined;
  }
}

export async function saveSession(session: TriageSession): Promise<void> {
  latestSession = session;
  const sessions = await readAll();
  sessions.push(session);
  await writeAll(sessions);
}

export async function updateSessionNotes(id: string, notes: string): Promise<void> {
  const sessions = await readAll();
  const index = sessions.findIndex((s) => s.id === id);
  if (index === -1) return;
  sessions[index] = { ...sessions[index], notes };
  await writeAll(sessions);
}

export async function deleteSession(id: string): Promise<void> {
  const sessions = await readAll();
  await writeAll(sessions.filter((s) => s.id !== id));
}
