import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  OperationsState,
  BusinessOperationsData,
  OperationalArea,
  RecurringTask,
  RecurringTaskStatus,
  OperationalIssue,
  IssueStatus,
} from './types';
import { mockOperationsData } from './mock';
import { generateId } from './utils';

function buildInitialState(): OperationsState {
  const data: Record<string, BusinessOperationsData> = {};
  mockOperationsData.forEach((d) => {
    data[d.businessId] = d;
  });
  return { data };
}

const operationsSlice = createSlice({
  name: 'operations',
  initialState: buildInitialState(),
  reducers: {
    initOperationsForBusiness(
      state,
      action: PayloadAction<BusinessOperationsData>
    ) {
      const { businessId } = action.payload;
      if (!state.data[businessId]) {
        state.data[businessId] = action.payload;
      }
    },

    addArea(
      state,
      action: PayloadAction<{ businessId: string; area: Omit<OperationalArea, 'id'> }>
    ) {
      const { businessId, area } = action.payload;
      const biz = state.data[businessId];
      if (!biz) return;
      biz.areas.push({ ...area, id: generateId('area') });
    },

    updateArea(
      state,
      action: PayloadAction<{
        businessId: string;
        areaId: string;
        updates: Partial<Omit<OperationalArea, 'id'>>;
      }>
    ) {
      const { businessId, areaId, updates } = action.payload;
      const biz = state.data[businessId];
      if (!biz) return;
      const area = biz.areas.find((a) => a.id === areaId);
      if (area) Object.assign(area, updates);
    },

    addRecurringTask(
      state,
      action: PayloadAction<{ businessId: string; task: Omit<RecurringTask, 'id'> }>
    ) {
      const { businessId, task } = action.payload;
      const biz = state.data[businessId];
      if (!biz) return;
      biz.recurringTasks.push({ ...task, id: generateId('task') });
    },

    updateRecurringTask(
      state,
      action: PayloadAction<{
        businessId: string;
        taskId: string;
        updates: Partial<Omit<RecurringTask, 'id'>>;
      }>
    ) {
      const { businessId, taskId, updates } = action.payload;
      const biz = state.data[businessId];
      if (!biz) return;
      const task = biz.recurringTasks.find((t) => t.id === taskId);
      if (task) Object.assign(task, updates);
    },

    updateRecurringTaskStatus(
      state,
      action: PayloadAction<{
        businessId: string;
        taskId: string;
        status: RecurringTaskStatus;
      }>
    ) {
      const { businessId, taskId, status } = action.payload;
      const biz = state.data[businessId];
      if (!biz) return;
      const task = biz.recurringTasks.find((t) => t.id === taskId);
      if (task) task.status = status;
    },

    deleteRecurringTask(
      state,
      action: PayloadAction<{ businessId: string; taskId: string }>
    ) {
      const { businessId, taskId } = action.payload;
      const biz = state.data[businessId];
      if (!biz) return;
      biz.recurringTasks = biz.recurringTasks.filter((t) => t.id !== taskId);
    },

    addIssue(
      state,
      action: PayloadAction<{ businessId: string; issue: Omit<OperationalIssue, 'id' | 'createdAt'> }>
    ) {
      const { businessId, issue } = action.payload;
      const biz = state.data[businessId];
      if (!biz) return;
      biz.issues.push({
        ...issue,
        id: generateId('issue'),
        createdAt: new Date().toISOString(),
      });
    },

    updateIssue(
      state,
      action: PayloadAction<{
        businessId: string;
        issueId: string;
        updates: Partial<Omit<OperationalIssue, 'id' | 'createdAt'>>;
      }>
    ) {
      const { businessId, issueId, updates } = action.payload;
      const biz = state.data[businessId];
      if (!biz) return;
      const issue = biz.issues.find((i) => i.id === issueId);
      if (issue) Object.assign(issue, updates);
    },

    updateIssueStatus(
      state,
      action: PayloadAction<{
        businessId: string;
        issueId: string;
        status: IssueStatus;
      }>
    ) {
      const { businessId, issueId, status } = action.payload;
      const biz = state.data[businessId];
      if (!biz) return;
      const issue = biz.issues.find((i) => i.id === issueId);
      if (issue) issue.status = status;
    },

    deleteIssue(
      state,
      action: PayloadAction<{ businessId: string; issueId: string }>
    ) {
      const { businessId, issueId } = action.payload;
      const biz = state.data[businessId];
      if (!biz) return;
      biz.issues = biz.issues.filter((i) => i.id !== issueId);
    },
  },
});

export const {
  initOperationsForBusiness,
  addArea,
  updateArea,
  addRecurringTask,
  updateRecurringTask,
  updateRecurringTaskStatus,
  deleteRecurringTask,
  addIssue,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
} = operationsSlice.actions;

export default operationsSlice.reducer;
