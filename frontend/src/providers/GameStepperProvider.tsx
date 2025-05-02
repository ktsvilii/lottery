import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

import { BuyTicketStep, CheckResultsStep, CountdownStep, SubmitCombinationStep } from '../components';
import { useGameContext } from './GameContext';

type Step = {
  id: number;
  content: ReactNode;
};

type StepContextType = {
  step: number;
  steps: Step[];
  nextStep: () => void;
  goToFirstStep: () => void;
};

const StepContext = createContext<StepContextType | undefined>(undefined);

type StepProviderProps = {
  children: ReactNode;
};

export const GameStepperProvider = ({ children }: StepProviderProps) => {
  const [step, setStep] = useState(0);
  const { setIsGameStarted } = useGameContext();

  // Wrap the steps definition in useMemo to avoid unnecessary recalculations
  const steps = useMemo(
    () => [
      { id: 1, content: <BuyTicketStep /> },
      { id: 2, content: <SubmitCombinationStep /> },
      { id: 3, content: <CountdownStep /> },
      { id: 4, content: <CheckResultsStep /> },
    ],
    [],
  );

  // Wrap the goToOriginalStep function in useCallback
  const goToFirstStep = useCallback(() => {
    setStep(0);
    localStorage.setItem('currentStep', String(0));
    localStorage.setItem('isGameStarted', 'false');
  }, []);

  // Wrap the nextStep function in useCallback to prevent re-creation on each render
  const nextStep = useCallback(() => {
    if (step === 0) {
      setIsGameStarted(true);
      localStorage.setItem('isGameStarted', 'true');
    }

    if (step < steps.length - 1) {
      const next = step + 1;
      setStep(next);
      localStorage.setItem('currentStep', String(next));
    }
  }, [setIsGameStarted, step, steps.length]);

  // Retrieve saved state from localStorage on load
  useEffect(() => {
    const savedStarted = localStorage.getItem('isGameStarted') === 'true';
    const savedStep = localStorage.getItem('currentStep');

    if (savedStep !== null) {
      setStep(Number(savedStep));
    }
    setIsGameStarted(savedStarted);
  }, [setIsGameStarted]);

  // Wrap the context value in useMemo to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      step,
      steps,
      nextStep,
      goToFirstStep,
    }),
    [step, steps, nextStep, goToFirstStep],
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
