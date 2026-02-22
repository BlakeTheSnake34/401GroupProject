import { Instagram, MessageCircle, Music, Globe, Youtube, Twitter, Flag, Users, Headphones, Heart, Mail, Hash } from 'lucide-react';
import { AppCategory } from '../types';

interface WelcomeScreenProps {
  onSelectApp: (app: string) => void;
  onViewHistory?: () => void;
}

export default function WelcomeScreen({ onSelectApp, onViewHistory }: WelcomeScreenProps) {
  const apps: AppCategory[] = [
    { id: 'instagram', name: 'Instagram', icon: 'instagram', color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400' },
    { id: 'discord', name: 'Discord', icon: 'discord', color: 'bg-indigo-600' },
    { id: 'music', name: 'Music', icon: 'music', color: 'bg-red-500' },
    { id: 'safari', name: 'Safari', icon: 'safari', color: 'bg-blue-400' },
    { id: 'youtube', name: 'YouTube', icon: 'youtube', color: 'bg-red-600' },
    { id: 'twitter', name: 'Twitter', icon: 'twitter', color: 'bg-sky-400' },
    { id: 'f1', name: 'F1', icon: 'f1', color: 'bg-red-700' },
    { id: 'reddit', name: 'Reddit', icon: 'reddit', color: 'bg-orange-500' },
    { id: 'spotify', name: 'Spotify', icon: 'spotify', color: 'bg-green-500' },
    { id: 'pinterest', name: 'Pinterest', icon: 'pinterest', color: 'bg-red-600' },
    { id: 'email', name: 'Email', icon: 'email', color: 'bg-blue-500' },
    { id: 'podcast', name: 'Podcast', icon: 'podcast', color: 'bg-purple-600' },
  ];

  const getIcon = (iconName: string) => {
    const iconProps = { size: 28, strokeWidth: 1.5 };
    const icons: Record<string, JSX.Element> = {
      instagram: <Instagram {...iconProps} />,
      discord: <MessageCircle {...iconProps} />,
      music: <Music {...iconProps} />,
      safari: <Globe {...iconProps} />,
      youtube: <Youtube {...iconProps} />,
      twitter: <Twitter {...iconProps} />,
      f1: <Flag {...iconProps} />,
      reddit: <Users {...iconProps} />,
      spotify: <Headphones {...iconProps} />,
      pinterest: <Heart {...iconProps} />,
      email: <Mail {...iconProps} />,
      podcast: <Hash {...iconProps} />,
    };
    return icons[iconName] || <Globe {...iconProps} />;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-2xl font-bold text-gray-900">Purpose</h1>
            {onViewHistory && (
              <button
                onClick={onViewHistory}
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                View History
              </button>
            )}
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Purpose</h2>
            <p className="text-gray-600 text-lg">
              Select which app you plan to use so we can help you use it with intention.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => onSelectApp(app.name)}
                className="flex flex-col items-center gap-3 group"
              >
                <div className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center text-white transform transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg`}>
                  {getIcon(app.icon)}
                </div>
                <span className="text-sm font-medium text-gray-700">{app.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
