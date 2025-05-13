import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useSubmitCombination } from './useSubmitCombination';
import { Loader } from '../../Loader';
import { preventNonNumericInput } from '../../../utils';

const tKey = 'game.step_2';

export const SubmitCombinationStep: FC = () => {
  const {
    playerCombination,
    isSubmittingCombination,
    baseId,
    hasDuplicates,
    handleChange,
    isValid,
    submitPlayerCombinationHandler,
  } = useSubmitCombination();
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center justify-start h-full w-full gap-5 md:pt-20'>
      <h1 className='text-3xl text-center mb-5'>
        <Trans i18nKey={`${tKey}.title`} components={[<strong key={0} />, <strong key={1} className='underline' />]} />
      </h1>

      <div className='flex flex-row gap-4 mb-4 justify-center'>
        {[...Array(5)].map((_, i) => (
          <div key={`${baseId}-${i}`} className='flex flex-col items-center'>
            <label htmlFor={`${baseId}-${i}`} className='sr-only'>
              Number {i + 1}
            </label>
            <input
              id={`${baseId}-${i}`}
              type='number'
              className='input validator max-w-14 input-xl'
              onKeyDown={preventNonNumericInput}
              value={(playerCombination[i] as unknown as string) ?? ''}
              onChange={e => handleChange(i, e.target.value)}
              required
              min='0'
              max='36'
            />
            <p className='validator-hint text-sm text-gray-500 mt-1'>{t(`${tKey}.invalid_value`)}</p>
          </div>
        ))}
      </div>

      {hasDuplicates && <p className='text-red-500 text-sm'>{t(`${tKey}.not_uniq`)}</p>}

      <button
        className='btn btn-sm btn-outline min-w-72 text-xl h-16'
        disabled={!isValid() || isSubmittingCombination}
        onClick={submitPlayerCombinationHandler}
      >
        {isSubmittingCombination ? <Loader size='xl' /> : t(`${tKey}.button`)}
      </button>
    </div>
  );
};
