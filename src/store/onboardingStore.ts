'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AccountStatus =
  | 'draft'
  | 'email_pending'
  | 'verification_pending'
  | 'manual_review'
  | 'info_requested'
  | 'rejected'
  | 'payout_pending'
  | 'active';

export interface MerchantFormData {
  email: string;
  businessName: string;
  password: string;
  businessType: string;
  registrationNumber: string;
  businessAddress: string;
  ownerName: string;
  ownerDob: string;
  idType: string;
  payoutRegion: string;
  bankAccountNumber: string;
  bankRoutingCode: string;
  bankAccountName: string;
}

export interface MerchantOnboardingState {
  currentStep: number;
  status: AccountStatus;
  formData: MerchantFormData;
  verificationDocs: string[];
}

export interface PayerOnboardingState {
  currentStep: number;
  phone: string;
  email: string;
  contactType: 'phone' | 'email';
  cardLinked: boolean;
  currency: string;
  skipCard: boolean;
}

interface OnboardingStore {
  merchant: MerchantOnboardingState;
  payer: PayerOnboardingState;

  // Merchant actions
  setMerchantStep: (step: number) => void;
  setAccountStatus: (status: AccountStatus) => void;
  updateMerchantForm: (data: Partial<MerchantFormData>) => void;
  addVerificationDoc: (doc: string) => void;

  // Payer actions
  setPayerStep: (step: number) => void;
  setPayerContact: (type: 'phone' | 'email', value: string) => void;
  setCardLinked: (linked: boolean) => void;
  setCurrency: (currency: string) => void;
  setSkipCard: (skip: boolean) => void;

  // Global
  resetAll: () => void;
  resetMerchant: () => void;
  resetPayer: () => void;
}

const defaultMerchantFormData: MerchantFormData = {
  email: '',
  businessName: '',
  password: '',
  businessType: '',
  registrationNumber: '',
  businessAddress: '',
  ownerName: '',
  ownerDob: '',
  idType: '',
  payoutRegion: '',
  bankAccountNumber: '',
  bankRoutingCode: '',
  bankAccountName: '',
};

const defaultMerchantState: MerchantOnboardingState = {
  currentStep: 0,
  status: 'draft',
  formData: defaultMerchantFormData,
  verificationDocs: [],
};

const defaultPayerState: PayerOnboardingState = {
  currentStep: 0,
  phone: '',
  email: '',
  contactType: 'phone',
  cardLinked: false,
  currency: 'USD',
  skipCard: false,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      merchant: defaultMerchantState,
      payer: defaultPayerState,

      setMerchantStep: (step) =>
        set((state) => ({
          merchant: { ...state.merchant, currentStep: step },
        })),

      setAccountStatus: (status) =>
        set((state) => ({
          merchant: { ...state.merchant, status },
        })),

      updateMerchantForm: (data) =>
        set((state) => ({
          merchant: {
            ...state.merchant,
            formData: { ...state.merchant.formData, ...data },
          },
        })),

      addVerificationDoc: (doc) =>
        set((state) => ({
          merchant: {
            ...state.merchant,
            verificationDocs: [...state.merchant.verificationDocs, doc],
          },
        })),

      setPayerStep: (step) =>
        set((state) => ({
          payer: { ...state.payer, currentStep: step },
        })),

      setPayerContact: (type, value) =>
        set((state) => ({
          payer: {
            ...state.payer,
            contactType: type,
            phone: type === 'phone' ? value : state.payer.phone,
            email: type === 'email' ? value : state.payer.email,
          },
        })),

      setCardLinked: (linked) =>
        set((state) => ({
          payer: { ...state.payer, cardLinked: linked },
        })),

      setCurrency: (currency) =>
        set((state) => ({
          payer: { ...state.payer, currency },
        })),

      setSkipCard: (skip) =>
        set((state) => ({
          payer: { ...state.payer, skipCard: skip },
        })),

      resetAll: () =>
        set({
          merchant: defaultMerchantState,
          payer: defaultPayerState,
        }),

      resetMerchant: () =>
        set({ merchant: defaultMerchantState }),

      resetPayer: () =>
        set({ payer: defaultPayerState }),
    }),
    {
      name: 'kingspay-onboarding',
      version: 1,
    }
  )
);
