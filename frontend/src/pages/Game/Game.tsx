import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStepper } from '../../providers';
import { StepIndicator } from '../../components';
import { useConnectWallet } from '../../hooks';

export const Game: FC = () => {
  const navigate = useNavigate();
  const { steps, step } = useStepper();
  const { address, isConnected } = useConnectWallet();

  useEffect(() => {
    if (!address || !isConnected) {
      navigate('/');
    }
  }, [address, isConnected, navigate]);

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-grow'>{steps[step]?.content}</div>

      {step < steps.length - 1 && (
        <div className='flex-none sm:h-1/6 h-3/7'>
          <StepIndicator />
        </div>
      )}
    </div>
  );
};
