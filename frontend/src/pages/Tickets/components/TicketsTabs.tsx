import { FC } from 'react';
import { TicketTabStatus } from '../../../types';

interface TicketTabsProps {
  activeTab: TicketTabStatus;
  setActiveTab: (tab: TicketTabStatus) => void;
}

const TABS: { label: string; status: TicketTabStatus }[] = [
  { label: 'All', status: TicketTabStatus.ALL },
  { label: 'Active', status: TicketTabStatus.ACTIVE },
  { label: 'Rewards Available', status: TicketTabStatus.REWARDS_AVAILABLE },
  { label: 'Claimed', status: TicketTabStatus.REWARDS_CLAIMED },
  { label: 'No Reward', status: TicketTabStatus.NO_REWARD },
];

export const TicketTabs: FC<TicketTabsProps> = ({ activeTab, setActiveTab }) => (
  <div role='tablist' className='tabs tabs-border'>
    {TABS.map(({ label, status }) => (
      <a
        key={status}
        role='tab'
        className={`tab text-xs px-3 ${activeTab === status ? 'active' : ''}`}
        aria-selected={activeTab === status}
        tabIndex={activeTab === status ? 0 : -1}
        onClick={() => setActiveTab(status)}
      >
        {label}
      </a>
    ))}
  </div>
);
