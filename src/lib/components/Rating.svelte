<script lang="ts">
  import type { RatingOption } from '$lib/types';
  import { Battery, Moon, Smile } from 'lucide-svelte';

  interface RatingProps {
    options: RatingOption[];
    value: number;
    onChange: (value: number) => void;
    type?: 'energy' | 'mood' | 'sleep';
  }

  let { options, value, onChange, type = 'mood' } = $props<RatingProps>();

  const getIcon = (type: string) => {
    switch (type) {
      case 'energy': return Battery;
      case 'mood': return Smile;
      case 'sleep': return Moon;
      default: return Smile;
    }
  };

  const getButtonClasses = (isSelected: boolean, type: string) => {
    const baseClasses = 'w-12 h-12 rounded-lg flex flex-col items-center justify-center transition-all relative group';
    const bgClasses = isSelected 
      ? `bg-gradient-to-br ${
          type === 'energy' ? 'from-amber-500/30 to-amber-600/20' :
          type === 'mood' ? 'from-indigo-500/30 to-indigo-600/20' :
          type === 'sleep' ? 'from-purple-500/30 to-purple-600/20' :
          'from-indigo-500/30 to-indigo-600/20'
        }`
      : 'bg-black/30 hover:bg-black/40';
    return `${baseClasses} ${bgClasses}`;
  };

  const getTextClasses = (isSelected: boolean, type: string) => {
    const baseClasses = 'text-lg font-medium transition-colors';
    const colorClasses = isSelected
      ? type === 'energy' ? 'text-amber-300' :
        type === 'mood' ? 'text-indigo-300' :
        type === 'sleep' ? 'text-purple-300' :
        'text-indigo-300'
      : 'text-gray-400 group-hover:text-gray-300';
    return `${baseClasses} ${colorClasses}`;
  };

  const getIconClasses = (type: string) => {
    const baseClasses = 'w-4 h-4';
    const colorClasses = 
      type === 'energy' ? 'text-amber-400' :
      type === 'mood' ? 'text-indigo-400' :
      type === 'sleep' ? 'text-purple-400' :
      'text-indigo-400';
    return `${baseClasses} ${colorClasses}`;
  };
</script>

<div class="relative">
  <div class="flex gap-1.5">
    {#each options as option}
      {@const isSelected = value === option.value}
      <button
        class={getButtonClasses(isSelected, type)}
        onclick={() => onChange(option.value)}
      >
        <span class={getTextClasses(isSelected, type)}>
          {option.kanji}
        </span>
        <div class="absolute inset-0 rounded-lg ring-1 ring-white/5 pointer-events-none" />
        {#if isSelected}
          <div class="absolute inset-0 rounded-lg ring-2 ring-white/20 pointer-events-none" />
        {/if}
      </button>
    {/each}
  </div>
  {#if true}
    {@const Icon = getIcon(type)}
    <div class="absolute -top-6 left-0 flex items-center gap-2">
      <Icon class={getIconClasses(type)} />
      <span class="text-xs text-gray-400">{type === 'energy' ? 'Energy' : type === 'mood' ? 'Mood' : 'Sleep'}</span>
    </div>
  {/if}
</div> 