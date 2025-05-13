import { FC } from 'react';

interface TicketsTableFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const TicketsTableFilter: FC<TicketsTableFilterProps> = ({ value, onChange }) => (
  <div className='mb-2'>
    <input
      type='text'
      placeholder='Filter by Ticket # or Owner'
      value={value}
      onChange={e => onChange(e.target.value)}
      className='input max-w-72 min-w-48'
    />
  </div>
);
