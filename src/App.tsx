import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import PurposeScreen from './components/PurposeScreen';
import TimeSelectionScreen from './components/TimeSelectionScreen';
import SessionActive from './components/SessionActive';
import { supabase } from './lib/supabase';

type Step = 'welcome' | 'purpose' | 'time' | 'active';

function App() {
  const [step, setStep] = useState<Step>('welcome');
  const [selectedApp, setSelectedApp] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleSelectApp = (app: string) => {
    setSelectedApp(app);
    setStep('purpose');
  };

  const handleSelectPurpose = (purpose: string) => {
    setSelectedPurpose(purpose);
    setStep('time');
  };

  const handleSelectTime = async (minutes: number) => {
    setSelectedDuration(minutes);

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        app_name: selectedApp,
        purpose: selectedPurpose,
        duration_minutes: minutes,
      })
      .select()
      .single();

    if (!error && data) {
      setSessionId(data.id);
      setStep('active');
    }
  };

  const handleCompleteSession = async () => {
    if (sessionId) {
      await supabase
        .from('sessions')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', sessionId);
    }
    resetFlow();
  };

  const handleCancelSession = async () => {
    if (sessionId) {
      await supabase
        .from('sessions')
        .update({
          completed: false,
          completed_at: new Date().toISOString(),
        })
        .eq('id', sessionId);
    }
    resetFlow();
  };

  const resetFlow = () => {
    setStep('welcome');
    setSelectedApp('');
    setSelectedPurpose('');
    setSelectedDuration(0);
    setSessionId(null);
  };

  return (
    <>
      {step === 'welcome' && <WelcomeScreen onSelectApp={handleSelectApp} />}
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
    </>
  );
}

export default App;
