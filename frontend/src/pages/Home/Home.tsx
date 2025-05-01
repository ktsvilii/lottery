import { FC } from 'react';

import { BriefInstructions, StartGame } from '../../components';

export const Home: FC = () => {
  return (
    <div className='max-w-12xl mx-auto grid grid-cols-1 md:grid-cols-5'>
      <StartGame />

      <BriefInstructions />
    </div>
  );
};
