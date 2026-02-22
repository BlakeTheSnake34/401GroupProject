import { saveCompletedSession as saveToApi } from './api';

const LOCAL_STORAGE_KEY = 'purpose_sessions';

export interface SavedSession {
  session_id: number;
  purpose_text: string;
  display_name: string;
  app_name: string;
  planned_minutes: number;
  ended_at: string;
  end_reason: string;
}

function saveToLocalStorage(session: Omit<SavedSession, 'session_id'>): void {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const sessions: SavedSession[] = stored ? JSON.parse(stored) : [];
    const nextId = sessions.length > 0 ? Math.max(...sessions.map((s) => s.session_id)) + 1 : 1;
    sessions.unshift({
      session_id: nextId,
      ...session,
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // ignore
  }
}

export function getLocalSessions(): SavedSession[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function saveCompletedSession(
  appName: string,
  purposeText: string,
  plannedMinutes: number,
  startedAt: Date,
  displayName = 'Guest User'
): Promise<boolean> {
  const sessionData = {
    purpose_text: purposeText,
    display_name: displayName,
    app_name: appName,
    planned_minutes: plannedMinutes,
    ended_at: new Date().toISOString(),
    end_reason: 'completed',
  };

  try {
    const ok = await saveToApi(appName, purposeText, plannedMinutes, startedAt, displayName);
    if (ok) return true;
  } catch {
    // API failed, fall back to localStorage
  }
  saveToLocalStorage(sessionData);
  return true;
}
