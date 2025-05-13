import { FC } from 'react';

import { Loader } from '@components';
import { preventNonNumericInput } from '@utils';

import { useSubmitCombination } from './useSubmitCombination';

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

  return (
    <div className='flex flex-col items-center justify-start h-full w-full gap-5 md:pt-20'>
      <h1 className='text-3xl text-center mb-5'>
        <strong>Step 2.</strong> Enter and submit a combination of <strong className='underline'>5 unique</strong>{' '}
        numbers
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
            <p className='validator-hint text-sm text-gray-500 mt-1'>Must be between 0 to 36</p>
          </div>
        ))}
      </div>

      {hasDuplicates && <p className='text-red-500 text-sm'>Each number must be unique.</p>}

      <button
        className='btn btn-sm btn-outline min-w-72 text-xl h-16'
        disabled={!isValid() || isSubmittingCombination}
        onClick={submitPlayerCombinationHandler}
      >
        {isSubmittingCombination ? <Loader size='xl' /> : 'Submit combination'}
      </button>
    </div>
  );
};
