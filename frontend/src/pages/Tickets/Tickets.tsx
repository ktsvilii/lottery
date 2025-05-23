import { FC, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Loader } from '@components';
import { useFetchTickets } from '@hooks';
import { TicketTabStatus } from '@types';

import { TicketList, TicketTabs } from './components';
import { useTickets } from './useTickets';

export const Tickets: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { tickets, isFetchingTickets, fetchUserTicketsHandler } = useFetchTickets();
  const categorized = useTickets(tickets ?? []);

  const [activeTab, setActiveTab] = useState(TicketTabStatus.ALL);

  useEffect(() => {
    fetchUserTicketsHandler();
  }, []);

  const renderTickets = categorized[activeTab] || [];

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-grow'>
        {isFetchingTickets ? (
          <div className='flex items-center justify-center h-full w-full'>
            <Loader size='xl' />
          </div>
        ) : (
          <div className='flex flex-col items-center justify-start h-full w-full gap-5'>
            <h1 className='text-3xl text-center'>
              <strong>{t('tickets.title')}</strong>
            </h1>

            <TicketTabs t={t} activeTab={activeTab} setActiveTab={setActiveTab} />

            <TicketList tickets={renderTickets} />

            <button className='btn btn-sm btn-outline min-w-72 text-xl h-16' onClick={() => navigate(-1)}>
              {t('tickets.go_back')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
