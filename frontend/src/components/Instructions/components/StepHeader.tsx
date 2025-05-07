import { FC } from 'react';

interface StepHeaderProps {
  title: string;
}

export const StepHeader: FC<StepHeaderProps> = ({ title }) => {
  return <h3 className='text-lg font-black'>{title}</h3>;
};
