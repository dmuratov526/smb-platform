import { RootState } from '../../app/store';
import { BusinessModel } from './types';

export const selectActiveBusinessModel = (state: RootState): BusinessModel | null => {
  const { activeBusinessId } = state.business;
  if (!activeBusinessId) return null;
  return state.businessModel.models[activeBusinessId] ?? null;
};

export const selectBusinessModel =
  (businessId: string) =>
  (state: RootState): BusinessModel | null =>
    state.businessModel.models[businessId] ?? null;
