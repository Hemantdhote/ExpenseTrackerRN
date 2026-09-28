import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { UserProfile } from '../../types';

const LOCAL_USER_KEY = '@expense_tracker_user';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,
};

// Check for active session on app launch
export const checkSession = createAsyncThunk<UserProfile | null>(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      if (isSupabaseConfigured()) {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session?.user) {
          return null;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        return {
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.name || 'Hemant',
          email: session.user.email || '',
        };
      } else {
        // Fallback local storage check
        const stored = await AsyncStorage.getItem(LOCAL_USER_KEY);
        if (stored) {
          return JSON.parse(stored) as UserProfile;
        }
        return null;
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Unable to restore session');
    }
  }
);

// Register user
export const registerUser = createAsyncThunk<
  UserProfile,
  { name: string; email: string; password: string }
>('auth/registerUser', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim() },
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error('Registration failed');

      // Update or insert profile
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name: name.trim(),
        email: email.trim(),
        updated_at: new Date().toISOString(),
      });

      const profile: UserProfile = {
        id: data.user.id,
        name: name.trim(),
        email: email.trim(),
      };

      await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      return profile;
    } else {
      // Offline / Demo registration
      const mockProfile: UserProfile = {
        id: 'local_user_' + Date.now(),
        name: name.trim(),
        email: email.trim(),
      };
      await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockProfile));
      return mockProfile;
    }
  } catch (err: any) {
    return rejectWithValue(err.message || 'Registration failed');
  }
});

// Login user
export const loginUser = createAsyncThunk<
  UserProfile,
  { email: string; password: string }
>('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Invalid credentials');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userProfile: UserProfile = {
        id: data.user.id,
        name: profile?.name || data.user.user_metadata?.name || 'Hemant',
        email: data.user.email || email.trim(),
      };

      await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userProfile));
      return userProfile;
    } else {
      // Offline / Demo login
      const mockProfile: UserProfile = {
        id: 'local_user_demo',
        name: 'Hemant',
        email: email.trim() || 'hemant@example.com',
      };
      await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockProfile));
      return mockProfile;
    }
  } catch (err: any) {
    return rejectWithValue(err.message || 'Unable to login. Please check credentials.');
  }
});

// Update Profile
export const updateProfile = createAsyncThunk<UserProfile, { name: string }>(
  'auth/updateProfile',
  async ({ name }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const current = state.auth.user;
      if (!current) throw new Error('No user logged in');

      const updated: UserProfile = {
        ...current,
        name: name.trim(),
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        await supabase
          .from('profiles')
          .update({ name: name.trim(), updated_at: new Date().toISOString() })
          .eq('id', current.id);
      }

      await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
      return updated;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Unable to update profile');
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors on logout
    }
  }
  await AsyncStorage.removeItem(LOCAL_USER_KEY);
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: state => {
      state.error = null;
    },
    loginAsDemo: state => {
      const demoProfile: UserProfile = {
        id: 'demo_user_hemant',
        name: 'Hemant',
        email: 'hemant@example.com',
      };
      state.user = demoProfile;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoProfile));
    },
  },
  extraReducers: builder => {
    // Check Session
    builder
      .addCase(checkSession.pending, state => {
        state.isInitializing = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.isInitializing = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkSession.rejected, state => {
        state.isInitializing = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Registration failed';
      });

    // Login
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Unable to login';
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to update profile';
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, state => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    });
  },
});

export const { clearAuthError, loginAsDemo } = authSlice.actions;
export default authSlice.reducer;
