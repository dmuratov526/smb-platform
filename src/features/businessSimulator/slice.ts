import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SimulatorScenario, SimulatorAssumptions } from './types';
import { mockSimulatorScenarios } from '../../mock/simulatorScenarios';

interface SimulatorState {
  scenarios: Record<string, SimulatorScenario[]>;
  activeScenarioId: Record<string, string>;
}

function buildInitialState(): SimulatorState {
  const scenarios: Record<string, SimulatorScenario[]> = {};
  const activeScenarioId: Record<string, string> = {};

  mockSimulatorScenarios.forEach((scenario) => {
    if (!scenarios[scenario.businessId]) {
      scenarios[scenario.businessId] = [];
    }
    scenarios[scenario.businessId].push(scenario);
  });

  Object.entries(scenarios).forEach(([businessId, list]) => {
    const base = list.find((s) => s.type === 'base');
    activeScenarioId[businessId] = base?.id ?? list[0]?.id ?? '';
  });

  return { scenarios, activeScenarioId };
}

const initialState: SimulatorState = buildInitialState();

const simulatorSlice = createSlice({
  name: 'simulator',
  initialState,
  reducers: {
    setActiveScenario(
      state,
      action: PayloadAction<{ businessId: string; scenarioId: string }>
    ) {
      const { businessId, scenarioId } = action.payload;
      state.activeScenarioId[businessId] = scenarioId;
    },

    updateAssumptions(
      state,
      action: PayloadAction<{
        businessId: string;
        scenarioId: string;
        assumptions: SimulatorAssumptions;
      }>
    ) {
      const { businessId, scenarioId, assumptions } = action.payload;
      const list = state.scenarios[businessId];
      if (!list) return;
      const scenario = list.find((s) => s.id === scenarioId);
      if (scenario) {
        scenario.assumptions = assumptions;
      }
    },

    initScenariosForBusiness(
      state,
      action: PayloadAction<{ businessId: string; scenarios: SimulatorScenario[] }>
    ) {
      const { businessId, scenarios } = action.payload;
      if (!state.scenarios[businessId] || state.scenarios[businessId].length === 0) {
        state.scenarios[businessId] = scenarios;
        const base = scenarios.find((s) => s.type === 'base');
        state.activeScenarioId[businessId] = base?.id ?? scenarios[0]?.id ?? '';
      }
    },
  },
});

export const { setActiveScenario, updateAssumptions, initScenariosForBusiness } =
  simulatorSlice.actions;
export default simulatorSlice.reducer;
