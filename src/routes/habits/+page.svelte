<script lang="ts">
  import HabitInput from '$lib/components/HabitInput.svelte';
  import HabitWeeklyView from '$lib/components/HabitWeeklyView.svelte';
  import HabitGrid from '$lib/components/HabitGrid.svelte';
  import { addHabit, getHabits, toggleHabitCompletion, initializeHabits } from '$lib/state/habits.svelte';

  let title = $state("習慣トラッカー");
  let weekOffset = $state(0);
  
  // Initialize on component mount
  initializeHabits();

  // Get derived values
  const habits = $derived(getHabits());

  // Handle date selection from grid
  const handleDateSelect = (date: string) => {
    const selectedDate = new Date(date);
    const today = new Date();
    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    weekOffset = Math.floor(diffDays / 7);
  };
</script>

<div class="max-w-3xl mx-auto">
  <div class="mb-8 flex flex-col">
    <h1 class="text-3xl font-bold">{title}</h1>
    <span class="text-sm text-gray-500">Habit Tracker</span>
  </div>
  
  <div class="flex flex-col space-y-6">
    <!-- Habit Input -->
    <HabitInput onSubmit={addHabit} />

    <!-- Weekly Progress -->
    <HabitWeeklyView 
      habits={habits}
      onToggleCompletion={toggleHabitCompletion}
      bind:weekOffset
    />

    <!-- Yearly Activity -->
    <HabitGrid onDateSelect={handleDateSelect} />
  </div>
</div> 