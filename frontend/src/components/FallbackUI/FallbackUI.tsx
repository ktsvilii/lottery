import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGameContext } from '@providers';

export const FallbackUI: FC = () => {
  const navigate = useNavigate();
  const { setTicketState } = useGameContext();

  const goHome = () => {
    navigate('/');
    setTicketState(undefined);
  };

  return (
    <div className='flex flex-col items-center justify-start h-full w-full gap-5 md:pt-20 pt-8'>
      <h1 className='text-3xl text-center'>
        <strong>Something went wrong.</strong>
      </h1>

      <button className='btn btn-sm btn-outline min-w-60 text-xl h-12' onClick={goHome}>
        Return to homepage
      </button>
    </div>
  );
};
