import { FC } from 'react';

import { useCountdown } from './useCountdown';

import { Loader } from '@components';

export const CountdownStep: FC = () => {
  const { minutes, seconds, isCheckingResults, isResultReady, seeResultsHandler } = useCountdown();

  return (
    <div className='flex flex-col items-center justify-start h-full w-full gap-5 md:pt-20'>
      <h1 className='text-3xl text-center mb-5'>
        <strong>Step 3.</strong> Wait until we generate random combination for you
      </h1>

      <div className='text-center'>
        {isResultReady ? (
          <p>Results are ready, you can check your reward.</p>
        ) : (
          <>
            <p>We will inform you when results are ready.</p>
            <p>This should not take more then:</p>
          </>
        )}
      </div>

      <div className='grid grid-flow-col gap-5 text-center auto-cols-max'>
        <div className='flex flex-col p-2 bg-neutral rounded-box text-neutral-content'>
          <span className='countdown font-mono text-5xl'>
            <span
              style={{ '--value': minutes } as React.CSSProperties}
              aria-live='polite'
              aria-label='minutes remaining'
            >
              {minutes}
            </span>
          </span>
          min
        </div>
        <div className='flex flex-col p-2 bg-neutral rounded-box text-neutral-content'>
          <span className='countdown font-mono text-5xl'>
            <span
              style={{ '--value': seconds } as React.CSSProperties}
              aria-live='polite'
              aria-label='seconds remaining'
            >
              {seconds}
            </span>
          </span>
          sec
        </div>
      </div>
      <button
        className='btn btn-sm btn-outline min-w-72 text-xl h-16'
        onClick={seeResultsHandler}
        disabled={!!minutes || !!seconds}
      >
        {isCheckingResults ? <Loader size='xl' /> : 'See Results'}
      </button>
    </div>
  );
};
