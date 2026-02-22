const API_BASE = '/api';

export interface SessionRecord {
  session_id: number;
  purpose_text: string;
  display_name: string;
  app_name: string;
  planned_minutes: number;
  ended_at: string | null;
  end_reason: string | null;
}

export async function fetchSessions(): Promise<SessionRecord[]> {
  const res = await fetch(`${API_BASE}/sessions`);
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}

export async function saveCompletedSession(
  appName: string,
  purposeText: string,
  plannedMinutes: number,
  startedAt: Date,
  displayName = 'Guest User'
): Promise<boolean> {
  const res = await fetch(`${API_BASE}/sessions/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_name: appName,
      purpose_text: purposeText,
      planned_minutes: plannedMinutes,
      started_at: startedAt.toISOString(),
      display_name: displayName,
    }),
  });
  return res.ok;
}
