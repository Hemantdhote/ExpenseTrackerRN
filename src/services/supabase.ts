import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Configuration keys - can be set via environment or updated here
export const SUPABASE_CONFIG = {
  url: 'https://placeholder-expense-tracker.supabase.co',
  anonKey: 'placeholder-anon-key',
};

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(SUPABASE_CONFIG.url) &&
    Boolean(SUPABASE_CONFIG.anonKey) &&
    !SUPABASE_CONFIG.url.includes('placeholder') &&
    SUPABASE_CONFIG.url.startsWith('https://')
  );
};

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
