import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { ThemeToggler } from '../../ThemeToggler';
import { useAdmin } from '../../../hooks';
import { LanguageSwitcher } from '../../languageSwitcher';

export const NavbarEnd: FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const goToAdmin = () => {
    if (isAdmin) {
      navigate('/admin');
    }
  };

  return (
    <div className='navbar-end space-x-6'>
      <LanguageSwitcher />
      <ThemeToggler />
      {isAdmin && (
        <div className='avatar avatar-placeholder'>
          <button
            onClick={goToAdmin}
            className='bg-neutral text-neutral-content m-0 p-0 w-9 rounded-full h-9 text-sm cursor-pointer'
          >
            A
          </button>
        </div>
      )}
    </div>
  );
};
