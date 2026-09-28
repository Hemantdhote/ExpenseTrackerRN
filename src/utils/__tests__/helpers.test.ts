import { formatCurrency, calculateSummary, getGreeting } from '../helpers';
import { Transaction } from '../../types';

describe('Helper Utilities', () => {
  describe('formatCurrency', () => {
    it('formats amount in Indian currency format', () => {
      expect(formatCurrency(450)).toBe('₹450');
      expect(formatCurrency(25500)).toBe('₹25,500');
      expect(formatCurrency(40000)).toBe('₹40,000');
    });

    it('formats with sign when requested', () => {
      expect(formatCurrency(40000, true, 'income')).toBe('+₹40,000');
      expect(formatCurrency(450, true, 'expense')).toBe('-₹450');
      expect(formatCurrency(-450, true)).toBe('-₹450');
    });
  });

  describe('calculateSummary', () => {
    it('correctly calculates totalBalance, totalIncome, and totalExpense', () => {
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          user_id: 'user1',
          type: 'income',
          amount: 40000,
          category: 'Salary',
          date: '2026-09-28',
        },
        {
          id: '2',
          user_id: 'user1',
          type: 'expense',
          amount: 450,
          category: 'Food',
          date: '2026-09-28',
        },
        {
          id: '3',
          user_id: 'user1',
          type: 'expense',
          amount: 14050,
          category: 'Bills',
          date: '2026-09-27',
        },
      ];

      const summary = calculateSummary(mockTransactions);
      expect(summary.totalIncome).toBe(40000);
      expect(summary.totalExpense).toBe(14500);
      expect(summary.totalBalance).toBe(25500);
    });
  });

  describe('getGreeting', () => {
    it('includes user name in greeting', () => {
      const greeting = getGreeting('Hemant');
      expect(greeting).toContain('Hemant');
    });
  });
});
