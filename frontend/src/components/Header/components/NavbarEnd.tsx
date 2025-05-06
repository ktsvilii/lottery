import { FC } from 'react';
import { ThemeToggler } from '../../ThemeToggler';

export const NavbarEnd: FC = () => {
  return (
    <div className='navbar-end space-x-4'>
      <ThemeToggler />
    </div>
  );
};
