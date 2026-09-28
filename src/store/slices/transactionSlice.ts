import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { Transaction, TransactionFilter, TransactionType } from '../../types';

const TRANSACTIONS_KEY = '@expense_tracker_transactions';

const INITIAL_DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    user_id: 'demo_user_hemant',
    type: 'expense',
    amount: 450,
    category: 'Food',
    note: 'Dinner',
    date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: 'tx_2',
    user_id: 'demo_user_hemant',
    type: 'income',
    amount: 40000,
    category: 'Salary',
    note: 'Monthly Salary',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: 'tx_3',
    user_id: 'demo_user_hemant',
    type: 'expense',
    amount: 120,
    category: 'Transport',
    note: 'Metro card recharge',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: 'tx_4',
    user_id: 'demo_user_hemant',
    type: 'expense',
    amount: 850,
    category: 'Shopping',
    note: 'Weekly essentials',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: 'tx_5',
    user_id: 'demo_user_hemant',
    type: 'expense',
    amount: 13080,
    category: 'Bills',
    note: 'House rent & utilities',
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
];

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  filterType: TransactionFilter;
  searchQuery: string;
  selectedCategory: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  filterType: 'all',
  searchQuery: '',
  selectedCategory: null,
};

// Fetch Transactions
export const fetchTransactions = createAsyncThunk<Transaction[]>(
  'transactions/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        return (data || []).map((t: any) => ({
          ...t,
          amount: Number(t.amount),
        }));
      } else {
        // Fallback local storage
        const stored = await AsyncStorage.getItem(TRANSACTIONS_KEY);
        if (stored) {
          return JSON.parse(stored) as Transaction[];
        }
        // Save initial demo set if empty
        await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_DEMO_TRANSACTIONS));
        return INITIAL_DEMO_TRANSACTIONS;
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Unable to load transactions');
    }
  }
);

// Add Transaction
export const addTransaction = createAsyncThunk<
  Transaction,
  {
    type: TransactionType;
    amount: number;
    category: string;
    note?: string;
    date: string;
  }
>(
  'transactions/addTransaction',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const userId = state.auth.user?.id || 'demo_user_hemant';

      if (isSupabaseConfigured()) {
        const insertPayload = {
          user_id: userId,
          type: payload.type,
          amount: payload.amount,
          category: payload.category,
          note: payload.note || null,
          date: payload.date,
        };

        const { data, error } = await supabase
          .from('transactions')
          .insert(insertPayload)
          .select()
          .single();

        if (error) throw error;
        return {
          ...data,
          amount: Number(data.amount),
        };
      } else {
        const newTx: Transaction = {
          id: 'tx_' + Date.now(),
          user_id: userId,
          type: payload.type,
          amount: payload.amount,
          category: payload.category,
          note: payload.note,
          date: payload.date,
          created_at: new Date().toISOString(),
        };

        const currentTxs: Transaction[] = state.transactions.transactions;
        const updated = [newTx, ...currentTxs];
        await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
        return newTx;
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add transaction');
    }
  }
);

// Update Transaction
export const updateTransaction = createAsyncThunk<
  Transaction,
  {
    id: string;
    type: TransactionType;
    amount: number;
    category: string;
    note?: string;
    date: string;
  }
>(
  'transactions/updateTransaction',
  async (payload, { getState, rejectWithValue }) => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('transactions')
          .update({
            type: payload.type,
            amount: payload.amount,
            category: payload.category,
            note: payload.note || null,
            date: payload.date,
            updated_at: new Date().toISOString(),
          })
          .eq('id', payload.id)
          .select()
          .single();

        if (error) throw error;
        return {
          ...data,
          amount: Number(data.amount),
        };
      } else {
        const state = getState() as any;
        const currentTxs: Transaction[] = state.transactions.transactions;
        const existing = currentTxs.find(t => t.id === payload.id);
        if (!existing) throw new Error('Transaction not found');

        const updatedTx: Transaction = {
          ...existing,
          type: payload.type,
          amount: payload.amount,
          category: payload.category,
          note: payload.note,
          date: payload.date,
          updated_at: new Date().toISOString(),
        };

        const updated = currentTxs.map(t => (t.id === payload.id ? updatedTx : t));
        await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
        return updatedTx;
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update transaction');
    }
  }
);

// Delete Transaction
export const deleteTransaction = createAsyncThunk<string, string>(
  'transactions/deleteTransaction',
  async (id, { getState, rejectWithValue }) => {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (error) throw error;
        return id;
      } else {
        const state = getState() as any;
        const currentTxs: Transaction[] = state.transactions.transactions;
        const updated = currentTxs.filter(t => t.id !== id);
        await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
        return id;
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete transaction');
    }
  }
);

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilterType: (state, action: PayloadAction<TransactionFilter>) => {
      state.filterType = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    clearTransactionError: state => {
      state.error = null;
    },
    resetTransactionFilters: state => {
      state.filterType = 'all';
      state.searchQuery = '';
      state.selectedCategory = null;
    },
  },
  extraReducers: builder => {
    // Fetch
    builder
      .addCase(fetchTransactions.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Unable to load transactions';
      });

    // Add
    builder
      .addCase(addTransaction.pending, state => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) || 'Failed to add transaction';
      });

    // Update
    builder
      .addCase(updateTransaction.pending, state => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) || 'Failed to update transaction';
      });

    // Delete
    builder
      .addCase(deleteTransaction.pending, state => {
        state.isSubmitting = true;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) || 'Failed to delete transaction';
      });
  },
});

export const {
  setFilterType,
  setSearchQuery,
  setSelectedCategory,
  clearTransactionError,
  resetTransactionFilters,
} = transactionSlice.actions;

export default transactionSlice.reducer;
