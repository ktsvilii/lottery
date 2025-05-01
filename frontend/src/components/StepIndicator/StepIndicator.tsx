import { FC } from 'react';

import { useStep } from '../../providers';

export const StepIndicator: FC = () => {
  const { step } = useStep();

  console.log(step);

  const isStepCompleted = (index: number) => step + 1 > index;

  return (
    <ul className='steps steps-vertical sm:steps-horizontal w-full'>
      <li className={`step ${isStepCompleted(0) ? 'step-primary' : ''}`}>Buy ETHery Ticket</li>
      <li className={`step ${isStepCompleted(1) ? 'step-primary' : ''}`}>Submit Combination</li>
      <li className={`step ${isStepCompleted(2) ? 'step-primary' : ''}`}>Get Random Combination</li>
      <li className={`step ${isStepCompleted(3) ? 'step-primary' : ''}`}>Get Results</li>
    </ul>
  );
};
