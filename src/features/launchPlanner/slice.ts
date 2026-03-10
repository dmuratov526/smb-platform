import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LaunchPhase, PlannerPlan, PlannerTask, PlannerTaskStatus } from './types';
import { mockPlannerPlans } from '../../mock/launchPlannerData';
import { buildDefaultPlan } from './utils';
import { BusinessIndustry, BusinessCategoryKey } from '../../types';

interface LaunchPlannerState {
  plans: Record<string, PlannerPlan>;
}

function buildInitialState(): LaunchPlannerState {
  const plans: Record<string, PlannerPlan> = {};
  mockPlannerPlans.forEach((plan) => {
    plans[plan.businessId] = plan;
  });
  return { plans };
}

const launchPlannerSlice = createSlice({
  name: 'launchPlanner',
  initialState: buildInitialState(),
  reducers: {
    initPlanForBusiness(
      state,
      action: PayloadAction<{
        businessId: string;
        industry: BusinessIndustry;
        category?: BusinessCategoryKey;
        targetLaunchDate?: string;
      }>
    ) {
      const { businessId, industry, category, targetLaunchDate } = action.payload;
      if (!state.plans[businessId]) {
        state.plans[businessId] = buildDefaultPlan(
          businessId,
          industry,
          category,
          targetLaunchDate
        );
      }
    },

    updateTaskStatus(
      state,
      action: PayloadAction<{
        businessId: string;
        phaseId: string;
        taskId: string;
        status: PlannerTaskStatus;
      }>
    ) {
      const { businessId, phaseId, taskId, status } = action.payload;
      const plan = state.plans[businessId];
      if (!plan) return;
      const phase = plan.phases.find((p) => p.id === phaseId);
      if (!phase) return;
      const task = phase.tasks.find((t) => t.id === taskId);
      if (task) {
        task.status = status;
      }
    },

    addTask(
      state,
      action: PayloadAction<{
        businessId: string;
        phaseId: string;
        task: Omit<PlannerTask, 'id' | 'phaseId'>;
      }>
    ) {
      const { businessId, phaseId, task } = action.payload;
      const plan = state.plans[businessId];
      if (!plan) return;
      const phase = plan.phases.find((p) => p.id === phaseId);
      if (!phase) return;
      const newTask: PlannerTask = {
        ...task,
        id: `${businessId}-${phaseId}-task-${Date.now()}`,
        phaseId,
      };
      phase.tasks.push(newTask);
    },

    updateTask(
      state,
      action: PayloadAction<{
        businessId: string;
        phaseId: string;
        taskId: string;
        updates: Partial<Omit<PlannerTask, 'id' | 'phaseId'>>;
      }>
    ) {
      const { businessId, phaseId, taskId, updates } = action.payload;
      const plan = state.plans[businessId];
      if (!plan) return;
      const phase = plan.phases.find((p) => p.id === phaseId);
      if (!phase) return;
      const task = phase.tasks.find((t) => t.id === taskId);
      if (task) {
        Object.assign(task, updates);
      }
    },

    deleteTask(
      state,
      action: PayloadAction<{
        businessId: string;
        phaseId: string;
        taskId: string;
      }>
    ) {
      const { businessId, phaseId, taskId } = action.payload;
      const plan = state.plans[businessId];
      if (!plan) return;
      const phase = plan.phases.find((p) => p.id === phaseId);
      if (!phase) return;
      phase.tasks = phase.tasks.filter((t) => t.id !== taskId);
    },

    addPhase(
      state,
      action: PayloadAction<{
        businessId: string;
        phase: Omit<LaunchPhase, 'id' | 'order' | 'tasks'>;
      }>
    ) {
      const { businessId, phase } = action.payload;
      const plan = state.plans[businessId];
      if (!plan) return;
      const newOrder =
        plan.phases.length > 0
          ? Math.max(...plan.phases.map((p) => p.order)) + 1
          : 1;
      plan.phases.push({
        ...phase,
        id: `${businessId}-phase-${Date.now()}`,
        order: newOrder,
        tasks: [],
      });
    },

    updatePhase(
      state,
      action: PayloadAction<{
        businessId: string;
        phaseId: string;
        updates: Partial<Pick<LaunchPhase, 'name' | 'description'>>;
      }>
    ) {
      const { businessId, phaseId, updates } = action.payload;
      const plan = state.plans[businessId];
      if (!plan) return;
      const phase = plan.phases.find((p) => p.id === phaseId);
      if (phase) Object.assign(phase, updates);
    },

    deletePhase(
      state,
      action: PayloadAction<{ businessId: string; phaseId: string }>
    ) {
      const { businessId, phaseId } = action.payload;
      const plan = state.plans[businessId];
      if (!plan) return;
      plan.phases = plan.phases.filter((p) => p.id !== phaseId);
    },
  },
});

export const {
  initPlanForBusiness,
  updateTaskStatus,
  addTask,
  updateTask,
  deleteTask,
  addPhase,
  updatePhase,
  deletePhase,
} = launchPlannerSlice.actions;
export default launchPlannerSlice.reducer;
