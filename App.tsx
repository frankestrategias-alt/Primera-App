import React, { useState, useEffect } from 'react';
import { HomeView } from './views/HomeView';
import { ContactView } from './views/ContactView';
import { FollowUpView } from './views/FollowUpView';
import { ObjectionView } from './views/ObjectionView';
import { GoalsView } from './views/GoalsView';
import { DailyPostView } from './views/DailyPostView';
import { Layout } from './components/Layout';
import { ViewState, UserGoals, DailyProgress, DEFAULT_GOALS, DEFAULT_PROGRESS } from './types';

function App() {
  const [view, setView] = useState<ViewState>('HOME');
  
  // Persistent State
  const [goals, setGoals] = useState<UserGoals>(() => {
    const saved = localStorage.getItem('mlm_goals');
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });

  const [progress, setProgress] = useState<DailyProgress>(() => {
    const saved = localStorage.getItem('mlm_progress');
    const parsed = saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
    
    // Check if it's a new day
    const today = new Date().toISOString().split('T')[0];
    if (parsed.lastUpdated !== today) {
      return { ...DEFAULT_PROGRESS, lastUpdated: today };
    }
    return parsed;
  });

  // Effects to save state
  useEffect(() => {
    localStorage.setItem('mlm_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('mlm_progress', JSON.stringify(progress));
  }, [progress]);

  // Actions
  const handleRecordContact = () => {
    setProgress(prev => ({ ...prev, contactsMade: prev.contactsMade + 1 }));
  };

  const handleRecordFollowUp = () => {
    setProgress(prev => ({ ...prev, followUpsMade: prev.followUpsMade + 1 }));
  };

  const renderView = () => {
    switch(view) {
      case 'HOME':
        return <HomeView setViewState={setView} progress={progress} goals={goals} />;
      case 'CONTACT':
        return <ContactView onRecordAction={handleRecordContact} />;
      case 'FOLLOWUP':
        return <FollowUpView onRecordAction={handleRecordFollowUp} />;
      case 'OBJECTIONS':
        return <ObjectionView />;
      case 'GOALS':
        return <GoalsView goals={goals} progress={progress} onUpdateGoals={setGoals} />;
      case 'DAILY_POST':
        return <DailyPostView />;
      default:
        return <HomeView setViewState={setView} progress={progress} goals={goals} />;
    }
  };

  const getTitle = () => {
    switch(view) {
      case 'HOME': return 'MLM Action Partner';
      case 'CONTACT': return 'Contactar';
      case 'FOLLOWUP': return 'Seguimiento';
      case 'OBJECTIONS': return 'Manejo de Objeciones';
      case 'GOALS': return 'Mis Metas';
      case 'DAILY_POST': return 'Plan de Contenido';
    }
  };

  return (
    <Layout 
        title={getTitle()} 
        showBack={view !== 'HOME'} 
        onBack={() => setView('HOME')}
    >
      {renderView()}
    </Layout>
  );
}

export default App;