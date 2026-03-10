import { configureStore } from '@reduxjs/toolkit';
import businessReducer from './businessSlice';
import uiReducer from './uiSlice';
import sessionReducer from './sessionSlice';
import onboardingReducer from './onboardingSlice';
import businessModelReducer from '../features/businessModel/slice';

export const store = configureStore({
  reducer: {
    business: businessReducer,
    ui: uiReducer,
    session: sessionReducer,
    onboarding: onboardingReducer,
    businessModel: businessModelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
