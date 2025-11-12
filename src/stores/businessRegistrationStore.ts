import { create } from 'zustand';

export type BusinessRegistrationState = {
  business_registration_step: number;
  business_id: number | null;
  setStep: (step: number) => void;
  setBusinessId: (id: number | null) => void;
  reset: () => void;
};

export const useBusinessRegistrationStore = create<BusinessRegistrationState>((set) => ({
  business_registration_step: 0,
  business_id: null,
  setStep: (step: number): void => set({ business_registration_step: step }),
  setBusinessId: (id: number | null): void => set({ business_id: id }),
  reset: (): void => set({ business_registration_step: 0, business_id: null }),
}));
