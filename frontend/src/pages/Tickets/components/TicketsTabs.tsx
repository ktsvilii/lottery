import { FC } from 'react';
import { TicketTabStatus } from '../../../types';
import { TFunction } from 'i18next';

interface TicketTabsProps {
  activeTab: TicketTabStatus;
  setActiveTab: (tab: TicketTabStatus) => void;
  t: TFunction;
}

const TABS: { tKey: string; status: TicketTabStatus }[] = [
  { tKey: 'all', status: TicketTabStatus.ALL },
  { tKey: 'active', status: TicketTabStatus.ACTIVE },
  { tKey: 'rewards_available', status: TicketTabStatus.REWARDS_AVAILABLE },
  { tKey: 'claimed', status: TicketTabStatus.REWARDS_CLAIMED },
  { tKey: 'no_reward', status: TicketTabStatus.NO_REWARD },
];

export const TicketTabs: FC<TicketTabsProps> = ({ activeTab, setActiveTab, t }) => (
  <div role='tablist' className='tabs tabs-border'>
    {TABS.map(({ tKey, status }) => (
      <a
        key={status}
        role='tab'
        className={`tab text-xs px-2 md:px-5 ${activeTab === status ? 'active' : ''}`}
        aria-selected={activeTab === status}
        tabIndex={activeTab === status ? 0 : -1}
        onClick={() => setActiveTab(status)}
      >
        {t(`tickets.tabs.${tKey}`)}
      </a>
    ))}
  </div>
);
