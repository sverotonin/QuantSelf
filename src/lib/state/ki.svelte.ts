import type { RatingOption } from '$lib/types';

// Update KiEntry type to include sleep times
export type KiEntry = {
  date: Date;
  genki: number;
  suimin: number;
  kibun: number;
  bedtime?: string;
  wakeTime?: string;
  sleepDuration?: number;
  hadNap?: boolean;
  note?: string;
};

const createRatingOptions = (labels: string[], kanji: string[]): RatingOption[] => [
  { value: 1, kanji: kanji[0], color: "text-red-500", label: labels[0] },
  { value: 2, kanji: kanji[1], color: "text-orange-500", label: labels[1] },
  { value: 3, kanji: kanji[2], color: "text-green-500", label: labels[2] },
  { value: 4, kanji: kanji[3], color: "text-blue-400", label: labels[3] },
  { value: 5, kanji: kanji[4], color: "text-blue-500", label: labels[4] }
];

const kiRatings = {
  // Energy (元気) - from exhausted to extremely energetic
  genki: createRatingOptions(
    ["極度に疲れている", "疲れている", "普通", "元気", "絶好調"],
    ["疲", "弱", "普", "健", "溢"]  // 疲れた→弱い→普通→健康→溢れる
  ),
  
  // Sleep (睡眠) - from poor to good sleep
  suimin: createRatingOptions(
    ["浅い", "普通", "深い", "", ""],
    ["浅", "眠", "深", "", ""]  // 浅い→眠る→深い
  ).slice(0, 3),  // Take only first 3 options with values 1, 2, 3
  
  // Mood (気分) - from depressed to elated
  kibun: createRatingOptions(
    ["憂鬱", "落込", "平静", "嬉しい", "歓喜"],
    ["憂", "沈", "静", "喜", "楽"]  // 憂鬱→沈む→静か→喜ぶ→楽しい
  )
} as const;

// State
let kiHistory = $state<KiEntry[]>([]);

// Add type for averages
type KiAverages = Record<'genki' | 'suimin' | 'kibun', number>;

// Derived values
let averages = $derived<KiAverages>({
  genki: kiHistory.length ? 
    kiHistory.reduce((sum, entry) => sum + entry.genki, 0) / kiHistory.length : 0,
  suimin: kiHistory.length ? 
    kiHistory.reduce((sum, entry) => sum + entry.suimin, 0) / kiHistory.length : 0,
  kibun: kiHistory.length ? 
    kiHistory.reduce((sum, entry) => sum + entry.kibun, 0) / kiHistory.length : 0
});

// Calculate sleep duration in hours
function calculateSleepDuration(bedtime: string, wakeTime: string): number {
  const [bedHours, bedMinutes] = bedtime.split(':').map(Number);
  const [wakeHours, wakeMinutes] = wakeTime.split(':').map(Number);
  
  let duration = wakeHours - bedHours;
  if (duration < 0) duration += 24;
  
  const minutesDiff = wakeMinutes - bedMinutes;
  return Number((duration + minutesDiff / 60).toFixed(1));
}

// Input configuration
export const inputConfig = {
  ratingConfigs: [
    {
      id: 'genki',
      label: '元気',
      enLabel: 'Energy',
      options: kiRatings.genki
    },
    {
      id: 'suimin',
      label: '睡眠',
      enLabel: 'Sleep',
      options: kiRatings.suimin
    },
    {
      id: 'kibun',
      label: '気分',
      enLabel: 'Mood',
      options: kiRatings.kibun
    }
  ],
  textInputs: [
    {
      id: 'note',
      placeholder: 'メモ / Note (optional)'
    }
  ]
};

// Getters
export function getKiHistory() {
  return kiHistory;
}

export function getAverages() {
  return averages;
}

export function getAverage(metric: 'genki' | 'suimin' | 'kibun') {
  return averages[metric];
}

// Actions
export function addKiEntry(values: Record<string, number | string | boolean>) {
  const bedtime = values.bedtime as string;
  const wakeTime = values.wakeTime as string;
  
  const entry: KiEntry = {
    date: new Date(),
    genki: values.genki as number,
    suimin: values.suimin as number,
    kibun: values.kibun as number,
    bedtime,
    wakeTime,
    hadNap: values.hadNap as boolean,
    note: values.note as string
  };

  if (bedtime && wakeTime) {
    entry.sleepDuration = calculateSleepDuration(bedtime, wakeTime);
  }

  kiHistory = [entry, ...kiHistory];
  localStorage.setItem('kiHistory', JSON.stringify(kiHistory));
}

// Remove the effect from module scope
export function initializeKiHistory() {
  $effect(() => {
    const saved = localStorage.getItem('kiHistory');
    if (saved) {
      const parsed = JSON.parse(saved);
      kiHistory = parsed.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
    }
  });
} 