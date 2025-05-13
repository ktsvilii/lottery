import { FC, useEffect } from 'react';

import { isMobile } from 'react-device-detect';

import { BriefInstructions, Instructions, StartGame } from '@components';
import { CURRENT_STEP } from '@constants';
import { useGameContext, useStepper } from '@providers';

export const Home: FC = () => {
  const { setCurrentStep } = useStepper();
  const { setTicketState } = useGameContext();

  useEffect(() => {
    return () => {
      setCurrentStep(0);
      setTicketState(undefined);
      localStorage.removeItem(CURRENT_STEP);
    };
  }, [setCurrentStep, setTicketState]);

  return (
    <div className='max-w-12xl mx-auto grid grid-cols-1 md:grid-cols-5'>
      <StartGame />

      {isMobile ? <BriefInstructions /> : <Instructions />}
    </div>
  );
};
