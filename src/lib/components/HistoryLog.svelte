<script lang="ts">
  import Card from './Card.svelte';
  
  const { title = "履歴", enTitle = "History", items = [] } = $props<{
    title?: string;
    enTitle?: string;
    items?: Array<{
      date: Date;
      content: string;
    }>;
  }>();
</script>

{#snippet content()}
  <div class="space-y-4">
    {#if items.length === 0}
      <p class="text-gray-500 text-center py-4">
        履歴なし
        <span class="block text-xs">No history</span>
      </p>
    {:else}
      {#each items as {date, content}}
        <div class="flex flex-col space-y-1 p-3 bg-gray-800 rounded-lg">
          <span class="text-sm text-gray-400">{date.toLocaleDateString('ja-JP')}</span>
          <span>{content}</span>
        </div>
      {/each}
    {/if}
  </div>
{/snippet}

<Card {title} {enTitle}>
  {@render content()}
</Card> 