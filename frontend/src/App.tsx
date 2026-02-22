import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import PurposeScreen from './components/PurposeScreen';
import TimeSelectionScreen from './components/TimeSelectionScreen';
import SessionActive from './components/SessionActive';
import SessionsHistory from './components/SessionsHistory';
import { saveCompletedSession } from './lib/sessionDb';

type Step = 'welcome' | 'purpose' | 'time' | 'active' | 'history';

function App() {
  const [step, setStep] = useState<Step>('welcome');
  const [selectedApp, setSelectedApp] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [sessionStartedAt, setSessionStartedAt] = useState<Date | null>(null);
  const [lastCompletedSession, setLastCompletedSession] = useState<{
    appName: string;
    purpose: string;
    displayName: string;
    plannedMinutes: number;
    endedAt: string;
  } | null>(null);

  const handleSelectApp = (app: string) => {
    setSelectedApp(app);
    setStep('purpose');
  };

  const handleSelectPurpose = (purpose: string) => {
    setSelectedPurpose(purpose);
    setStep('time');
  };

  const handleSelectTime = (minutes: number) => {
    setSelectedDuration(minutes);
    setSessionStartedAt(new Date());
    setStep('active');
  };

  const handleCompleteSession = async () => {
    if (sessionStartedAt) {
      await saveCompletedSession(
        selectedApp,
        selectedPurpose,
        selectedDuration,
        sessionStartedAt
      );
    }

    setLastCompletedSession({
      appName: selectedApp,
      purpose: selectedPurpose,
      displayName: 'Guest User',
      plannedMinutes: selectedDuration,
      endedAt: new Date().toISOString(),
    });
    setStep('history');
  };

  const handleCancelSession = () => {
    resetFlow();
  };

  const resetFlow = () => {
    setStep('welcome');
    setSelectedApp('');
    setSelectedPurpose('');
    setSelectedDuration(0);
    setSessionStartedAt(null);
    setLastCompletedSession(null);
  };

  return (
    <>
      {step === 'welcome' && (
        <WelcomeScreen
          onSelectApp={handleSelectApp}
          onViewHistory={() => setStep('history')}
        />
      )}
      {step === 'purpose' && (
        <PurposeScreen
          appName={selectedApp}
          onSelectPurpose={handleSelectPurpose}
          onBack={() => setStep('welcome')}
        />
      )}
      {step === 'time' && (
        <TimeSelectionScreen
          appName={selectedApp}
          purpose={selectedPurpose}
          onSelectTime={handleSelectTime}
          onBack={() => setStep('purpose')}
        />
      )}
      {step === 'active' && (
        <SessionActive
          appName={selectedApp}
          purpose={selectedPurpose}
          duration={selectedDuration}
          onComplete={handleCompleteSession}
          onCancel={handleCancelSession}
        />
      )}
      {step === 'history' && (
        <SessionsHistory onBack={resetFlow} lastCompleted={lastCompletedSession} />
      )}
    </>
  );
}

export default App;
