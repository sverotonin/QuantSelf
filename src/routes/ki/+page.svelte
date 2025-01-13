<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import InputCard from '$lib/components/InputCard.svelte';
  import HistoryLog from '$lib/components/HistoryLog.svelte';
  import KiGraph from '$lib/components/KiGraph.svelte';
  import { inputConfig, getKiHistory, getAverage, addKiEntry, initializeKiHistory } from '$lib/state/ki.svelte';
  import type { KiEntry } from '$lib/types';

  let title = $state("気トラッカー");
  
  // Initialize on component mount
  initializeKiHistory();
</script>

{#snippet analysis()}
  <div class="space-y-6 p-4">
    <div class="grid grid-cols-3 gap-4">
      {#each inputConfig.ratingConfigs as config}
        <div class="bg-gray-800 rounded-lg p-4 text-center">
          <h3 class="text-lg font-bold mb-2">
            {config.label}
            <span class="block text-xs text-gray-400">
              {config.enLabel}
            </span>
          </h3>
          <div class="text-2xl font-bold">
            {getAverage(config.id as 'genki' | 'suimin' | 'kibun').toFixed(1)}
            <span class="text-sm text-gray-400">
              {config.id === 'suimin' ? '/3' : '/5'}
            </span>
          </div>
        </div>
      {/each}
    </div>

    <KiGraph />

    {#if getKiHistory().length > 0}
      <div class="bg-gray-800 rounded-lg p-4">
        <h3 class="font-bold mb-2">最新の記録 / Latest Entry</h3>
        <div class="text-sm text-gray-300">
          <p>元気: {getKiHistory()[0].genki}/5</p>
          <p>睡眠: {getKiHistory()[0].suimin}/3</p>
          <p>気分: {getKiHistory()[0].kibun}/5</p>
          {#if getKiHistory()[0].note}
            <p class="mt-2 text-gray-400">{getKiHistory()[0].note}</p>
          {/if}
        </div>
      </div>
    {/if}
  </div>
{/snippet}

<div class="max-w-3xl mx-auto">
  <div class="mb-8 flex flex-col">
    <h1 class="text-3xl font-bold">{title}</h1>
    <span class="text-sm text-gray-500">Ki Tracker</span>
  </div>
  
  <div class="flex flex-col space-y-6">
    <InputCard 
      title="気を記録"
      enTitle="Record Ki"
      {...inputConfig}
      onSubmit={addKiEntry}
    />

    <Card title="分析" enTitle="Analysis">
      {@render analysis()}
    </Card>

    <HistoryLog 
      title="履歴" 
      enTitle="History"
      items={getKiHistory().map((entry: KiEntry) => ({
        date: entry.date,
        content: `Energy: ${entry.genki}/5, Sleep: ${entry.suimin}/3, ${entry.kibun}/5${entry.note ? ` - ${entry.note}` : ''}`
      }))}
    />
  </div>
</div> 