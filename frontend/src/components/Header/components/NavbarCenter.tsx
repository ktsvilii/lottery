import { FC } from 'react';

import { Link } from 'react-router-dom';

export const NavbarCenter: FC = () => {
  return (
    <div className='navbar-center'>
      <Link to='/' className='btn btn-ghost text-xl'>
        ETHery
      </Link>
    </div>
  );
};
