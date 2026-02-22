import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface SessionActiveProps {
  appName: string;
  purpose: string;
  duration: number;
  onComplete: () => void;
  onCancel: () => void;
}

export default function SessionActive({ appName, purpose, duration, onComplete, onCancel }: SessionActiveProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Active</h2>
          <p className="text-gray-600">{appName}</p>
        </div>

        <div className="mb-8">
          <div className="relative w-48 h-48 mx-auto">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#3b82f6"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-sm text-gray-500 mt-1">remaining</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm font-medium text-gray-700 mb-1">Your Purpose:</p>
          <p className="text-base text-gray-900">{purpose}</p>
        </div>

        {isExpired && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-medium">Time's up! Great job staying intentional.</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onComplete}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={20} />
            Complete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <XCircle size={20} />
            End Early
          </button>
        </div>
      </div>
    </div>
  );
}
