import { FC, useEffect } from 'react';

import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ManageLotteryButtons, Stats, TicketsTable } from '@components';
import { useAdmin } from '@hooks';

const tKey = 'admin_panel';

export const Admin: FC = () => {
  const navigate = useNavigate();

  const { isAdmin, allTickets, fetchAllTickets } = useAdmin();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    fetchAllTickets();
  }, []);

  return (
    <>
      <h1 className='text-3xl text-center'>
        <strong>
          <Trans i18nKey={`${tKey}.title`} />
        </strong>
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 order-1 mt-4 lg:mt-10'>
        <div className='order-1 col-span-1 md:order-1 lg:col-span-5 flex lg:justify-center'>
          <Stats tickets={allTickets} />
        </div>

        <div className='lg:order-3 col-span-1 lg:col-span-2 md:order-2 order-2'>
          <ManageLotteryButtons />
        </div>
        <div className='lg:col-span-3 sm:col-span-full order-2 md:order-3 lg:order-2'>
          <div className='space-y-5'>
            <TicketsTable allTickets={allTickets} fetchAllTickets={fetchAllTickets} />
          </div>
        </div>
      </div>
    </>
  );
};
