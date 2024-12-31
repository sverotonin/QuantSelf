<script lang="ts">
  import Card from './Card.svelte';
  import Rating from './Rating.svelte';
  import TimeSelect from './TimeSelect.svelte';
  import type { RatingOption } from '$lib/types';

  interface RatingConfig {
    id: string;
    label: string;
    enLabel: string;
    options: RatingOption[];
  }

  interface TextInput {
    id: string;
    placeholder: string;
  }

  interface InputCardProps {
    title: string;
    enTitle: string;
    ratingConfigs: RatingConfig[];
    textInputs: TextInput[];
    onSubmit: (values: Record<string, number | string | boolean>) => void;
  }

  let props = $props();
  let { 
    title = '', 
    enTitle = '', 
    ratingConfigs = [], 
    textInputs = [], 
    onSubmit = () => {} 
  } = props as InputCardProps;

  let values = $state<Record<string, number | string | boolean>>({});
  let bedtime = $state('');
  let wakeTime = $state('');
  let hadNap = $state(false);

  function handleSubmit() {
    onSubmit({
      ...values,
      bedtime,
      wakeTime,
      hadNap
    });
    
    // Reset form
    values = {};
    bedtime = '';
    wakeTime = '';
    hadNap = false;
  }

  function isEnergyOrMood(config: RatingConfig): boolean {
    return config.id === 'kibun' || config.id === 'genki';
  }

  function calculateSleepDuration(): string | null {
    if (!bedtime || !wakeTime) return null;
    const [bedHours, bedMinutes] = bedtime.split(':').map(Number);
    const [wakeHours, wakeMinutes] = wakeTime.split(':').map(Number);
    let duration = wakeHours - bedHours;
    if (duration < 0) duration += 24;
    const minutesDiff = wakeMinutes - bedMinutes;
    return (duration + minutesDiff / 60).toFixed(1);
  }

  $effect(() => {
    // Initialize default values for ratings
    if (ratingConfigs) {
      ratingConfigs.forEach((config: RatingConfig) => {
        if (!(config.id in values)) {
          values[config.id] = 3;
        }
      });
    }
  });
</script>

<Card {title} {enTitle}>
  <div class="p-4 space-y-6">
    <!-- Mood and Energy Section -->
    {#if ratingConfigs.length > 0}
      <div class="grid grid-cols-2 gap-4">
        {#each ratingConfigs.filter(isEnergyOrMood) as config}
          <div>
            <h3 class="text-lg font-medium mb-2">
              {config.label}
              <span class="block text-xs text-gray-400">{config.enLabel}</span>
            </h3>
            <Rating 
              options={config.options}
              value={values[config.id] as number || 3}
              onChange={(v: number) => values[config.id] = v}
            />
          </div>
        {/each}
      </div>

      <!-- Sleep Section -->
      <div class="border-t pt-4">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 class="text-lg font-medium mb-2">
              睡眠
              <span class="block text-xs text-gray-400">Sleep Quality</span>
            </h3>
            <Rating 
              options={ratingConfigs.find((c: RatingConfig) => c.id === 'suimin')?.options || []}
              value={values.suimin as number || 3}
              onChange={(v: number) => values.suimin = v}
            />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <TimeSelect
              title="就寝時間"
              enTitle="Bedtime"
              value={bedtime}
              onChange={(v: string) => bedtime = v}
            />
            <TimeSelect
              title="起床時間"
              enTitle="Wake time"
              value={wakeTime}
              onChange={(v: string) => wakeTime = v}
            />
          </div>
        </div>

        <div class="flex items-center justify-between text-sm text-gray-400">
          {#if bedtime && wakeTime}
            <div>
              睡眠時間 / Sleep Duration: 
              <span class="font-medium text-white">
                {calculateSleepDuration()}
                時間
              </span>
            </div>
          {/if}
          <label class="flex items-center gap-2">
            <input 
              type="checkbox" 
              class="rounded bg-gray-700 border-gray-600 text-indigo-500 focus:ring-indigo-500"
              bind:checked={hadNap}
            />
            昼寝をした / Had a nap
          </label>
        </div>
      </div>
    {/if}

    <!-- Note Section -->
    {#each textInputs as input}
      <div>
        <input
          type="text"
          class="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder={input.placeholder}
          value={values[input.id] as string}
          oninput={(e) => values[input.id] = (e.target as HTMLInputElement).value}
        />
      </div>
    {/each}

    <!-- Submit Button -->
    <button
      class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      onclick={handleSubmit}
    >
      記録する / Record
    </button>
  </div>
</Card> 