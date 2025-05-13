import { RefObject, useRef } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { TimelineIcon } from '@assets';
import { FAUCET_LINKS } from '@constants';
import { useConnectWallet, useMobile } from '@hooks';

import { InstructionModal } from '../InstructionModal';

import { MoreDetailsNotice, PrizesGrid, StepHeader } from './components';

import { PrizesGridConfig } from './types';

interface InstructionsStep {
  step_title: string;
  step_notice?: string;
  button_title: string;
  modal?: string;
}

export const Instructions = () => {
  const { handleConnectWallet } = useConnectWallet();
  const { t } = useTranslation();
  const buyRef = useRef<HTMLDialogElement>(null);
  const chooseRef = useRef<HTMLDialogElement>(null);
  const gridRef = useRef<HTMLDialogElement>(null);

  const mobile = useMobile();

  const openModal = (ref: RefObject<HTMLDialogElement | null>) => {
    ref.current?.showModal();
  };

  const getTranslationByStep = (step: number) =>
    t(`home.instructions.steps.step_${step}`, { returnObjects: true }) as InstructionsStep;

  return (
    <div className='max-w-2xl md:col-span-3'>
      <h1 className='text-3xl text-center mb-2'>{t('home.instructions.title')}</h1>
      <ul className='timeline timeline-snap-icon max-md:timeline-compact timeline-vertical place-self-center'>
        {/* Step 1 */}
        <li>
          <TimelineIcon />
          <div className='timeline-start md:text-end mb-4 md:mb-0'>
            <StepHeader title={getTranslationByStep(1).step_title} />
            <button className='btn btn-sm mt-1 w-48' onClick={handleConnectWallet}>
              {getTranslationByStep(1).button_title}
            </button>
          </div>
          <hr className='bg-neutral' />
        </li>

        {/* Step 2 */}
        <li>
          <hr className='bg-neutral' />
          <TimelineIcon />
          <div className='timeline-end'>
            <StepHeader title={getTranslationByStep(2).step_title} />
            {!mobile && <p className='text-sm'>{getTranslationByStep(2).step_notice}</p>}
            <div className='container space-x-2 space-y-2 flex flex-wrap'>
              {FAUCET_LINKS.map(({ label, href }) => (
                <a key={href} href={href} target='_blank' rel='noopener noreferrer' className='btn btn-sm mt-1 w-32'>
                  {label}
                </a>
              ))}
            </div>
          </div>
          <hr className='bg-neutral' />
        </li>

        {/* Step 3 */}
        <li>
          <hr className='bg-neutral' />
          <TimelineIcon />
          <div className='timeline-start md:text-end mb-4 md:mb-0'>
            <StepHeader title={getTranslationByStep(3).step_title} />
            {!mobile && <p className='text-sm'>{getTranslationByStep(3).step_notice}</p>}
            <button className='btn btn-sm mt-1 w-48' onClick={() => openModal(buyRef)}>
              See details
            </button>
            <InstructionModal t={t} refObj={buyRef}>
              <ul className='steps steps-vertical flex flex-col'>
                <Trans
                  i18nKey={'home.instructions.steps.step_3.modal'}
                  components={[<li className='step step-neutral' />]}
                />
              </ul>
            </InstructionModal>
          </div>
          <hr className='bg-neutral' />
        </li>

        {/* Step 4 */}
        <li>
          <hr className='bg-neutral' />
          <TimelineIcon />
          <div className='timeline-end mb-4 md:mb-0'>
            <StepHeader title={getTranslationByStep(4).step_title} />
            {!mobile && <p className='text-sm'>{getTranslationByStep(4).step_notice}</p>}
            <button className='btn btn-sm mt-1 w-48' onClick={() => openModal(chooseRef)}>
              See details
            </button>
            <InstructionModal t={t} refObj={chooseRef}>
              <ul className='steps steps-vertical flex flex-col'>
                <Trans
                  i18nKey={'home.instructions.steps.step_4.modal'}
                  components={[<li className='step step-neutral' />]}
                />
              </ul>
            </InstructionModal>
          </div>
          <hr className='bg-neutral' />
        </li>

        {/* Step 5 */}
        <li>
          <hr className='bg-neutral' />
          <TimelineIcon />
          <div className='timeline-start md:text-end mb-4 md:mb-0'>
            <StepHeader title={getTranslationByStep(5).step_title} />
            {!mobile && <p className='text-sm'>{getTranslationByStep(5).step_notice}.</p>}
          </div>
          <hr className='bg-neutral' />
        </li>

        {/* Step 6 */}
        <li>
          <hr className='bg-neutral' />
          <TimelineIcon />
          <div className='timeline-end md:mb-0'>
            <StepHeader title={getTranslationByStep(6).step_title} />
            {!mobile && <p className='text-sm'>{getTranslationByStep(6).step_notice}</p>}
            <button className='btn btn-sm mt-1 w-48' onClick={() => openModal(gridRef)}>
              See prizes grid
            </button>
            <InstructionModal t={t} refObj={gridRef}>
              <PrizesGrid config={t('home.instructions.prize_grid', { returnObjects: true }) as PrizesGridConfig} />
            </InstructionModal>
          </div>
        </li>
      </ul>

      <MoreDetailsNotice />
    </div>
  );
};
