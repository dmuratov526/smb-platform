import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { PlannerPlan, LaunchReadiness } from './types';
import { computeReadiness } from './utils';

export const selectLaunchPlan = (
  state: RootState,
  businessId: string
): PlannerPlan | undefined => state.launchPlanner.plans[businessId];

export const makeSelectLaunchReadiness = (businessId: string) =>
  createSelector(
    (state: RootState) => state.launchPlanner.plans[businessId],
    (plan): LaunchReadiness | null => {
      if (!plan) return null;
      return computeReadiness(plan);
    }
  );
