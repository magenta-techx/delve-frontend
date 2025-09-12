import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface BusinessState {
  is_brand_owner: boolean | undefined;
  number_of_owned_brands: number | undefined;
  is_active: boolean | undefined;
  current_plan: string | undefined;
  is_premium_plan_active: boolean | undefined;
  business_registrattion_step?: number;
  business_id?: number;
}

const initialState: BusinessState = {
  is_brand_owner: false,
  number_of_owned_brands: 0,
  is_active: true,
  current_plan: '',
  is_premium_plan_active: false,
  business_registrattion_step: 0,
  business_id: 0,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusinessData: (state, action: PayloadAction<BusinessState>) => {
      return { ...state, ...action.payload };
    },
    setBusinessRegistrationStage: (state, action: PayloadAction<object>) => {
      console.log(action.payload, state);
    },
    clearBusinessData: () => initialState,
  },
});

export const {
  setBusinessData,
  setBusinessRegistrationStage,
  clearBusinessData,
} = businessSlice.actions;
export default businessSlice.reducer;
export const selectBusinessStep = (state: RootState): number =>
  state.business.business_registrattion_step ?? 0;
