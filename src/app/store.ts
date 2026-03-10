import { configureStore } from '@reduxjs/toolkit';
import businessReducer from './businessSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    business: businessReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
