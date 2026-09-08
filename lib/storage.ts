import AsyncStorage from '@react-native-async-storage/async-storage';

import type { TriageSession } from './types';

const STORAGE_KEY = 'snowsafe.triageSessions.v1';

async function readAll(): Promise<TriageSession[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as TriageSession[]) : [];
}

async function writeAll(sessions: TriageSession[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export async function getAllSessions(): Promise<TriageSession[]> {
  const sessions = await readAll();
  return sessions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getSessionById(id: string): Promise<TriageSession | undefined> {
  const sessions = await readAll();
  return sessions.find((s) => s.id === id);
}

export async function saveSession(session: TriageSession): Promise<void> {
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
