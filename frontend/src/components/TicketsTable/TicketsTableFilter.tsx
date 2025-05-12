import { FC } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const TicketsTableFilter: FC<Props> = ({ value, onChange }) => (
  <div className='mb-2'>
    <input
      type='text'
      placeholder='Filter by Ticket # or Owner'
      value={value}
      onChange={e => onChange(e.target.value)}
      className='input w-full max-w-xs'
    />
  </div>
);
