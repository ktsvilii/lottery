import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const tKey = 'admin_panel';

export const TicketsTableFilter: FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className='mb-2'>
      <input
        type='text'
        placeholder={t(`${tKey}.filter`)}
        value={value}
        onChange={e => onChange(e.target.value)}
        className='input max-w-72 min-w-48'
      />
    </div>
  );
};
