<script lang="ts">
  import Card from './Card.svelte';
  import Rating from './Rating.svelte';

  let note = $state("");
  let moodRating = $state(3);
  let energyRating = $state(3);

  const { onSubmit } = $props<{
    onSubmit: (mood: number, energy: number, note: string) => void;
  }>();

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    onSubmit(moodRating, energyRating, note.trim());
    note = "";
    moodRating = 3;
    energyRating = 3;
  }
</script>

{#snippet content()}
  <form on:submit={handleSubmit} class="space-y-4">
    <div class="space-y-2">
      <label class="block text-sm text-gray-400">気分 / Mood</label>
      <Rating type="mood" value={moodRating} onchange={(e) => moodRating = e.detail} />
    </div>

    <div class="space-y-2">
      <label class="block text-sm text-gray-400">エネルギー / Energy</label>
      <Rating type="energy" value={energyRating} onchange={(e) => energyRating = e.detail} />
    </div>

    <input
      type="text"
      bind:value={note}
      class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-600"
      placeholder="メモ / Note (optional)"
    />

    <button
      type="submit"
      class="w-full bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
    >
      記録 <span class="text-xs text-gray-500">Record</span>
    </button>
  </form>
{/snippet}

<Card title="気分を記録" enTitle="Record Mood">
  {@render content()}
</Card> 