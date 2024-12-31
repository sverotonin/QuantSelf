<!-- KiGraph.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, type ChartConfiguration, type ChartTypeRegistry } from 'chart.js/auto';
  import { getKiHistory } from '$lib/state/ki.svelte';
  
  type TimeRange = 'week' | 'month' | 'year';
  
  let canvas: HTMLCanvasElement;
  let chart: Chart;
  let timeRange = $state<TimeRange>('week');

  // Generate placeholder data
  const generateData = (timeRange: TimeRange) => {
    if (timeRange === 'year') {
      // Generate monthly averages for year view
      return Array.from({ length: 12 }, (_, month) => {
        // Generate daily data for the month
        const daysInMonth = new Date(2024, month + 1, 0).getDate();
        const monthData = Array.from({ length: daysInMonth }, (_, day) => ({
          genki: Math.max(1, Math.min(5, Math.round((3 + Math.cos(day / 4) + Math.random() * 0.5) * 10) / 10)),
          suimin: Math.max(1, Math.min(5, Math.round((3.5 + Math.sin(day / 3) + Math.random() * 0.5) * 10) / 10)),
          kibun: Math.max(1, Math.min(5, Math.round((4 + Math.sin(day / 2.5) + Math.random() * 0.5) * 10) / 10)),
          duration: Math.max(4, Math.min(10, 7 + Math.sin(day / 3) + Math.random())),
          hadNap: Math.random() > 0.7
        }));

        // Calculate monthly averages
        const monthlyAvg = {
          date: new Date(2024, month, 1),
          genki: Number((monthData.reduce((sum, d) => sum + d.genki, 0) / daysInMonth).toFixed(1)),
          suimin: Number((monthData.reduce((sum, d) => sum + d.suimin, 0) / daysInMonth).toFixed(1)),
          kibun: Number((monthData.reduce((sum, d) => sum + d.kibun, 0) / daysInMonth).toFixed(1)),
          duration: Number((monthData.reduce((sum, d) => sum + d.duration, 0) / daysInMonth).toFixed(1)),
          hadNap: monthData.filter(d => d.hadNap).length > daysInMonth * 0.5 // Show nap indicator if more than 50% days had naps
        };
        return monthlyAvg;
      });
    } else {
      // Regular daily data for week and month views
      const days = timeRange === 'week' ? 7 : 30;
      return Array.from({ length: days }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        genki: Math.max(1, Math.min(5, Math.round((3 + Math.cos(i / 4) + Math.random() * 0.5) * 10) / 10)),
        suimin: Math.max(1, Math.min(5, Math.round((3.5 + Math.sin(i / 3) + Math.random() * 0.5) * 10) / 10)),
        kibun: Math.max(1, Math.min(5, Math.round((4 + Math.sin(i / 2.5) + Math.random() * 0.5) * 10) / 10)),
        duration: Math.max(4, Math.min(10, 7 + Math.sin(i / 3) + Math.random())),
        hadNap: Math.random() > 0.7
      }));
    }
  };

  const getKanji = (value: number): string => {
    if (value <= 1) return '弱';
    if (value <= 2) return '低';
    if (value <= 3) return '中';
    if (value <= 4) return '良';
    return '優';
  };

  const updateChart = () => {
    if (!canvas) return;
    
    const data = generateData(timeRange);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = {
      type: 'bar' as const,
      data: {
        labels: data.map(d => d.date.toLocaleDateString('ja-JP', { 
          month: timeRange === 'year' ? 'long' : 'short',
          day: timeRange === 'year' ? undefined : 'numeric'
        })),
        datasets: [
          {
            type: 'bar' as const,
            label: '睡眠時間',
            data: data.map(d => d.duration),
            backgroundColor: data.map(d => {
              if (!d.hadNap) return 'rgba(255,255,255,0.05)';
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, 'rgba(245,158,11,0.1)');    // Amber for nap
              gradient.addColorStop(0.15, 'rgba(245,158,11,0.1)');
              gradient.addColorStop(0.15, 'rgba(255,255,255,0.05)');
              gradient.addColorStop(1, 'rgba(255,255,255,0.05)');
              return gradient;
            }),
            borderRadius: 8,
            borderSkipped: false,
            yAxisID: 'y1',
            order: 1
          },
          {
            type: 'line' as const,
            label: '元気',
            data: data.map(d => d.genki),
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b20',
            borderWidth: 2,
            tension: 0.4,
            yAxisID: 'y',
            order: 0
          },
          {
            type: 'line' as const,
            label: '睡眠質',
            data: data.map(d => d.suimin),
            borderColor: '#818cf8',
            backgroundColor: '#818cf820',
            borderWidth: 2,
            tension: 0.4,
            yAxisID: 'y',
            order: 0
          },
          {
            type: 'line' as const,
            label: '気分',
            data: data.map(d => d.kibun),
            borderColor: '#f43f5e',
            backgroundColor: '#f43f5e20',
            borderWidth: 2,
            tension: 0.4,
            yAxisID: 'y',
            order: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#e5e7eb',
            bodyColor: '#e5e7eb',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              afterLabel: function(context) {
                if (context.dataset.type === 'bar') {
                  const index = context.dataIndex;
                  const hadNap = data[index].hadNap;
                  return hadNap ? (timeRange === 'year' ? '昼寝が多い月 / Frequent naps' : '昼寝あり / Had nap') : '';
                } else {
                  const value = context.raw as number;
                  return `状態: ${getKanji(value)}`;
                }
              }
            }
          },
          legend: {
            position: 'top',
            labels: {
              font: {
                family: "'Noto Sans JP', sans-serif",
                size: 12
              },
              color: '#9ca3af',
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255,255,255,0.05)',
              tickColor: 'transparent'
            },
            ticks: {
              color: '#9ca3af',
              font: {
                size: 11
              }
            }
          },
          y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            min: 1,
            max: 5,
            ticks: {
              stepSize: 1,
              color: '#9ca3af',
              font: {
                size: 11
              }
            },
            grid: {
              color: 'rgba(255,255,255,0.05)',
              tickColor: 'transparent'
            },
            title: {
              display: true,
              text: '評価 / Rating',
              color: '#9ca3af',
              font: {
                size: 11
              }
            }
          },
          y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            min: 0,
            max: 12,
            grid: {
              drawOnChartArea: false,
              tickColor: 'transparent'
            },
            ticks: {
              stepSize: 2,
              color: '#9ca3af',
              font: {
                size: 11
              },
              callback: function(value) {
                return value + '時間';
              }
            },
            title: {
              display: true,
              text: '睡眠時間 / Sleep Duration',
              color: '#9ca3af',
              font: {
                size: 11
              }
            }
          }
        }
      }
    } satisfies ChartConfiguration;

    if (chart) chart.destroy();
    chart = new Chart(canvas, config);
  };

  $effect(() => {
    if (timeRange) {
      updateChart();
    }
  });

  onMount(() => {
    updateChart();
  });
</script>

<div class="w-full space-y-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium text-gray-400">表示期間</span>
      <span class="text-xs text-gray-500">Time Range</span>
    </div>
    <div class="flex bg-black/30 p-1 rounded-lg border border-white/5">
      <button 
        class="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
        class:selected={timeRange === 'week'}
        class:text-gray-200={timeRange === 'week'}
        class:text-gray-400={timeRange !== 'week'}
        class:hover:text-gray-200={timeRange !== 'week'}
        onclick={() => timeRange = 'week'}
      >
        週間
        <span class="text-xs opacity-50">Week</span>
      </button>
      <button 
        class="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
        class:selected={timeRange === 'month'}
        class:text-gray-200={timeRange === 'month'}
        class:text-gray-400={timeRange !== 'month'}
        class:hover:text-gray-200={timeRange !== 'month'}
        onclick={() => timeRange = 'month'}
      >
        月間
        <span class="text-xs opacity-50">Month</span>
      </button>
      <button 
        class="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
        class:selected={timeRange === 'year'}
        class:text-gray-200={timeRange === 'year'}
        class:text-gray-400={timeRange !== 'year'}
        class:hover:text-gray-200={timeRange !== 'year'}
        onclick={() => timeRange = 'year'}
      >
        年間
        <span class="text-xs opacity-50">Year</span>
      </button>
    </div>
  </div>
  
  <div class="bg-black/30 backdrop-blur-sm rounded-xl border border-white/5 p-6">
    <div class="h-[400px] w-full">
      <canvas bind:this={canvas}></canvas>
    </div>
  </div>

  <div class="grid grid-cols-4 gap-4 text-center text-xs text-gray-400">
    <div class="flex flex-col items-center gap-1">
      <div class="w-3 h-3 rounded-full bg-amber-400/20 ring-1 ring-amber-400/30" />
      <span>元気 / Energy</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <div class="w-3 h-3 rounded-full bg-indigo-400/20 ring-1 ring-indigo-400/30" />
      <span>睡眠質 / Sleep Quality</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <div class="w-3 h-3 rounded-full bg-rose-400/20 ring-1 ring-rose-400/30" />
      <span>気分 / Mood</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <div class="w-3 h-3 rounded-full bg-gray-400/20 ring-1 ring-gray-400/30" />
      <span>睡眠時間 / Sleep Duration</span>
    </div>
  </div>
</div> 

<style lang="postcss">
  .selected {
    @apply bg-white/10;
  }
</style> 