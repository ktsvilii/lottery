import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';

import { BuyTicketStep, CheckResultsStep, CountdownStep, SubmitCombinationStep } from '../components';
import { TicketStatus } from '../types';

type Step = {
  id: number;
  content: ReactNode;
};

type StepContextType = {
  step: number;
  steps: Step[];
  nextStep: () => void;
  setStepByTicketStatus: (ticketStatus: TicketStatus) => void;
  setCurrentStep: (newStep: number) => void;
};

const StepContext = createContext<StepContextType | undefined>(undefined);

type StepProviderProps = {
  children: ReactNode;
};

export const GameStepperProvider = ({ children }: StepProviderProps) => {
  const [step, setStep] = useState(0);

  const steps = useMemo(
    () => [
      { id: 1, content: <BuyTicketStep /> },
      { id: 2, content: <SubmitCombinationStep /> },
      { id: 3, content: <CountdownStep /> },
      { id: 4, content: <CheckResultsStep /> },
    ],
    [],
  );

  const nextStep = useCallback(() => {
    if (step < steps.length - 1) {
      const next = step + 1;
      setStep(next);
    }
  }, [step, steps.length]);

  const setCurrentStep = useCallback(
    (newStep: number) => {
      if (newStep >= 0 && newStep < steps.length) {
        setStep(newStep);
        localStorage.setItem('currentStep', String(newStep));
      }
    },
    [steps.length],
  );

  const setStepByTicketStatus = useCallback(
    (ticketStatus: TicketStatus) => {
      switch (ticketStatus) {
        case TicketStatus.REWARD_CLAIMED:
        case TicketStatus.READY_TO_CHECK_RESULTS:
          setCurrentStep(3);
          break;
        case TicketStatus.COMBINATION_SUBMITTED:
          setCurrentStep(2);
          break;
        case TicketStatus.PURCHASED:
          setCurrentStep(1);
          break;
        default:
          return;
      }
    },
    [setCurrentStep],
  );

  const contextValue = useMemo(
    () => ({
      step,
      steps,
      nextStep,
      setStepByTicketStatus,
      setCurrentStep,
    }),
    [step, steps, nextStep, setStepByTicketStatus, setCurrentStep],
  );

  return <StepContext.Provider value={contextValue}>{children}</StepContext.Provider>;
};

export const useStepper = (): StepContextType => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error('useStepper must be used within a StepProvider');
  }
  return context;
};
