export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: string; // YYYY-MM-DD
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export type TransactionFilter = 'all' | 'income' | 'expense';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Transactions: { filterType?: TransactionFilter; category?: string } | undefined;
  AddTransaction: { transactionToEdit?: Transaction } | undefined;
  TransactionDetails: { transactionId: string };
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};
