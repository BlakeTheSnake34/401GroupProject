import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { fetchSessions } from '../lib/api';
import { getLocalSessions } from '../lib/sessionDb';

export interface SessionRecord {
  session_id: number;
  purpose_text: string;
  display_name: string;
  app_name: string;
  planned_minutes: number;
  ended_at: string | null;
  end_reason: string | null;
}

interface LastCompleted {
  appName: string;
  purpose: string;
  displayName: string;
  plannedMinutes: number;
  endedAt: string;
}

interface SessionsHistoryProps {
  onBack: () => void;
  lastCompleted?: LastCompleted | null;
}

export default function SessionsHistory({ onBack, lastCompleted }: SessionsHistoryProps) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocal, setUseLocal] = useState(false);

  useEffect(() => {
    async function loadSessions() {
      try {
        const data = await fetchSessions();
        let records = data as SessionRecord[];
        if (lastCompleted) {
          records = [{
            session_id: -1,
            purpose_text: lastCompleted.purpose,
            display_name: lastCompleted.displayName,
            app_name: lastCompleted.appName,
            planned_minutes: lastCompleted.plannedMinutes,
            ended_at: lastCompleted.endedAt,
            end_reason: 'completed',
          }, ...records];
        }
        setSessions(records);
        setUseLocal(false);
      } catch {
        const local = getLocalSessions().map((s) => ({
          session_id: s.session_id,
          purpose_text: s.purpose_text,
          display_name: s.display_name,
          app_name: s.app_name,
          planned_minutes: s.planned_minutes,
          ended_at: s.ended_at,
          end_reason: s.end_reason,
        }));
        if (lastCompleted) {
          local.unshift({
            session_id: -1,
            purpose_text: lastCompleted.purpose,
            display_name: lastCompleted.displayName,
            app_name: lastCompleted.appName,
            planned_minutes: lastCompleted.plannedMinutes,
            ended_at: lastCompleted.endedAt,
            end_reason: 'completed',
          });
        }
        setSessions(local);
        setUseLocal(true);
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, [lastCompleted]);

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Session History</h1>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading sessions...</div>
          ) : error ? (
            <div className="p-4 bg-red-50 rounded-xl text-red-700">{error}</div>
          ) : (
            <>
              {useLocal && (
                <div className="p-4 bg-amber-50 rounded-xl text-amber-800 mb-4">
                  <p className="font-medium">Backend unavailable</p>
                  <p className="text-sm mt-1">
                    Showing sessions from this browser. Start the backend server to sync across devices.
                  </p>
                </div>
              )}
              {sessions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No completed sessions yet.</div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-900">Purpose</th>
                        <th className="px-4 py-3 font-semibold text-gray-900">User</th>
                        <th className="px-4 py-3 font-semibold text-gray-900">App</th>
                        <th className="px-4 py-3 font-semibold text-gray-900">Duration</th>
                        <th className="px-4 py-3 font-semibold text-gray-900">Completed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sessions.map((s) => (
                        <tr key={s.session_id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900">{s.purpose_text}</td>
                          <td className="px-4 py-3 text-gray-700">{s.display_name}</td>
                          <td className="px-4 py-3 text-gray-700">{s.app_name}</td>
                          <td className="px-4 py-3 text-gray-700">{s.planned_minutes} min</td>
                          <td className="px-4 py-3 text-gray-700">{formatDate(s.ended_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
