import { configureStore } from '@reduxjs/toolkit';
import businessReducer from './businessSlice';
import uiReducer from './uiSlice';
import sessionReducer from './sessionSlice';
import onboardingReducer from './onboardingSlice';
import businessModelReducer from '../features/businessModel/slice';
import simulatorReducer from '../features/businessSimulator/slice';

export const store = configureStore({
  reducer: {
    business: businessReducer,
    ui: uiReducer,
    session: sessionReducer,
    onboarding: onboardingReducer,
    businessModel: businessModelReducer,
    simulator: simulatorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
