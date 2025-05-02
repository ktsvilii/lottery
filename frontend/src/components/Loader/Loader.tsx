import { FC } from 'react';

interface LoaderProps {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Loader: FC<LoaderProps> = ({ size }) => (
  <span className={`loading loading-spinner loading-${size}`}></span>
);
