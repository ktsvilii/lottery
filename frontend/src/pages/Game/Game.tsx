import { FC } from 'react';

import { useStep } from '../../providers';
import { StepIndicator } from '../../components';

export const Game: FC = () => {
  const { steps, step } = useStep();

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-grow'>{steps[step]?.content}</div>

      <div className='flex-none sm:h-1/6 h-3/7'>
        <StepIndicator />
      </div>
    </div>
  );
};
