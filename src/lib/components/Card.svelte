<script lang="ts">
  import type { Snippet } from 'svelte';

  const { title, enTitle, children } = $props<{
    title: string;
    enTitle?: string;
    children: Snippet;
  }>();
</script>

<div class="bg-white/[0.03] backdrop-blur-2xl rounded-lg p-6 border border-white/10 shadow-xl shadow-black/20 before:absolute before:inset-0 before:-z-10 before:bg-black/40 before:rounded-lg relative">
  <div class="mb-4 flex flex-col">
    <h2 class="text-xl font-semibold">{title}</h2>
    {#if enTitle}
      <span class="text-xs text-gray-400">{enTitle}</span>
    {/if}
  </div>
  {#if children}
    {@render children()}
  {/if}
</div> 