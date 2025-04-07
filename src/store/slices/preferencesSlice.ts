
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/utils/api';

interface PreferencesState {
  preferences: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PreferencesState = {
  preferences: null,
  status: 'idle',
  error: null,
};

export const fetchPreferences = createAsyncThunk(
  'preferences/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const preferences = await api.user.getPreferences();
      return { preferences };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'preferences/update',
  async (preferences: any, { rejectWithValue }) => {
    try {
      const response = await api.user.updatePreferences(preferences);
      return { preferences: response.preferences };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setPreferences: (state, action: PayloadAction<any>) => {
      state.preferences = action.payload;
    },
    clearPreferences: (state) => {
      state.preferences = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPreferences.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.preferences = action.payload.preferences;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updatePreferences.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.preferences = action.payload.preferences;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setPreferences, clearPreferences } = preferencesSlice.actions;

export default preferencesSlice.reducer;
