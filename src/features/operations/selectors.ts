import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { BusinessOperationsData, OperationsSummary } from './types';
import { computeOperationsSummary, getTasksDueSoon, getOverdueTasks, getHighPriorityIssues } from './utils';

export const selectOperationsData = (
  state: RootState,
  businessId: string
): BusinessOperationsData | undefined => state.operations.data[businessId];

export const makeSelectOperationsSummary = (businessId: string) =>
  createSelector(
    (state: RootState) => state.operations.data[businessId],
    (data): OperationsSummary | null => {
      if (!data) return null;
      return computeOperationsSummary(data);
    }
  );

export const makeSelectTasksDueSoon = (businessId: string) =>
  createSelector(
    (state: RootState) => state.operations.data[businessId]?.recurringTasks ?? [],
    (tasks) => getTasksDueSoon(tasks)
  );

export const makeSelectOverdueTasks = (businessId: string) =>
  createSelector(
    (state: RootState) => state.operations.data[businessId]?.recurringTasks ?? [],
    (tasks) => getOverdueTasks(tasks)
  );

export const makeSelectHighPriorityIssues = (businessId: string) =>
  createSelector(
    (state: RootState) => state.operations.data[businessId]?.issues ?? [],
    (issues) => getHighPriorityIssues(issues)
  );
