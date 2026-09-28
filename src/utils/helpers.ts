import { Transaction } from '../types';

export const formatCurrency = (
  amount: number,
  showSign = false,
  type?: 'income' | 'expense'
): string => {
  const isNegative = amount < 0;
  const absolute = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(absolute);

  if (showSign) {
    let sign = '+';
    if (type) {
      sign = type === 'income' ? '+' : '-';
    } else {
      sign = isNegative ? '-' : '+';
    }
    return `${sign}₹${formatted}`;
  }

  if (isNegative) {
    return `-₹${formatted}`;
  }

  return `₹${formatted}`;
};

export const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    const day = date.getDate();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
};

export const formatMonthYear = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Other';
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch {
    return 'Other';
  }
};

export const getGreeting = (name?: string): string => {
  const hour = new Date().getHours();
  let timeGreeting = 'Good Morning';
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good Afternoon';
  } else if (hour >= 17 || hour < 4) {
    timeGreeting = 'Good Evening';
  }
  return name ? `${timeGreeting}, ${name}` : timeGreeting;
};

export const calculateSummary = (transactions: Transaction[]) => {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of transactions) {
    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      totalIncome += amt;
    } else {
      totalExpense += amt;
    }
  }

  const totalBalance = totalIncome - totalExpense;

  return {
    totalBalance,
    totalIncome,
    totalExpense,
  };
};

export interface GroupedTransactions {
  month: string;
  data: Transaction[];
}

export const groupTransactionsByMonth = (transactions: Transaction[]): GroupedTransactions[] => {
  const groups: { [key: string]: Transaction[] } = {};

  // Sort descending by date
  const sorted = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  for (const t of sorted) {
    const monthKey = formatMonthYear(t.date);
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(t);
  }

  return Object.keys(groups).map(month => ({
    month,
    data: groups[month],
  }));
};
