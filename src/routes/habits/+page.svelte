<script lang="ts">
  import HabitInput from '$lib/components/HabitInput.svelte';
  import HabitWeeklyView from '$lib/components/HabitWeeklyView.svelte';
  import HabitGrid from '$lib/components/HabitGrid.svelte';
  import { addHabit, getHabits, toggleHabitCompletion, initializeHabits } from '$lib/state/habits.svelte';

  let title = $state("習慣トラッカー");
  let weekOffset = $state(0);
  
  initializeHabits();
  const habits = $derived(getHabits());

  const handleDateSelect = (date: string) => {
    const selectedDate = new Date(date);
    const today = new Date();
    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    weekOffset = Math.floor(diffDays / 7);
  };
</script>

<div class="px-4 pb-24">
  <header class="mb-6 mt-2">
    <h1 class="text-2xl font-bold tracking-tight">{title}</h1>
    <span class="text-xs text-gray-400 tracking-wide">Habit Tracker</span>
  </header>
  
  <div class="space-y-4">
    <!-- Habit Input -->
    <section class="bg-white/5 rounded-xl overflow-hidden">
      <div class="p-4">
        <HabitInput onSubmit={addHabit} />
      </div>
    </section>

    <!-- Weekly Progress -->
    <section class="bg-white/5 rounded-xl overflow-hidden">
      <div class="p-4">
        <HabitWeeklyView 
          habits={habits}
          onToggleCompletion={toggleHabitCompletion}
          bind:weekOffset
        />
      </div>
    </section>

    <!-- Yearly Activity -->
    <section class="bg-white/5 rounded-xl overflow-hidden">
      <div class="p-4">
        <HabitGrid onDateSelect={handleDateSelect} />
      </div>
    </section>
  </div>
</div> 