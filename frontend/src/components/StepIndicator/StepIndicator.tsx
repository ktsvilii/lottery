import { FC } from 'react';

import { useStepper } from '@providers';

export const StepIndicator: FC = () => {
  const { step } = useStepper();

  const isStepCompleted = (index: number) => step + 1 > index;

  return (
    <ul className='steps steps-vertical sm:steps-horizontal w-full'>
      <li className={`step ${isStepCompleted(0) ? 'step-neutral' : ''}`}>Buy ETHery Ticket</li>
      <li className={`step ${isStepCompleted(1) ? 'step-neutral' : ''}`}>Submit Combination</li>
      <li className={`step ${isStepCompleted(2) ? 'step-neutral' : ''}`}>Get Random Combination</li>
      <li className={`step ${isStepCompleted(3) ? 'step-neutral' : ''}`}>Check Results</li>
    </ul>
  );
};
