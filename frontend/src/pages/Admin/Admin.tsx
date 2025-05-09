import { FC, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAdmin } from '../../hooks';
import { TicketsTable } from '../../components';

export const Admin: FC = () => {
  const navigate = useNavigate();

  const { isAdmin, allTickets } = useAdmin();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  return (
    <>
      <h1 className='text-3xl text-center'>
        <strong>Admin panel</strong>
      </h1>
      <div className='max-w-12xl mx-auto grid grid-cols-1 md:grid-cols-5'>
        <div className='max-w-8xl md:col-span-3 space-y-5 place-items-center mt-5'>
          <TicketsTable tickets={allTickets} />
        </div>
      </div>
    </>
  );
};
