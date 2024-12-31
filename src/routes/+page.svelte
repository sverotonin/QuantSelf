<script lang="ts">
  let title = $state("ダッシュボード");
</script>

<div class="max-w-7xl mx-auto">
  <h1 class="text-3xl font-bold mb-8">{title}</h1>
  
  <div class="grid grid-cols-2 gap-6">
    <div class="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 class="text-xl font-semibold mb-4">習慣トラッカー</h2>
      <!-- Habits summary content -->
    </div>
    
    <div class="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 class="text-xl font-semibold mb-4">気分トラッカー</h2>
      <!-- Mood summary content -->
    </div>
    
    <div class="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 class="text-xl font-semibold mb-4">睡眠トラッカー</h2>
      <!-- Sleep summary content -->
    </div>
    
    <div class="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 class="text-xl font-semibold mb-4">予算トラッカー</h2>
      <!-- Budget summary content -->
    </div>
  </div>
</div>
