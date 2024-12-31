import { nanoid } from 'nanoid';

export interface Habit {
  id: string;
  name: string;
  ikigai: string[];
  frequency: number[];
  completions: Record<string, boolean>;
}

// Helper function to generate random completions for the year
function generateYearCompletions(frequency: number[], completionRate = 0.7) {
  const completions: Record<string, boolean> = {};
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 0, 1); // Start from January 1st
  
  // Generate data for each day of the year until today
  for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
    // Only generate completions for days in the frequency
    if (frequency.includes(date.getDay())) {
      // Random completion with specified success rate
      completions[date.toISOString().split('T')[0]] = Math.random() < completionRate;
    }
  }
  
  return completions;
}

// Placeholder data
const placeholderHabits: Omit<Habit, 'id'>[] = [
  {
    name: "朝のヨガ",
    ikigai: ["passion", "vocation"],
    frequency: [1, 3, 5], // Mon, Wed, Fri
    completions: generateYearCompletions([1, 3, 5], 0.75)
  },
  {
    name: "プログラミング学習",
    ikigai: ["passion", "profession", "vocation"],
    frequency: [1, 2, 3, 4, 5], // Weekdays
    completions: generateYearCompletions([1, 2, 3, 4, 5], 0.8)
  },
  {
    name: "ボランティア活動",
    ikigai: ["mission", "passion"],
    frequency: [0, 6], // Weekends
    completions: generateYearCompletions([0, 6], 0.6)
  },
  {
    name: "読書",
    ikigai: ["passion", "vocation", "mission"],
    frequency: [2, 4, 6], // Tue, Thu, Sat
    completions: generateYearCompletions([2, 4, 6], 0.7)
  },
  {
    name: "瞑想",
    ikigai: ["passion", "mission"],
    frequency: [0, 1, 2, 3, 4, 5, 6], // Every day
    completions: generateYearCompletions([0, 1, 2, 3, 4, 5, 6], 0.9)
  }
];

// State
let habits = $state<Habit[]>([]);
let completionsByDate = $state<Record<string, number>>({});

// Calculate completions
function calculateCompletions(currentHabits: Habit[]) {
  const result: Record<string, number> = {};
  currentHabits.forEach(habit => {
    Object.entries(habit.completions).forEach(([date, completed]) => {
      if (completed) {
        result[date] = (result[date] || 0) + 1;
      }
    });
  });
  return result;
}

// Actions
export function addHabit(habit: Omit<Habit, 'id' | 'completions'>) {
  const newHabit: Habit = {
    ...habit,
    id: nanoid(),
    completions: {}
  };
  habits = [newHabit, ...habits];
  completionsByDate = calculateCompletions(habits);
  saveHabits();
}

export function toggleHabitCompletion(habitId: string, date: string) {
  habits = habits.map(habit => {
    if (habit.id === habitId) {
      return {
        ...habit,
        completions: {
          ...habit.completions,
          [date]: !habit.completions[date]
        }
      };
    }
    return habit;
  });
  completionsByDate = calculateCompletions(habits);
  saveHabits();
}

// Getters
export function getHabits() {
  return habits;
}

export function getCompletionsByDate() {
  return completionsByDate;
}

// Storage
function saveHabits() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('habits', JSON.stringify(habits));
  }
}

// Initialize
export function initializeHabits() {
  if (typeof window === 'undefined') {
    // Server-side rendering, use placeholder data
    habits = placeholderHabits.map(habit => ({
      ...habit,
      id: nanoid()
    }));
    completionsByDate = calculateCompletions(habits);
    return;
  }

  const saved = localStorage.getItem('habits');
  if (saved) {
    try {
      const parsedHabits = JSON.parse(saved);
      if (Array.isArray(parsedHabits) && parsedHabits.length > 0) {
        habits = parsedHabits;
      } else {
        habits = placeholderHabits.map(habit => ({
          ...habit,
          id: nanoid()
        }));
        saveHabits();
      }
    } catch (e) {
      console.error('Error parsing habits:', e);
      habits = placeholderHabits.map(habit => ({
        ...habit,
        id: nanoid()
      }));
      saveHabits();
    }
  } else {
    console.log('No saved habits found, using placeholder data');
    habits = placeholderHabits.map(habit => ({
      ...habit,
      id: nanoid()
    }));
    saveHabits();
  }
  
  completionsByDate = calculateCompletions(habits);
} 