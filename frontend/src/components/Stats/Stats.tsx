import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { formatEther } from 'viem';

import { PaidIcon, PendingIcon, TicketIcon } from '@assets';
import { Ticket } from '@types';

interface StatsProps {
  tickets: Ticket[];
}

const tKey = 'admin_panel.stats';

export const Stats: FC<StatsProps> = ({ tickets }) => {
  const { t } = useTranslation();

  const pendingReward = tickets.reduce((acc, ticket) => {
    return !ticket.isRewardClaimed ? acc + ticket.potentialReward : acc;
  }, 0n);

  const paidReward = tickets.reduce((acc, ticket) => {
    return ticket.isRewardClaimed ? acc + ticket.actualReward : acc;
  }, 0n);

  return (
    <div className='stats shadow stats-vertical lg:stats-horizontal w-72 lg:w-auto'>
      <div className='stat'>
        <div className='stat-figure'>
          <TicketIcon />
        </div>
        <div className='stat-title'>{t(`${tKey}.tickets`)}</div>
        <div className='stat-value text-xl sm:text-3xl'>{tickets.length}</div>
      </div>

      <div className='stat'>
        <div className='stat-figure'>
          <PendingIcon />
        </div>
        <div className='stat-title'>{t(`${tKey}.pending_reward`)}</div>
        <div className='stat-value text-xl sm:text-3xl'>{formatEther(pendingReward)} ETH</div>
      </div>

      <div className='stat'>
        <div className='stat-figure'>
          <PaidIcon />
        </div>
        <div className='stat-title'>{t(`${tKey}.paid_reward`)}</div>
        <div className='stat-value text-xl sm:text-3xl'>{formatEther(paidReward)} ETH</div>
      </div>
    </div>
  );
};
