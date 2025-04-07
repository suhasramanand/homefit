
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/utils/api';

interface ApartmentsState {
  apartments: any[];
  currentApartment: any | null;
  favorites: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ApartmentsState = {
  apartments: [],
  currentApartment: null,
  favorites: [],
  status: 'idle',
  error: null,
};

export const fetchApartments = createAsyncThunk(
  'apartments/fetchAll',
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      const apartments = await api.apartments.getAll(filters);
      return { apartments };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchApartmentById = createAsyncThunk(
  'apartments/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const apartment = await api.apartments.getById(id);
      return { apartment };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  'apartments/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const favorites = await api.user.getFavorites();
      return { favorites };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addFavorite = createAsyncThunk(
  'apartments/addFavorite',
  async (apartmentId: string, { rejectWithValue }) => {
    try {
      const response = await api.user.addFavorite(apartmentId);
      return { apartmentId, favorites: response.favorites };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'apartments/removeFavorite',
  async (apartmentId: string, { rejectWithValue }) => {
    try {
      const response = await api.user.removeFavorite(apartmentId);
      return { apartmentId, favorites: response.favorites };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const apartmentsSlice = createSlice({
  name: 'apartments',
  initialState,
  reducers: {
    setApartments: (state, action: PayloadAction<any[]>) => {
      state.apartments = action.payload;
    },
    clearApartments: (state) => {
      state.apartments = [];
      state.currentApartment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApartments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApartments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.apartments = action.payload.apartments;
      })
      .addCase(fetchApartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchApartmentById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApartmentById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentApartment = action.payload.apartment;
      })
      .addCase(fetchApartmentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload.favorites;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload.favorites;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload.favorites;
      });
  },
});

export const { setApartments, clearApartments } = apartmentsSlice.actions;

export default apartmentsSlice.reducer;
