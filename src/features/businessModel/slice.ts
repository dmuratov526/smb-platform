import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BusinessModel, BusinessModelSection } from './types';
import { mockBusinessModels } from '../../mock/businessModels';

interface BusinessModelState {
  models: Record<string, BusinessModel>;
}

const initialModels: Record<string, BusinessModel> = {};
mockBusinessModels.forEach((m) => {
  initialModels[m.businessId] = m;
});

const initialState: BusinessModelState = {
  models: initialModels,
};

const businessModelSlice = createSlice({
  name: 'businessModel',
  initialState,
  reducers: {
    updateSection<S extends BusinessModelSection>(
      state: BusinessModelState,
      action: PayloadAction<{
        businessId: string;
        section: S;
        data: Partial<BusinessModel[S]>;
      }>
    ) {
      const { businessId, section, data } = action.payload;
      if (state.models[businessId]) {
        state.models[businessId][section] = {
          ...state.models[businessId][section],
          ...data,
        } as BusinessModel[S];
      }
    },

    initBusinessModel(state, action: PayloadAction<{ businessId: string; categoryKey?: string }>) {
      const { businessId } = action.payload;
      if (!state.models[businessId]) {
        state.models[businessId] = {
          businessId,
          offer: {
            productName: '',
            valueProposition: '',
            keyFeatures: '',
            pricingApproach: '',
          },
          customer: {
            targetSegment: '',
            customerProblem: '',
            willingnessToPay: '',
            geographicFocus: '',
          },
          revenue: {
            pricingModel: '',
            revenueStreams: '',
            averageTransactionValue: null,
            expectedSalesVolume: '',
          },
          acquisition: {
            marketingChannels: '',
            salesModel: '',
            conversionAssumptions: '',
            estimatedAcquisitionCost: null,
          },
          operations: {
            teamStructure: '',
            keyResources: '',
            suppliersOrPartners: '',
            operationalComplexity: '',
            capacityConstraints: '',
          },
          financials: {
            expectedMonthlyRevenue: null,
            expectedMonthlyCosts: null,
            breakEvenEstimate: '',
            marginEstimate: null,
          },
        };
      }
    },
  },
});

export const { updateSection, initBusinessModel } = businessModelSlice.actions;
export default businessModelSlice.reducer;
