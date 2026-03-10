import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Business } from '../types';
import { mockBusinesses } from '../mock/businesses';

interface BusinessState {
  businesses: Business[];
  activeBusinessId: string | null;
}

const initialState: BusinessState = {
  businesses: mockBusinesses,
  activeBusinessId: mockBusinesses[0]?.id ?? null,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setActiveBusiness(state, action: PayloadAction<string | null>) {
      state.activeBusinessId = action.payload;
    },
    addBusiness(state, action: PayloadAction<Business>) {
      state.businesses.push(action.payload);
    },
    updateBusiness(state, action: PayloadAction<Business>) {
      const index = state.businesses.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.businesses[index] = action.payload;
      }
    },
  },
});

export const { setActiveBusiness, addBusiness, updateBusiness } = businessSlice.actions;
export default businessSlice.reducer;
