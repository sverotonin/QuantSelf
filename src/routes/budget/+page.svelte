<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import InputCard from '$lib/components/InputCard.svelte';
  import HistoryLog from '$lib/components/HistoryLog.svelte';
  import { 
    getTransactions, 
    getTotalExpenses, 
    getMonthlyAverage, 
    addTransaction 
  } from '$lib/state/budget.svelte.ts';

  let title = $state("予算トラッカー");

  $effect(() => {
    localStorage.setItem('transactions', JSON.stringify(getTransactions()));
  });
</script>

<div class="max-w-3xl mx-auto">
  <div class="mb-8">
    <h1 class="text-3xl font-bold">{title}</h1>
    <span class="text-sm text-gray-500">Budget Tracker</span>
  </div>
  
  <div class="flex flex-col space-y-6">
    <InputCard 
      title="支出を記録"
      enTitle="Record Expense"
      placeholder="金額と内容を入力 / Enter amount and description" 
      onSubmit={addTransaction}
    />

    <Card 
      title="予算概要"
      enTitle="Budget Overview"
    >
      <div class="p-4 space-y-2">
        <p>総支出 / Total Expenses: ¥{getTotalExpenses().toLocaleString()}</p>
        <p>月平均 / Monthly Average: ¥{getMonthlyAverage().toLocaleString()}</p>
      </div>
    </Card>

    <HistoryLog 
      title="取引履歴"
      enTitle="Transaction History"
      items={getTransactions().map(t => ({
        date: t.date,
        content: `¥${t.amount.toLocaleString()} - ${t.content}`
      }))} 
    />
  </div>
</div> 