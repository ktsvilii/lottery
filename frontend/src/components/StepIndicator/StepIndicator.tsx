import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { useStepper } from '@providers';

export const StepIndicator: FC = () => {
  const { step } = useStepper();
  const { t } = useTranslation();

  const isStepCompleted = (index: number) => step + 1 > index;

  return (
    <ul className='steps steps-vertical sm:steps-horizontal w-full'>
      {[...Array(4)].map((_, index) => (
        <li key={index} className={`step ${isStepCompleted(index) ? 'step-neutral' : ''}`}>
          {t(`game.step_${index + 1}.stepper_title`)}
        </li>
      ))}
    </ul>
  );
};
