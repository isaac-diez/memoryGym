export interface DailyReminder {
  id: string;
  title: string;
  time: string; // "HH:MM"
  completed: boolean;
  category: 'health' | 'medication' | 'exercise' | 'social' | 'mental' | 'other';
  notes?: string;
  isCustom?: boolean;
}

export interface Flashcard {
  id: string;
  frontText: string;
  backText: string;
  frontHint?: string;
  backHint?: string;
  emoji?: string; // Large visual emoji cue
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string; // Lucide icon name
  cards: Flashcard[];
}

export interface UserStats {
  streak: number;
  lastPlayedDate: string | null;
  simonHighScore: number;
  matchingHighScore: number;
  recallHighScore: number;
  completedRemindersCount: number;
  gamesCompletedToday: {
    simon: boolean;
    matching: boolean;
    recall: boolean;
  };
}
