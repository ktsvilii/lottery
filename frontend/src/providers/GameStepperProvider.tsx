import { create } from 'zustand';

import { CURRENT_STEP, STEPPER_STEPS_COUNT } from '../constants';

interface StepContextType {
  step: number;
  nextStep: () => void;
  setCurrentStep: (newStep: number) => void;
}

export const useStepper = create<StepContextType>(set => ({
  step: 0,
  nextStep: () => set(({ step }) => ({ step: step < STEPPER_STEPS_COUNT - 1 ? step + 1 : step })),
  setCurrentStep: (newStep: number) =>
    set(state => {
      if (newStep >= 0 && newStep < STEPPER_STEPS_COUNT) {
        localStorage.setItem(CURRENT_STEP, String(newStep));

        return {
          step: newStep,
        };
      }
      return state;
    }),
}));
