interface Transaction {
  date: Date;
  content: string;
  amount: number;
}

let transactions = $state<Transaction[]>([]);
let totalExpenses = $derived(transactions.reduce((sum, t) => sum + t.amount, 0));
let monthlyAverage = $derived(() => {
  if (transactions.length === 0) return 0;
  const months = new Set(
    transactions.map(t => `${t.date.getFullYear()}-${t.date.getMonth()}`)
  ).size;
  return totalExpenses / Math.max(1, months);
});

export function getTransactions() {
  return transactions;
}

export function getTotalExpenses() {
  return totalExpenses;
}

export function getMonthlyAverage() {
  return monthlyAverage;
}

export function addTransaction(value: string) {
  const [amount, ...descParts] = value.split(' ');
  transactions = [...transactions, {
    date: new Date(),
    amount: Number(amount) || 0,
    content: descParts.join(' ') || 'No description'
  }];
} 