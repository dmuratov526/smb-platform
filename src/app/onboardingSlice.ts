import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OnboardingDraft } from '../types';

interface OnboardingState {
  isActive: boolean;
  currentStep: number;
  draft: OnboardingDraft;
}

const emptyDraft: OnboardingDraft = {
  name: '',
  category: '',
  description: '',
  stage: '',
  location: '',
  teamSize: '',
  categoryData: {},
};

const initialState: OnboardingState = {
  isActive: false,
  currentStep: 0,
  draft: emptyDraft,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    startOnboarding(state) {
      state.isActive = true;
      state.currentStep = 0;
      state.draft = emptyDraft;
    },
    setOnboardingStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    updateBasics(
      state,
      action: PayloadAction<Partial<Omit<OnboardingDraft, 'categoryData'>>>
    ) {
      Object.assign(state.draft, action.payload);
    },
    updateCategoryData(
      state,
      action: PayloadAction<Record<string, string | string[]>>
    ) {
      state.draft.categoryData = {
        ...state.draft.categoryData,
        ...action.payload,
      };
    },
    completeOnboarding(state) {
      state.isActive = false;
      state.currentStep = 0;
      state.draft = emptyDraft;
    },
    cancelOnboarding(state) {
      state.isActive = false;
      state.currentStep = 0;
      state.draft = emptyDraft;
    },
  },
});

export const {
  startOnboarding,
  setOnboardingStep,
  updateBasics,
  updateCategoryData,
  completeOnboarding,
  cancelOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
