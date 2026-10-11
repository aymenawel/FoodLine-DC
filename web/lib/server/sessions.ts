import type { ConvState } from '@/lib/engine/types';

// Conversation state per chat session (in memory only, expires after 2 hours idle).
const TTL = 2 * 3600_000;
const g = globalThis as unknown as { __foodlineSessions?: Map<string, { state: ConvState; at: number }> };
const sessions = (g.__foodlineSessions ??= new Map());

export function getSession(id: string): ConvState | undefined {
  const s = sessions.get(id);
  if (!s || Date.now() - s.at > TTL) { sessions.delete(id); return undefined; }
  return s.state;
}

export function clearSessions() {
  sessions.clear();
}

export function saveSession(id: string, state: ConvState) {
  sessions.set(id, { state, at: Date.now() });
  if (sessions.size > 5000) for (const [k, v] of sessions) if (Date.now() - v.at > TTL) sessions.delete(k);
}
