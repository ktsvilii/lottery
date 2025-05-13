import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Loader } from '@components';

import { useCountdown } from './useCountdown';

const tKey = 'game.step_3';

export const CountdownStep: FC = () => {
  const { minutes, seconds, isCheckingResults, isResultReady, seeResultsHandler } = useCountdown();
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center justify-start h-full w-full gap-5 md:pt-20'>
      <h1 className='text-3xl text-center mb-5'>
        <Trans i18nKey={`${tKey}.title`} components={[<strong key={0} />]} />
      </h1>

      <div className='text-center'>
        <Trans i18nKey={`${tKey}.result_${isResultReady ? 'ready' : 'pending'}`} components={[<p />]} />
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
          {t(`${tKey}.min`)}
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
          {t(`${tKey}.sec`)}
        </div>
      </div>
      <button
        className='btn btn-sm btn-outline min-w-72 text-xl h-16'
        onClick={seeResultsHandler}
        disabled={!!minutes || !!seconds}
      >
        {isCheckingResults ? <Loader size='xl' /> : t(`${tKey}.button`)}
      </button>
    </div>
  );
};
