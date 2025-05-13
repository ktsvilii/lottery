import { FC, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { StepIndicator, StepsSchema } from '@components';
import { useConnectWallet } from '@hooks';
import { useStepper } from '@providers';

export const Game: FC = () => {
  const navigate = useNavigate();
  const { step } = useStepper();
  const { address, isConnected } = useConnectWallet();

  useEffect(() => {
    if (!address || !isConnected) {
      navigate('/');
    }
  }, [address, isConnected, navigate]);

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-grow'>{StepsSchema[step]?.content}</div>

      {step < StepsSchema.length - 1 && (
        <div className='flex-none sm:h-1/6 h-3/7'>
          <StepIndicator />
        </div>
      )}
    </div>
  );
};
