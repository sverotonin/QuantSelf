<script lang="ts">
  import Card from './Card.svelte';
  import { getCompletionsByDate } from '$lib/state/habits.svelte';

  // Add prop for handling date selection
  let props = $props<{
    onDateSelect?: (date: string) => void;
  }>();

  // Get the last year of dates
  const getYearDates = () => {
    const dates = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);

    for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
  };

  // Group dates by week for the grid
  const getWeeks = (dates: string[]) => {
    const weeks: (string | null)[][] = [];
    let currentWeek: (string | null)[] = [];

    // Get the first date and its day of week
    const firstDate = dates[0];
    const firstDayOfWeek = new Date(firstDate).getDay();

    // Pad the first week with null values
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    dates.forEach(date => {
      const dayOfWeek = new Date(date).getDay();
      
      // If we're starting a new week (Sunday) and we have a current week
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        // Pad the rest of the week if needed
        while (currentWeek.length < 7) {
          currentWeek.push(null);
        }
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(date);
      
      // Handle the last week
      if (date === dates[dates.length - 1]) {
        // Pad the rest of the week if needed
        while (currentWeek.length < 7) {
          currentWeek.push(null);
        }
        weeks.push(currentWeek);
      }
    });

    return weeks;
  };

  // Get color based on completion count
  const getColor = (completions: number) => {
    if (completions === 0) return 'bg-gray-800';
    if (completions === 1) return 'bg-indigo-900';
    if (completions === 2) return 'bg-indigo-700';
    if (completions === 3) return 'bg-indigo-500';
    return 'bg-indigo-300';
  };

  // Format date for tooltip
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const yearDates = $derived(getYearDates());
  const weeks = $derived(getWeeks(yearDates));
  const completions = $derived(getCompletionsByDate());

  const weekdays = [
    { label: '日', enLabel: 'Sun' },
    { label: '月', enLabel: 'Mon' },
    { label: '火', enLabel: 'Tue' },
    { label: '水', enLabel: 'Wed' },
    { label: '木', enLabel: 'Thu' },
    { label: '金', enLabel: 'Fri' },
    { label: '土', enLabel: 'Sat' }
  ];

  // Add click handler for grid cells
  const handleDateClick = (date: string | null) => {
    if (date && props.onDateSelect) {
      props.onDateSelect(date);
    }
  };
</script>

<Card title="年間活動" enTitle="Yearly Activity">
  <div class="p-4">
    <!-- Grid -->
    <div class="overflow-x-auto">
      <div class="flex gap-2">
        {#each weeks as week, weekIndex}
          <div class="flex flex-col gap-2">
            <!-- Month header -->
            {#if weekIndex === 0 || new Date(week.find(d => d)!).getMonth() !== new Date(weeks[weekIndex - 1].find(d => d)!).getMonth()}
              <div class="h-4 flex items-center justify-center text-xs text-gray-400">
                {new Date(week.find(d => d)!).toLocaleDateString('en-US', { month: 'short' })}
              </div>
            {:else}
              <div class="h-4" />
            {/if}

            <!-- Days -->
            {#each week as date, dayIndex}
              {#if weekIndex === 0}
                <!-- First column: show weekday labels -->
                <div class="w-4 h-4 flex items-center justify-center text-xs text-gray-400">
                  {weekdays[dayIndex].label}
                </div>
              {:else if date}
                <div 
                  class="w-4 h-4 rounded-sm transition-colors {getColor(completions[date] || 0)} cursor-pointer hover:ring-2 hover:ring-indigo-400"
                  title="{formatDate(date)}&#10;完了したタスク / Completed tasks: {completions[date] || 0}"
                  onclick={() => handleDateClick(date)}
                />
              {:else}
                <div class="w-4 h-4" />
              {/if}
            {/each}
          </div>
        {/each}
      </div>
    </div>

    <!-- Legend -->
    <div class="mt-4 flex items-center gap-2 text-xs text-gray-400">
      <span>少ない / Less</span>
      <div class="flex gap-1">
        <div class="w-3 h-3 rounded-sm bg-gray-800" />
        <div class="w-3 h-3 rounded-sm bg-indigo-900" />
        <div class="w-3 h-3 rounded-sm bg-indigo-700" />
        <div class="w-3 h-3 rounded-sm bg-indigo-500" />
        <div class="w-3 h-3 rounded-sm bg-indigo-300" />
      </div>
      <span>多い / More</span>
    </div>
  </div>
</Card> 