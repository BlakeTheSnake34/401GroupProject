import { Lightbulb, Users, BookOpen, Coffee, Briefcase, BookText } from 'lucide-react';

interface PurposeScreenProps {
  appName: string;
  onSelectPurpose: (purpose: string) => void;
  onBack: () => void;
}

export default function PurposeScreen({ appName, onSelectPurpose, onBack }: PurposeScreenProps) {
  const purposes = [
    { id: 'create', label: 'Create', icon: <Lightbulb size={20} /> },
    { id: 'connect', label: 'Connect', icon: <Users size={20} /> },
    { id: 'learn', label: 'Learn', icon: <BookOpen size={20} /> },
    { id: 'relax', label: 'Relax', icon: <Coffee size={20} /> },
    { id: 'work', label: 'Work', icon: <Briefcase size={20} /> },
    { id: 'journal', label: 'Journal', icon: <BookText size={20} /> },
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

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What's your purpose?</h2>
            <p className="text-gray-600 text-lg">
              Purpose is about intention, not perfection. There are no wrong answers.
            </p>
          </div>

          <div className="mb-8">
            <label htmlFor="custom-purpose" className="block text-sm font-medium text-gray-700 mb-2">
              e.g. Catch up on messages, scroll to unwind, learn something new.
            </label>
            <input
              id="custom-purpose"
              type="text"
              placeholder="Type your purpose..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  onSelectPurpose(e.currentTarget.value.trim());
                }
              }}
            />
          </div>

          <div className="mb-8">
            <p className="text-sm font-medium text-gray-700 mb-4">What kind of session?</p>
            <div className="grid grid-cols-3 gap-3">
              {purposes.map((purpose) => (
                <button
                  key={purpose.id}
                  onClick={() => onSelectPurpose(purpose.label)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-gray-700 hover:text-blue-600"
                >
                  {purpose.icon}
                  <span className="text-sm">{purpose.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Lightbulb size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Need inspiration?</p>
                <p className="text-sm text-gray-600">"Reply to 3 messages"</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <BookOpen size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">"Scroll for 10 min on a playlist"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
