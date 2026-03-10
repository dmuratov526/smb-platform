import { configureStore } from '@reduxjs/toolkit';
import businessReducer from './businessSlice';
import uiReducer from './uiSlice';
import sessionReducer from './sessionSlice';
import onboardingReducer from './onboardingSlice';

export const store = configureStore({
  reducer: {
    business: businessReducer,
    ui: uiReducer,
    session: sessionReducer,
    onboarding: onboardingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
