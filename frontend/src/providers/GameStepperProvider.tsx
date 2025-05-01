import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { sepolia } from 'viem/chains';
import { Step0 } from '../components';

type Step = {
  id: number;
  content: ReactNode;
};

type StepContextType = {
  address: string | undefined;
  started: boolean;
  step: number;
  steps: Step[];
  hasEnoughEth: boolean;
  isConnected: boolean;
  handleNext: () => void;
  goToOriginalStep: () => void;
};

const StepContext = createContext<StepContextType | undefined>(undefined);

type StepProviderProps = {
  children: ReactNode;
};

export const GameStepperProvider = ({ children }: StepProviderProps) => {
  const { address, isConnected, chain } = useAccount();
  const { data: balance, isLoading } = useBalance({ address });
  const { switchChain } = useSwitchChain();

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [hasEnoughEth, setHasEnoughEth] = useState(false);

  // Check if the user has enough ETH (>= 2 USD equivalent)
  const checkEthBalance = useCallback(() => {
    if (balance?.value && balance.value > 1e14 * 2) {
      setHasEnoughEth(true);
    } else {
      setHasEnoughEth(false);
    }
  }, [balance?.value]);

  // Request to switch the chain to Sepolia if not already connected
  const requestSwitchChain = useCallback(() => {
    switchChain({ chainId: sepolia.id });
  }, [switchChain]);

  // Side effect to handle chain switching and balance check
  useEffect(() => {
    if (isConnected && address && !isLoading) {
      if (chain?.id !== sepolia.id) {
        requestSwitchChain();
      }
      checkEthBalance();
    }
  }, [isConnected, address, balance, isLoading, chain, requestSwitchChain, checkEthBalance]);

  // Wrap the steps definition in useMemo to avoid unnecessary recalculations
  const steps = useMemo(
    () => [
      { id: 1, content: <Step0 /> },
      { id: 2, content: 'Step 2: Get Sepolia ETH' },
      { id: 3, content: 'Step 3: Buy Lottery Ticket' },
      { id: 4, content: 'Step 4: Submit Your Combination' },
    ],
    [],
  );

  // Wrap the goToOriginalStep function in useCallback
  const goToOriginalStep = useCallback(() => {
    setStep(0);
    localStorage.setItem('currentStep', String(0));
    localStorage.setItem('started', 'false');
  }, []);

  // Wrap the handleNext function in useCallback to prevent re-creation on each render
  const handleNext = useCallback(() => {
    if (step === 0) {
      setStarted(true);
      localStorage.setItem('started', 'true');
    }

    if (step < steps.length - 1) {
      const next = step + 1;
      setStep(next);
      localStorage.setItem('currentStep', String(next));
    }
  }, [step, steps.length]);

  // Retrieve saved state from localStorage on load
  useEffect(() => {
    const savedStarted = localStorage.getItem('started') === 'true';
    const savedStep = localStorage.getItem('currentStep');

    if (savedStep !== null) {
      setStep(Number(savedStep));
    }
    setStarted(savedStarted);
  }, []);

  // Wrap the context value in useMemo to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      address,
      started,
      step,
      steps,
      hasEnoughEth,
      isConnected,
      handleNext,
      goToOriginalStep,
    }),
    [address, started, step, steps, hasEnoughEth, isConnected, handleNext, goToOriginalStep],
  );

  return <StepContext.Provider value={contextValue}>{children}</StepContext.Provider>;
};

export const useStep = (): StepContextType => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error('useStep must be used within a StepProvider');
  }
  return context;
};
