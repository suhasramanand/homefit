
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import apartmentsReducer from './slices/apartmentsSlice';
import preferencesReducer from './slices/preferencesSlice';
import explanationsReducer from './slices/explanationsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    apartments: apartmentsReducer,
    preferences: preferencesReducer,
    explanations: explanationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
