import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface BusinessState {
  is_brand_owner: boolean | undefined;
  number_of_owned_brands: number | undefined;
  is_active: boolean | undefined;
  current_plan: string | undefined;
  is_premium_plan_active: boolean | undefined;
  business_registration_step?: number;
  business_id?: number | null;
}

const initialState: BusinessState = {
  is_brand_owner: false,
  number_of_owned_brands: 0,
  is_active: true,
  current_plan: '',
  is_premium_plan_active: false,
  business_registration_step: 6,
  business_id: 17,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusinessData: (state, action: PayloadAction<BusinessState>) => {
      return { ...state, ...action.payload };
    },
    setBusinessRegistrationStage: (
      state,
      action: PayloadAction<{
        business_registration_step: number;
        business_id?: number | null;
      }>
    ) => {
      console.log(action.payload);
      //134.209.19.132:8000/api/business/{business_id}/delete/
      http: state.business_registration_step =
        action.payload.business_registration_step;
      if (action.payload.business_id !== undefined) {
        state.business_id = action.payload.business_id;
      }
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
  state.business.business_registration_step ?? 0;
export const selectBusinessId = (state: RootState): number | null =>
  state.business.business_id ?? null;
