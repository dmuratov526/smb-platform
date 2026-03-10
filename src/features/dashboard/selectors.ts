import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { computeResults } from '../businessSimulator/calculations';
import { computeReadiness } from '../launchPlanner/utils';
import {
  computeBuilderHealth,
  computeSimulationHealth,
  computeLaunchHealth,
  computeOpsHealth,
  generatePriorityItems,
  generateRecommendedAction,
} from './utils';
import { DashboardSummaryData } from './types';

export const makeSelectDashboardSummary = (businessId: string) =>
  createSelector(
    (state: RootState) => state.businessModel.models[businessId] ?? null,
    (state: RootState) => {
      const scenarios = state.simulator.scenarios[businessId] ?? [];
      const activeId = state.simulator.activeScenarioId[businessId];
      return scenarios.find((s) => s.id === activeId) ?? scenarios[0] ?? null;
    },
    (state: RootState) => state.launchPlanner.plans[businessId],
    (state: RootState) => state.operations.data[businessId],
    (model, activeScenario, launchPlan, opsData): DashboardSummaryData => {
      const builder = computeBuilderHealth(model);
      const simulation = computeSimulationHealth(activeScenario);
      const launch = computeLaunchHealth(launchPlan);
      const ops = computeOpsHealth(opsData);
      const priorityItems = generatePriorityItems(builder, simulation, launch, ops);
      const recommendedAction = generateRecommendedAction(builder, simulation, launch, ops);

      return { builder, simulation, launch, ops, priorityItems, recommendedAction };
    }
  );

export const makeSelectActiveScenarioResults = (businessId: string) =>
  createSelector(
    (state: RootState) => {
      const scenarios = state.simulator.scenarios[businessId] ?? [];
      const activeId = state.simulator.activeScenarioId[businessId];
      return scenarios.find((s) => s.id === activeId) ?? scenarios[0] ?? null;
    },
    (scenario) => {
      if (!scenario) return null;
      return computeResults(scenario.assumptions);
    }
  );

export const makeSelectLaunchReadinessSummary = (businessId: string) =>
  createSelector(
    (state: RootState) => state.launchPlanner.plans[businessId],
    (plan) => {
      if (!plan) return null;
      return computeReadiness(plan);
    }
  );
