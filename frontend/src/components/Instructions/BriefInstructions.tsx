import { FC, useId } from 'react';

import { useTranslation } from 'react-i18next';

import { TimelineIcon } from '@assets';

import { MoreDetailsNotice, StepHeader } from './components';

export const BriefInstructions: FC = () => {
  const id = useId();
  const { t } = useTranslation();
  const steps = t('home.brief_instructions.steps', { returnObjects: true }) as Record<string, string>;
  const tKeys = Object.keys(steps);

  return (
    <div className='md:col-span-3'>
      <h1 className='text-4xl text-center mb-5'>{t('home.brief_instructions.title')}</h1>
      <ul className='timeline timeline-snap-icon max-sm:timeline-compact max-w-8xl timeline-vertical place-self-center'>
        {tKeys.map((title, index) => (
          <li key={id + index}>
            {index !== 0 && <hr className='bg-neutral' />}
            <TimelineIcon />
            <div className={`mb-4 md:mb-7 ${index % 2 === 0 ? 'timeline-start sm:text-end' : 'timeline-end'}`}>
              <StepHeader title={steps[title]} />
            </div>
            {index < tKeys.length - 1 && <hr className='bg-neutral' />}
          </li>
        ))}
      </ul>
      <MoreDetailsNotice />
    </div>
  );
};
