<script lang="ts">
  import Card from './Card.svelte';
  import { Heart, Briefcase, Globe, Trophy, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-svelte';

  const ikigaiIcons = {
    passion: Heart,
    mission: Globe,
    vocation: Trophy,
    profession: Briefcase
  } as const;

  type IkigaiCategory = keyof typeof ikigaiIcons;

  interface Habit {
    id: string;
    name: string;
    icon: any;
    color: string;
    ikigai: IkigaiCategory[];
    frequency: number[];
    completions: Record<string, boolean>;
  }

  interface HabitWeeklyViewProps {
    habits: Habit[];
    onToggleCompletion: (habitId: string, date: string) => void;
    weekOffset: number;
  }

  let { habits = [], onToggleCompletion = () => {}, weekOffset = $bindable(0) }: HabitWeeklyViewProps = $props();

  const weekdays = [
    { id: 0, label: '日', enLabel: 'Sun' },
    { id: 1, label: '月', enLabel: 'Mon' },
    { id: 2, label: '火', enLabel: 'Tue' },
    { id: 3, label: '水', enLabel: 'Wed' },
    { id: 4, label: '木', enLabel: 'Thu' },
    { id: 5, label: '金', enLabel: 'Fri' },
    { id: 6, label: '土', enLabel: 'Sat' }
  ];

  // Get dates for current week
  const getCurrentWeekDates = (offset: number) => {
    const today = new Date();
    const currentDay = today.getDay();
    const dates = [];

    // Adjust the start date based on the offset
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay + (offset * 7));

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
  };

  const weekDates = $derived(getCurrentWeekDates(weekOffset));

  // Format date range for display
  const formatDateRange = (dates: string[]) => {
    if (dates.length === 0) return '';
    const start = new Date(dates[0]);
    const end = new Date(dates[dates.length - 1]);
    return `${start.toLocaleDateString('ja-JP')} - ${end.toLocaleDateString('ja-JP')}`;
  };

  // Calculate progress for each habit
  const getProgress = (habit: Habit, dates: string[]) => {
    if (!habit?.frequency) return 0;
    const daysToComplete = habit.frequency.length;
    if (daysToComplete === 0) return 0;

    const completed = dates.filter(date => 
      habit.frequency.includes(new Date(date).getDay()) && 
      habit.completions?.[date]
    ).length;

    const total = dates.filter(date => 
      habit.frequency.includes(new Date(date).getDay())
    ).length;

    return Math.round((completed / total) * 100);
  };

  // Check if a day is scheduled for a habit
  const isScheduledDay = (habit: Habit, dayOfWeek: number) => {
    return habit?.frequency?.includes(dayOfWeek) ?? false;
  };

  // Check if a habit is completed on a date
  const isCompleted = (habit: Habit, date: string) => {
    return habit?.completions?.[date] ?? false;
  };

  // Navigation functions
  function previousWeek() {
    weekOffset--;
  }

  function nextWeek() {
    weekOffset++;
  }

  function currentWeek() {
    weekOffset = 0;
  }

  // Check if current week
  const isCurrentWeek = $derived(weekOffset === 0);

  function getColorClasses(habit: Habit, completed: boolean) {
    switch (habit.color) {
      case 'indigo': return completed ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-indigo-500/30';
      case 'rose': return completed ? 'bg-rose-500/20 text-rose-400' : 'hover:bg-rose-500/30';
      case 'amber': return completed ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-amber-500/30';
      case 'emerald': return completed ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-emerald-500/30';
      case 'sky': return completed ? 'bg-sky-500/20 text-sky-400' : 'hover:bg-sky-500/30';
      case 'purple': return completed ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-purple-500/30';
      default: return completed ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-indigo-500/30';
    }
  }

  function getIconColorClass(habit: Habit) {
    switch (habit.color) {
      case 'indigo': return 'text-indigo-400';
      case 'rose': return 'text-rose-400';
      case 'amber': return 'text-amber-400';
      case 'emerald': return 'text-emerald-400';
      case 'sky': return 'text-sky-400';
      case 'purple': return 'text-purple-400';
      default: return 'text-indigo-400';
    }
  }
</script>

<Card title="週間進捗" enTitle="Weekly Progress">
  <div class="p-4 space-y-6">
    <!-- Week Navigation -->
    <div class="flex items-center justify-between px-2">
      <button 
        class="p-2 rounded-lg hover:bg-black/30 text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        onclick={previousWeek}
      >
        <ChevronLeft class="w-4 h-4" />
        <span class="text-sm">前週</span>
      </button>
      <div class="flex flex-col items-center">
        <div class="flex items-center gap-2 text-sm">
          <CalendarDays class="w-4 h-4 text-indigo-400" />
          <span class="text-gray-200">{formatDateRange(weekDates)}</span>
        </div>
        {#if !isCurrentWeek}
          <button 
            class="text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-2 px-3 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20"
            onclick={currentWeek}
          >
            今週に戻る
          </button>
        {/if}
      </div>
      <button 
        class="p-2 rounded-lg hover:bg-black/30 text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        onclick={nextWeek}
      >
        <span class="text-sm">次週</span>
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="text-left border-b border-white/5">
            <th class="pb-3 font-medium text-sm text-gray-400">習慣 / Habit</th>
            <th class="pb-3 font-medium text-sm text-gray-400">曜日 / Days</th>
            <th class="pb-3 font-medium text-sm text-gray-400 text-center">進捗 / Progress</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          {#each habits as habit}
            {@const progress = getProgress(habit, weekDates)}
            <tr class="group">
              <td class="py-3 min-w-[160px]">
                <div class="flex flex-col gap-1">
                  <span class="font-medium text-gray-200 max-w-[160px] truncate" title={habit.name}>{habit.name}</span>
                  <div class="flex -space-x-1">
                    {#each habit.ikigai as category}
                      {@const Icon = ikigaiIcons[category]}
                      <div class="bg-black/30 p-1 rounded-full ring-1 ring-white/5">
                        <Icon class="w-3 h-3 {getIconColorClass(habit)}" />
                      </div>
                    {/each}
                  </div>
                </div>
              </td>
              <td class="py-3">
                <div class="flex gap-1">
                  {#each weekDates as date}
                    {@const dayOfWeek = new Date(date).getDay()}
                    {@const isScheduled = isScheduledDay(habit, dayOfWeek)}
                    {@const completed = isCompleted(habit, date)}
                    <div class="relative">
                      <button
                        class={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          isScheduled ? completed ? getColorClasses(habit, true) : `bg-black/30 ${getColorClasses(habit, false)}` : 'opacity-30'
                        }`}
                        disabled={!isScheduled}
                        onclick={() => onToggleCompletion(habit.id, date)}
                      >
                        <div class="text-sm font-medium">{weekdays[dayOfWeek].label}</div>
                      </button>
                    </div>
                  {/each}
                </div>
              </td>
              <td class="py-3">
                <div class="flex justify-center">
                  <div class="relative inline-flex items-center justify-center group">
                    <svg width="44" height="44">
                      <!-- Background circle -->
                      <circle
                        stroke="rgba(255,255,255,0.05)"
                        fill="none"
                        stroke-width="4"
                        cx="22"
                        cy="22"
                        r="19"
                      ></circle>
                      
                      <!-- Progress circle -->
                      <circle
                        stroke="currentColor"
                        fill="none"
                        stroke-width="4"
                        stroke-linecap="round"
                        cx="22"
                        cy="22"
                        r="19"
                        stroke-dasharray={119.4}
                        stroke-dashoffset={119.4 - (progress / 100) * 119.4}
                        transform="rotate(-90 22 22)"
                        class={`transition-all duration-300 ease-in-out ${getIconColorClass(habit)}`}
                      ></circle>
                    </svg>
                    
                    <!-- Percentage text -->
                    <div class="absolute text-xs font-medium flex flex-col items-center">
                      <span class="text-gray-200">{progress}%</span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</Card> 