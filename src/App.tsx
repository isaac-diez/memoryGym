import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { DailyReminder, FlashcardDeck, UserStats } from './types';
import { starterDecks } from './data/flashcardsData';
import { Tones } from './utils/audio';

// Subcomponents
import Dashboard from './components/Dashboard';
import SimonGame from './components/SimonGame';
import FlashcardSet from './components/FlashcardSet';
import PairMatching from './components/PairMatching';
import RecallQuest from './components/RecallQuest';
import RemindersManager from './components/RemindersManager';

// Default reminder seed
const DEFAULT_REMINDERS: DailyReminder[] = [
  {
    id: 'dr-meds',
    title: 'Tomar la medicación recetada de la mañana',
    time: '08:30',
    completed: false,
    category: 'medication',
    notes: 'Está en el pastillero de plástico',
    isCustom: false
  },
  {
    id: 'dr-water',
    title: 'Beber un vaso de agua y estirar el cuerpo',
    time: '10:00',
    completed: false,
    category: 'health',
    notes: 'Estiramientos muy suaves permaneciendo sentado',
    isCustom: false
  },
  {
    id: 'dr-walk',
    title: 'Dar un paseo tranquilo o tomar un poco el sol',
    time: '11:30',
    completed: false,
    category: 'exercise',
    notes: 'Unos 15 minutos en el balcón, plaza o por la calle',
    isCustom: false
  },
  {
    id: 'dr-social',
    title: 'Ponerse en contacto con un familiar o amigo',
    time: '14:00',
    completed: false,
    category: 'social',
    notes: 'Llamar por teléfono o escribir un mensaje corto a alguien de tu familia por whatsapp',
    isCustom: false
  },
  {
    id: 'dr-brain',
    title: 'Completar 1 juego en el Gimnasio Mental',
    time: '16:00',
    completed: false,
    category: 'mental',
    notes: 'Elige jugar al Simón, Parejas de Oro o Desafío Diario',
    isCustom: false
  }
];

const DEFAULT_STATS: UserStats = {
  streak: 1,
  lastPlayedDate: null,
  simonHighScore: 0,
  matchingHighScore: 0,
  recallHighScore: 0,
  completedRemindersCount: 0,
  gamesCompletedToday: {
    simon: false,
    matching: false,
    recall: false
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simon' | 'flashcards' | 'matching' | 'recall' | 'reminders'>('dashboard');
  
  // Tab changing that plays click feedback consistently
  const handleTabChange = (tab: 'dashboard' | 'simon' | 'flashcards' | 'matching' | 'recall' | 'reminders') => {
    Tones.click();
    setActiveTab(tab);
  };

  // App States
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [reminders, setReminders] = useState<DailyReminder[]>([]);
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);

  // Load state on mount
  useEffect(() => {
    // 1. Load Core Statistics
    const storedStats = localStorage.getItem('memory_gym_stats_v1');
    const todayStr = new Date().toISOString().split('T')[0];
    let currentStats = DEFAULT_STATS;

    if (storedStats) {
      try {
        const parsed = JSON.parse(storedStats) as UserStats;
        currentStats = parsed;
        
        // Checklist date check-offs to reset daily completion milestones
        if (parsed.lastPlayedDate !== todayStr) {
          // Verify if they played yesterday to increment/preserve streak
          const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          let updatedStreak = parsed.streak;
          
          if (parsed.lastPlayedDate === yesterdayStr) {
            // Did they complete goals yesterday? Let's check status
            const completedYesterday = parsed.gamesCompletedToday.simon || parsed.gamesCompletedToday.matching || parsed.gamesCompletedToday.recall;
            if (completedYesterday) {
              updatedStreak += 1;
            }
          } else if (parsed.lastPlayedDate !== todayStr) {
            // Missed a practice day, keep streak friendly or reset to 1
            updatedStreak = 1;
          }

          currentStats = {
            ...parsed,
            streak: updatedStreak,
            lastPlayedDate: todayStr,
            gamesCompletedToday: {
              simon: false,
              matching: false,
              recall: false
            }
          };
        }
      } catch (e) {
        console.error("Failed to parse statistics", e);
      }
    } else {
      currentStats = {
        ...DEFAULT_STATS,
        lastPlayedDate: todayStr
      };
    }
    setStats(currentStats);
    localStorage.setItem('memory_gym_stats_v1', JSON.stringify(currentStats));

    // 2. Load Reminders
    const storedReminders = localStorage.getItem('memory_gym_reminders_v1');
    if (storedReminders) {
      try {
        const parsedReminders = JSON.parse(storedReminders) as DailyReminder[];
        
        // Daily Reset at midnight local
        const savedDateStr = localStorage.getItem('memory_gym_reminders_date');
        if (savedDateStr !== todayStr) {
          // Reset all completion markings for a brand new morning!
          const resetReminders = parsedReminders.map(r => ({ ...r, completed: false }));
          setReminders(resetReminders);
          localStorage.setItem('memory_gym_reminders_v1', JSON.stringify(resetReminders));
          localStorage.setItem('memory_gym_reminders_date', todayStr);
        } else {
          setReminders(parsedReminders);
        }
      } catch (e) {
        setReminders(DEFAULT_REMINDERS);
      }
    } else {
      setReminders(DEFAULT_REMINDERS);
      localStorage.setItem('memory_gym_reminders_v1', JSON.stringify(DEFAULT_REMINDERS));
      localStorage.setItem('memory_gym_reminders_date', todayStr);
    }

    // 3. Load Decks
    const storedDecks = localStorage.getItem('memory_gym_decks_v1');
    if (storedDecks) {
      try {
        setDecks(JSON.parse(storedDecks));
      } catch (e) {
        setDecks(starterDecks);
      }
    } else {
      setDecks(starterDecks);
      localStorage.setItem('memory_gym_decks_v1', JSON.stringify(starterDecks));
    }
  }, []);

  // Save stats helper
  const saveStats = (updatedStats: UserStats) => {
    setStats(updatedStats);
    localStorage.setItem('memory_gym_stats_v1', JSON.stringify(updatedStats));
  };

  // Toggle checklist complete
  const handleToggleReminder = (id: string) => {
    const updated = reminders.map(r => {
      if (r.id === id) {
        return { ...r, completed: !r.completed };
      }
      return r;
    });
    setReminders(updated);
    localStorage.setItem('memory_gym_reminders_v1', JSON.stringify(updated));

    // Count completed tasks
    const completedCount = updated.filter(r => r.completed).length;
    saveStats({
      ...stats,
      completedRemindersCount: completedCount
    });
  };

  // Add custom reminder
  const handleAddCustomReminder = (title: string, time: string, category: DailyReminder['category'], notes?: string) => {
    const newRem: DailyReminder = {
      id: `custom-rem-${Date.now()}`,
      title,
      time,
      completed: false,
      category,
      notes,
      isCustom: true
    };
    const updated = [...reminders, newRem];
    setReminders(updated);
    localStorage.setItem('memory_gym_reminders_v1', JSON.stringify(updated));
  };

  // Delete reminder
  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    localStorage.setItem('memory_gym_reminders_v1', JSON.stringify(updated));
  };

  // Add custom deck/card
  const handleAddCustomDeck = (newDeck: FlashcardDeck) => {
    const updated = [newDeck, ...decks];
    setDecks(updated);
    localStorage.setItem('memory_gym_decks_v1', JSON.stringify(updated));
  };

  // Game completion milestone tracker
  const handleGameCompletedToday = (gameKey: 'simon' | 'matching' | 'recall') => {
    const updatedMilestones = {
      ...stats.gamesCompletedToday,
      [gameKey]: true
    };
    
    // Auto increment streak friendly if completing the very first game today
    const alreadyCompeletedAny = stats.gamesCompletedToday.simon || stats.gamesCompletedToday.matching || stats.gamesCompletedToday.recall;
    let newStreak = stats.streak;
    if (!alreadyCompeletedAny) {
      newStreak = stats.streak; 
    }

    saveStats({
      ...stats,
      gamesCompletedToday: updatedMilestones,
      streak: newStreak
    });
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-between text-stone-900 font-sans pb-16">
      {/* Top Brand Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 py-3.5 px-4 md:px-6 shadow-xs flex justify-between items-center" id="main-header">
        <div className="flex items-center gap-2.5">
          <button 
            className="h-10 w-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-md cursor-pointer border-0" 
            onClick={() => handleTabChange('dashboard')}
          >
            🧠
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black text-stone-900 tracking-tight flex items-center gap-1.5 leading-none">
              Memory Gym
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100 font-bold uppercase tracking-wider font-mono">Gimnasio Mental</span>
            </h1>
          </div>
        </div>

        {/* Quick Streak Indicator */}
        <div className="flex items-center gap-1.5 bg-orange-50 text-orange-900 px-3 py-1.5 rounded-xl border border-orange-100 font-semibold text-xs font-mono">
          <span>🔥 {stats.streak} {stats.streak === 1 ? 'día' : 'días'} de racha</span>
        </div>
      </header>

      {/* Main Study/Workout Deck Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        
        {/* Simple friendly layout based on tab */}
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            reminders={reminders}
            onSelectTab={handleTabChange}
          />
        )}

        {activeTab === 'simon' && (
          <SimonGame
            bestScore={stats.simonHighScore}
            onUpdateHighScore={(score) => saveStats({ ...stats, simonHighScore: score })}
            onGameCompletedToday={() => handleGameCompletedToday('simon')}
            onBack={() => handleTabChange('dashboard')}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardSet
            decks={decks}
            onAddCustomDeck={handleAddCustomDeck}
            onGameCompletedToday={() => handleGameCompletedToday('matching')} // triggers daily count
            onBack={() => handleTabChange('dashboard')}
          />
        )}

        {activeTab === 'matching' && (
          <PairMatching
            bestScore={stats.matchingHighScore}
            onUpdateHighScore={(score) => saveStats({ ...stats, matchingHighScore: score })}
            onGameCompletedToday={() => handleGameCompletedToday('matching')}
            onBack={() => handleTabChange('dashboard')}
          />
        )}

        {activeTab === 'recall' && (
          <RecallQuest
            bestScore={stats.recallHighScore}
            onUpdateHighScore={(score) => saveStats({ ...stats, recallHighScore: score })}
            onGameCompletedToday={() => handleGameCompletedToday('recall')}
            onBack={() => handleTabChange('dashboard')}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersManager
            reminders={reminders}
            streak={stats.streak}
            onToggleReminder={handleToggleReminder}
            onAddCustomReminder={handleAddCustomReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}

      </main>

      {/* Accessible Bottom Tab Bar - Very clear text labels for easy accessibility */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 py-2.5 px-3 shadow-lg z-40 flex justify-around items-center" id="bottom-navigation-tabs">
        <button
          onClick={() => handleTabChange('dashboard')}
          id="nav-tab-dashboard"
          className={`flex flex-col items-center gap-0.5 justify-center py-1 px-3.5 rounded-xl transition cursor-pointer ${
            activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-800 font-extrabold scale-102' : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] tracking-tight">Inicio</span>
        </button>

        <button
          onClick={() => handleTabChange('simon')}
          id="nav-tab-simon"
          className={`flex flex-col items-center gap-0.5 justify-center py-1 px-3.5 rounded-xl transition cursor-pointer ${
            activeTab === 'simon' ? 'bg-emerald-50 text-emerald-800 font-extrabold scale-102' : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <span className="text-lg leading-none">🎨</span>
          <span className="text-[10px] tracking-tight">Simon</span>
        </button>

        <button
          onClick={() => handleTabChange('flashcards')}
          id="nav-tab-flashcards"
          className={`flex flex-col items-center gap-0.5 justify-center py-1 px-3.5 rounded-xl transition cursor-pointer ${
            activeTab === 'flashcards' ? 'bg-emerald-50 text-emerald-800 font-extrabold scale-102' : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <span className="text-lg leading-none">📖</span>
          <span className="text-[10px] tracking-tight font-sans">Tarjetas</span>
        </button>

        <button
          onClick={() => handleTabChange('matching')}
          id="nav-tab-matching"
          className={`flex flex-col items-center gap-0.5 justify-center py-1 px-3.5 rounded-xl transition cursor-pointer ${
            activeTab === 'matching' ? 'bg-emerald-50 text-emerald-800 font-extrabold scale-102' : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <span className="text-lg leading-none">🧩</span>
          <span className="text-[10px] tracking-tight font-sans">Parejas</span>
        </button>

        <button
          onClick={() => handleTabChange('recall')}
          id="nav-tab-recall"
          className={`flex flex-col items-center gap-0.5 justify-center py-1 px-3.5 rounded-xl transition cursor-pointer ${
            activeTab === 'recall' ? 'bg-emerald-50 text-emerald-800 font-extrabold scale-102' : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <span className="text-lg leading-none">💼</span>
          <span className="text-[10px] tracking-tight font-sans">Desafíos</span>
        </button>

        <button
          onClick={() => handleTabChange('reminders')}
          id="nav-tab-reminders"
          className={`flex flex-col items-center gap-0.5 justify-center py-1 px-3.5 rounded-xl transition cursor-pointer ${
            activeTab === 'reminders' ? 'bg-emerald-50 text-emerald-800 font-extrabold scale-102' : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <span className="text-lg leading-none">📋</span>
          <span className="text-[10px] tracking-tight font-sans">Hábitos</span>
        </button>
      </nav>
    </div>
  );
}
