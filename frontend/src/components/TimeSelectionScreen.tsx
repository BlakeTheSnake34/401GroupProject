import { Clock } from 'lucide-react';

interface TimeSelectionScreenProps {
  appName: string;
  purpose: string;
  onSelectTime: (minutes: number) => void;
  onBack: () => void;
}

export default function TimeSelectionScreen({ appName, purpose, onSelectTime, onBack }: TimeSelectionScreenProps) {
  const timeOptions = [
    { minutes: 5, label: 'Quick check', subtitle: '5 minutes' },
    { minutes: 10, label: '5-10 mins', subtitle: '' },
    { minutes: 15, label: 'Focused', subtitle: '' },
    { minutes: 20, label: 'Focused', subtitle: '' },
    { minutes: 30, label: 'Deep dive', subtitle: '' },
    { minutes: 45, label: 'Focused', subtitle: '' },
    { minutes: 60, label: 'Focused', subtitle: '1 hour' },
    { minutes: 90, label: 'Extensive', subtitle: '90+ mins' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-12">
            <button onClick={onBack} className="text-gray-700 hover:text-gray-900">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Purpose</h1>
            <button className="text-gray-500">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How much time do you need?</h2>
            <p className="text-gray-600 text-base">Pick a time block for your session.</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {timeOptions.map((option) => (
              <button
                key={option.minutes}
                onClick={() => onSelectTime(option.minutes)}
                className="relative aspect-square border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center group"
              >
                <div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 mb-1">
                  {option.minutes}
                </div>
                <div className="text-xs text-gray-500 group-hover:text-blue-600 text-center px-2">
                  {option.label || option.subtitle}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
            <Clock size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              You can always exit early if you achieve your goal or change your mind.
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={() => onSelectTime(10)}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-100"
            >
              Start Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
