import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { computeResults } from './calculations';
import { SimulatorScenario, SimulatorResults } from './types';

export const selectSimulatorScenarios = (
  state: RootState,
  businessId: string
): SimulatorScenario[] => state.simulator.scenarios[businessId] ?? [];

export const selectActiveScenarioId = (
  state: RootState,
  businessId: string
): string => state.simulator.activeScenarioId[businessId] ?? '';

export const selectActiveScenario = (
  state: RootState,
  businessId: string
): SimulatorScenario | undefined => {
  const scenarios = state.simulator.scenarios[businessId] ?? [];
  const activeId = state.simulator.activeScenarioId[businessId];
  return scenarios.find((s) => s.id === activeId);
};

export const selectBaseScenario = (
  state: RootState,
  businessId: string
): SimulatorScenario | undefined => {
  const scenarios = state.simulator.scenarios[businessId] ?? [];
  return scenarios.find((s) => s.type === 'base');
};

export const makeSelectSimulatorResults = (businessId: string) =>
  createSelector(
    (state: RootState) => selectActiveScenario(state, businessId),
    (scenario): SimulatorResults | null => {
      if (!scenario) return null;
      return computeResults(scenario.assumptions);
    }
  );

export const makeSelectBaseResults = (businessId: string) =>
  createSelector(
    (state: RootState) => selectBaseScenario(state, businessId),
    (scenario): SimulatorResults | null => {
      if (!scenario) return null;
      return computeResults(scenario.assumptions);
    }
  );
