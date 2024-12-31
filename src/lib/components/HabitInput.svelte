<script lang="ts">
  import Card from './Card.svelte';
  import { Heart, Briefcase, Globe, Trophy, Book, Dumbbell, Brain, Coffee, Utensils, Pencil, Music, Code, Bike, Bed, Smile, Palette } from 'lucide-svelte';

  type HabitColor = {
    id: string;
    class: string;
    hoverClass: string;
    bgClass: string;
    hoverBgClass: string;
    color: string;
  };

  const habitColors: HabitColor[] = [
    { id: 'indigo', class: 'text-indigo-400', hoverClass: 'group-hover:text-indigo-400', bgClass: 'bg-indigo-500/20', hoverBgClass: 'hover:bg-indigo-500/30', color: '#818cf8' },
    { id: 'rose', class: 'text-rose-400', hoverClass: 'group-hover:text-rose-400', bgClass: 'bg-rose-500/20', hoverBgClass: 'hover:bg-rose-500/30', color: '#fb7185' },
    { id: 'amber', class: 'text-amber-400', hoverClass: 'group-hover:text-amber-400', bgClass: 'bg-amber-500/20', hoverBgClass: 'hover:bg-amber-500/30', color: '#fbbf24' },
    { id: 'emerald', class: 'text-emerald-400', hoverClass: 'group-hover:text-emerald-400', bgClass: 'bg-emerald-500/20', hoverBgClass: 'hover:bg-emerald-500/30', color: '#34d399' },
    { id: 'sky', class: 'text-sky-400', hoverClass: 'group-hover:text-sky-400', bgClass: 'bg-sky-500/20', hoverBgClass: 'hover:bg-sky-500/30', color: '#38bdf8' },
    { id: 'purple', class: 'text-purple-400', hoverClass: 'group-hover:text-purple-400', bgClass: 'bg-purple-500/20', hoverBgClass: 'hover:bg-purple-500/30', color: '#c084fc' }
  ];

  const habitIcons = [
    { icon: Dumbbell, label: '運動', category: 'health' },
    { icon: Brain, label: '学習', category: 'education' },
    { icon: Book, label: '読書', category: 'education' },
    { icon: Coffee, label: '習慣', category: 'lifestyle' },
    { icon: Utensils, label: '食事', category: 'health' },
    { icon: Pencil, label: '創作', category: 'creativity' },
    { icon: Music, label: '音楽', category: 'creativity' },
    { icon: Code, label: '開発', category: 'work' },
    { icon: Bike, label: '運動', category: 'health' },
    { icon: Bed, label: '睡眠', category: 'health' },
    { icon: Smile, label: '気分', category: 'wellness' },
    { icon: Palette, label: '芸術', category: 'creativity' }
  ];

  interface IkigaiOption {
    id: 'passion' | 'vocation' | 'mission' | 'profession';
    label: string;
    icon: any;
    description: string;
  }

  const ikigaiOptions: IkigaiOption[] = [
    {
      id: 'passion',
      label: '情熱',
      icon: Heart,
      description: '好きなこと'
    },
    {
      id: 'mission',
      label: '使命',
      icon: Globe,
      description: '世界が必要とすること'
    },
    {
      id: 'vocation',
      label: '天職',
      icon: Trophy,
      description: '得意なこと'
    },
    {
      id: 'profession',
      label: '職業',
      icon: Briefcase,
      description: '収入を得られること'
    }
  ];

  const weekdays = [
    { id: 0, label: '日', enLabel: 'Sun' },
    { id: 1, label: '月', enLabel: 'Mon' },
    { id: 2, label: '火', enLabel: 'Tue' },
    { id: 3, label: '水', enLabel: 'Wed' },
    { id: 4, label: '木', enLabel: 'Thu' },
    { id: 5, label: '金', enLabel: 'Fri' },
    { id: 6, label: '土', enLabel: 'Sat' }
  ];

  interface HabitInputProps {
    onSubmit: (habit: {
      name: string;
      icon: any;
      color: HabitColor['id'];
      ikigai: IkigaiOption['id'][];
      frequency: number[];
    }) => void;
  }

  let props = $props();
  let { onSubmit = () => {} } = props as HabitInputProps;

  let habitName = $state('');
  let selectedIcon = $state(habitIcons[0].icon);
  let selectedColor = $state<HabitColor['id']>('indigo');
  let isIconSelectorOpen = $state(false);
  let selectedIkigai = $state<IkigaiOption['id'][]>([]);
  let selectedDays = $state<number[]>([0,1,2,3,4,5,6]);
  let isCustomFrequency = $state(false);

  function getColorClass(colorId: HabitColor['id']) {
    switch (colorId) {
      case 'indigo': return 'text-indigo-400';
      case 'rose': return 'text-rose-400';
      case 'amber': return 'text-amber-400';
      case 'emerald': return 'text-emerald-400';
      case 'sky': return 'text-sky-400';
      case 'purple': return 'text-purple-400';
      default: return 'text-indigo-400';
    }
  }

  function handleSubmit() {
    if (habitName.trim()) {
      onSubmit({
        name: habitName,
        icon: selectedIcon,
        color: selectedColor,
        ikigai: selectedIkigai,
        frequency: selectedDays
      });
      
      // Reset form
      habitName = '';
      selectedIcon = habitIcons[0].icon;
      selectedColor = 'indigo';
      selectedIkigai = [];
      selectedDays = [0,1,2,3,4,5,6];
      isCustomFrequency = false;
    }
  }
</script>

<Card title="習慣を追加" enTitle="Add Habit">
  <div class="p-4 space-y-8">
    <!-- Habit Name -->
    <div>
      <label for="habit-name" class="block text-sm font-medium mb-2">
        習慣名
        <span class="block text-xs text-gray-400">Habit Name</span>
      </label>
      <div class="flex gap-2">
        <div class="relative">
          <button
            type="button"
            class="h-10 w-10 bg-black/30 rounded-lg border border-white/5 flex items-center justify-center hover:bg-black/40 transition-colors"
            onclick={() => isIconSelectorOpen = !isIconSelectorOpen}
          >
            <div class={getColorClass(selectedColor)}>
              <svelte:component this={selectedIcon} class="w-5 h-5" />
            </div>
          </button>
          
          {#if isIconSelectorOpen}
            <div class="absolute top-full left-0 mt-2 w-64 bg-black/40 backdrop-blur-2xl rounded-lg border border-white/10 p-3 z-50 shadow-xl shadow-black/20">
              <div class="grid grid-cols-6 gap-2">
                {#each habitIcons as {icon: Icon, label}}
                  <button
                    type="button"
                    class="p-2 rounded hover:bg-black/30 transition-colors flex items-center justify-center group"
                    onclick={() => {
                      selectedIcon = Icon;
                      isIconSelectorOpen = false;
                    }}
                    title={label}
                  >
                    <div class={getColorClass(selectedColor)}>
                      <Icon class="w-5 h-5 group-hover:text-white" />
                    </div>
                  </button>
                {/each}
              </div>

              <div class="mt-3 pt-3 border-t border-white/10">
                <div class="grid grid-cols-6 gap-2">
                  {#each habitColors as color}
                    <button
                      type="button"
                      class="w-8 h-8 flex items-center justify-center group relative"
                      onclick={() => {
                        selectedColor = color.id;
                      }}
                      title={color.id}
                    >
                      <div class="absolute inset-0 rounded-full hover:bg-white/5 transition-colors" />
                      <div class={`w-6 h-6 rounded-full ${color.bgClass} ring-1 ring-white/10 transition-all ${selectedColor === color.id ? 'ring-2 ring-white/30 scale-110' : 'hover:scale-105'}`} />
                    </button>
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        </div>
        
        <input
          id="habit-name"
          type="text"
          class="flex-1 bg-black/30 rounded-lg px-4 py-2 border border-white/5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="新しい習慣の名前 / New habit name"
          bind:value={habitName}
        />
      </div>
    </div>

    <!-- Ikigai Section -->
    <div>
      <label class="block text-sm font-medium mb-3">
        生き甲斐
        <span class="block text-xs text-gray-400">Purpose</span>
      </label>
      <div class="flex gap-2">
        {#each ikigaiOptions as option}
          {@const Icon = option.icon}
          <button
            class="flex-1 p-3 rounded-lg transition-colors group relative {selectedIkigai.includes(option.id) ? 'bg-indigo-900/50' : 'bg-black/30 hover:bg-indigo-900/30'}"
            onclick={() => {
              if (selectedIkigai.includes(option.id)) {
                selectedIkigai = selectedIkigai.filter(id => id !== option.id);
              } else {
                selectedIkigai = [...selectedIkigai, option.id];
              }
            }}
          >
            <div class="flex flex-col items-center">
              <Icon 
                class={selectedIkigai.includes(option.id) ? "w-6 h-6 text-indigo-400" : "w-6 h-6 text-gray-400 group-hover:text-indigo-400"}
              />
              <div class="mt-2 font-medium text-sm">{option.label}</div>
              <div class="text-xs text-gray-400 mt-1">{option.description}</div>
            </div>
          </button>
        {/each}
      </div>
    </div>

    <!-- Frequency Section -->
    <div>
      <label class="block text-sm font-medium mb-3">
        頻度
        <span class="block text-xs text-gray-400">Frequency</span>
      </label>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5">
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="custom-frequency"
              class="rounded bg-black/30 border-white/10 text-indigo-600 focus:ring-indigo-500"
              bind:checked={isCustomFrequency}
              onchange={() => {
                if (!isCustomFrequency) {
                  selectedDays = [0,1,2,3,4,5,6];
                }
              }}
            />
            <label for="custom-frequency" class="text-sm">
              カスタム頻度
              <span class="text-xs text-gray-400">Custom Frequency</span>
            </label>
          </div>
          {#if !isCustomFrequency}
            <span class="text-sm text-indigo-400">
              毎日
              <span class="text-xs text-gray-400">Daily</span>
            </span>
          {/if}
        </div>

        {#if isCustomFrequency}
          <div class="grid grid-cols-7 gap-2">
            {#each weekdays as day}
              <button
                class="p-2 rounded-lg text-sm font-medium transition-colors flex flex-col items-center {selectedDays.includes(day.id) ? 'bg-indigo-900/50' : 'bg-black/30 hover:bg-indigo-900/30'}"
                onclick={() => {
                  if (selectedDays.includes(day.id)) {
                    selectedDays = selectedDays.filter(id => id !== day.id);
                  } else {
                    selectedDays = [...selectedDays, day.id];
                  }
                }}
              >
                <div class="font-medium">{day.label}</div>
                <div class="text-xs text-gray-400">{day.enLabel}</div>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Submit Button -->
    <button
      class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!habitName.trim() || selectedDays.length === 0}
      onclick={handleSubmit}
    >
      追加
      <span class="text-indigo-200">Add</span>
    </button>
  </div>
</Card> 