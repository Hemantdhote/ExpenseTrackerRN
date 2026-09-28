export interface CategoryConfig {
  id: string;
  name: string;
  type: 'expense' | 'income';
  icon: string;
  color: string;
  bgColor: string;
}

export const EXPENSE_CATEGORIES: CategoryConfig[] = [
  { id: 'food', name: 'Food', type: 'expense', icon: '🍽️', color: '#F97316', bgColor: '#FFF7ED' },
  { id: 'shopping', name: 'Shopping', type: 'expense', icon: '🛍️', color: '#8B5CF6', bgColor: '#F5F3FF' },
  { id: 'transport', name: 'Transport', type: 'expense', icon: '🚗', color: '#0EA5E9', bgColor: '#F0F9FF' },
  { id: 'bills', name: 'Bills', type: 'expense', icon: '🧾', color: '#EC4899', bgColor: '#FDF2F8' },
  { id: 'entertainment', name: 'Entertainment', type: 'expense', icon: '🎬', color: '#F43F5E', bgColor: '#FFF1F2' },
  { id: 'health', name: 'Health', type: 'expense', icon: '🩺', color: '#10B981', bgColor: '#ECFDF5' },
  { id: 'education', name: 'Education', type: 'expense', icon: '🎓', color: '#6366F1', bgColor: '#EEF2FF' },
  { id: 'other_expense', name: 'Other', type: 'expense', icon: '🏷️', color: '#64748B', bgColor: '#F8FAFC' },
];

export const INCOME_CATEGORIES: CategoryConfig[] = [
  { id: 'salary', name: 'Salary', type: 'income', icon: '💼', color: '#10B981', bgColor: '#ECFDF5' },
  { id: 'freelance', name: 'Freelance', type: 'income', icon: '💻', color: '#06B6D4', bgColor: '#ECFEFF' },
  { id: 'business', name: 'Business', type: 'income', icon: '🏢', color: '#3B82F6', bgColor: '#EFF6FF' },
  { id: 'investment', name: 'Investment', type: 'income', icon: '📈', color: '#8B5CF6', bgColor: '#F5F3FF' },
  { id: 'other_income', name: 'Other', type: 'income', icon: '💰', color: '#64748B', bgColor: '#F8FAFC' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const getCategoryByName = (name: string, type?: 'expense' | 'income'): CategoryConfig => {
  const normalized = name.toLowerCase().trim();
  const match = ALL_CATEGORIES.find(
    c => c.name.toLowerCase() === normalized && (type ? c.type === type : true)
  );
  if (match) return match;

  // Fallback category
  return {
    id: normalized,
    name: name,
    type: type || 'expense',
    icon: type === 'income' ? '💰' : '🏷️',
    color: '#64748B',
    bgColor: '#F1F5F9',
  };
};
