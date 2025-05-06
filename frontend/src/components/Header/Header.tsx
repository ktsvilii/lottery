import { FC } from 'react';
import { NavbarCenter, NavbarEnd, NavbarStart } from './components';

export const Header: FC = () => {
  return (
    <div className='navbar bg-base-100 shadow-sm'>
      <NavbarStart />
      <NavbarCenter />
      <NavbarEnd />
    </div>
  );
};
