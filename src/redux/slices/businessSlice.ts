import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BusinessState {
  is_brand_owner: boolean | undefined;
  number_of_owned_brands: number | undefined;
  is_active: boolean | undefined;
  current_plan: string | undefined;
  is_premium_plan_active: boolean | undefined;
}

const initialState: BusinessState = {
  is_brand_owner: false,
  number_of_owned_brands: 0,
  is_active: true,
  current_plan: '',
  is_premium_plan_active: false,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusinessData: (state, action: PayloadAction<BusinessState>) => {
      return { ...state, ...action.payload };
    },
    clearBusinessData: () => initialState,
  },
});

export const { setBusinessData, clearBusinessData } = businessSlice.actions;
export default businessSlice.reducer;
