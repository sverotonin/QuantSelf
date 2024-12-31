<script lang="ts">
  import Rating from '$lib/components/Rating.svelte';
  import Card from '$lib/components/Card.svelte';
  import type { RatingOption } from '$lib/types';

  const moodOptions: RatingOption[] = [
    { value: 1, kanji: '悪', color: 'bg-red-500' },
    { value: 2, kanji: '微', color: 'bg-orange-500' },
    { value: 3, kanji: '普', color: 'bg-yellow-500' },
    { value: 4, kanji: '良', color: 'bg-green-500' },
    { value: 5, kanji: '優', color: 'bg-blue-500' }
  ];

  const energyOptions: RatingOption[] = [
    { value: 1, kanji: '疲', color: 'bg-red-500' },
    { value: 2, kanji: '弱', color: 'bg-orange-500' },
    { value: 3, kanji: '普', color: 'bg-yellow-500' },
    { value: 4, kanji: '強', color: 'bg-green-500' },
    { value: 5, kanji: '極', color: 'bg-blue-500' }
  ];

  const sleepOptions: RatingOption[] = [
    { value: 1, kanji: '悪', color: 'bg-red-500' },
    { value: 2, kanji: '微', color: 'bg-orange-500' },
    { value: 3, kanji: '普', color: 'bg-yellow-500' },
    { value: 4, kanji: '良', color: 'bg-green-500' },
    { value: 5, kanji: '優', color: 'bg-blue-500' }
  ];

  let mood = $state(3);
  let energy = $state(3);
  let sleep = $state(3);
</script>

<div class="max-w-3xl mx-auto">
  <Card title="気分トラッカー" enTitle="Ki Tracker">
    <div class="p-6 space-y-8">
      <div class="space-y-6">
        <Rating 
          options={moodOptions} 
          value={mood} 
          onChange={(v) => mood = v} 
          type="mood"
        />
        
        <Rating 
          options={energyOptions} 
          value={energy} 
          onChange={(v) => energy = v}
          type="energy"
        />
        
        <Rating 
          options={sleepOptions} 
          value={sleep} 
          onChange={(v) => sleep = v}
          type="sleep"
        />
      </div>
    </div>
  </Card>

