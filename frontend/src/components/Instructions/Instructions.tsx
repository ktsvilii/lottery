import React, { RefObject, useRef } from 'react';
import { Link } from 'react-router-dom';

import { InstructionModal } from '../InstructionModal';

const StepHeader = ({ title }: { title: string }) => <h3 className='text-lg font-black'>{title}</h3>;

const TimelineIcon = () => (
  <div className='timeline-middle'>
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='h-5 w-5'>
      <path
        fillRule='evenodd'
        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z'
        clipRule='evenodd'
      />
    </svg>
  </div>
);

export const Instructions = () => {
  const buyRef = useRef<HTMLDialogElement>(null);
  const chooseRef = useRef<HTMLDialogElement>(null);
  const gridRef = useRef<HTMLDialogElement>(null);

  const openModal = (ref: React.RefObject<HTMLDialogElement>) => {
    ref.current?.showModal();
  };

  return (
    <>
      <h1 className='text-3xl text-center mb-3'>How to play?</h1>
      <ul className='timeline timeline-snap-icon max-md:timeline-compact max-w-8xl timeline-vertical place-self-center'>
        {/* Timeline Step 1 */}
        <li>
          <TimelineIcon />
          <div className='timeline-start md:text-end mb-4 md:mb-0'>
            <StepHeader title='Connect MetaMask wallet' />
            <button className='btn btn-sm mt-1 w-48' onClick={() => openModal(buyRef as RefObject<HTMLDialogElement>)}>
              Connect MetaMask
            </button>
          </div>
          <hr />
        </li>

        {/* Step 2 */}
        <li>
          <hr />
          <TimelineIcon />
          <div className='timeline-end'>
            <StepHeader title='Get some Sepolia ETH' />
            <p className='text-sm'>Don't worry, it's free!</p>
            <div className='container space-x-4 space-y-2 flex flex-wrap'>
              <button
                className='btn btn-sm mt-1 w-48'
                onClick={() => openModal(buyRef as RefObject<HTMLDialogElement>)}
              >
                Use Google Cloud Faucet
              </button>
              <button
                className='btn btn-sm mt-1 w-48'
                onClick={() => openModal(buyRef as RefObject<HTMLDialogElement>)}
              >
                Use POW Faucet
              </button>
            </div>
          </div>
          <hr />
        </li>

        {/* Step 3 */}
        <li>
          <hr />
          <TimelineIcon />
          <div className='timeline-start md:text-end mb-4 md:mb-0'>
            <StepHeader title='Buy a ticket' />
            <p className='text-sm'>To participate you will need an ETHery ticket</p>
            <button className='btn btn-sm mt-1 w-48' onClick={() => openModal(buyRef as RefObject<HTMLDialogElement>)}>
              See details
            </button>
            <InstructionModal refObj={buyRef as RefObject<HTMLDialogElement>}>
              <ul className='steps md:steps-horizontal steps-vertical'>
                <li className='step step-neutral'>Click the "Buy Ticket" button.</li>
                <li className='step step-neutral'>Complete transaction in Metamask wallet</li>
                <li className='step step-neutral'>We assign a new ticket number to your wallet</li>
              </ul>
            </InstructionModal>
          </div>
          <hr />
        </li>

        {/* Step 3 */}
        <li>
          <hr />
          <TimelineIcon />
          <div className='timeline-end mb-4 md:mb-0'>
            <StepHeader title='Time to play!' />
            <p className='text-sm'>Enter and submit your unique 5 Numbers</p>
            <button
              className='btn btn-sm mt-1 w-48'
              onClick={() => openModal(chooseRef as RefObject<HTMLDialogElement>)}
            >
              See details
            </button>
            <InstructionModal refObj={chooseRef as RefObject<HTMLDialogElement>}>
              <ul className='steps steps-vertical md:steps-horizontal'>
                <li className='step step-neutral'>Submit 5 unique numbers in range 0 and 36.</li>
                <li className='step step-neutral'>Order doesn't matter</li>
                <li className='step step-neutral'>Avoid duplicates</li>
                <li className='step step-neutral'>Once submitted, your combination is locked and cannot be changed.</li>
              </ul>
            </InstructionModal>
          </div>
          <hr />
        </li>

        {/* Step 4 */}
        <li>
          <hr />
          <TimelineIcon />
          <div className='timeline-start md:text-end mb-4 md:mb-0'>
            <StepHeader title='Wait for the Winning Combination' />
            <p className='text-sm'>Blockchain will generate a random the winning combination using Chainlink VRF.</p>
          </div>
          <hr />
        </li>

        {/* Step 5 */}
        <li>
          <hr />
          <TimelineIcon />
          <div className='timeline-end mb-4 md:mb-0'>
            <StepHeader title='Check results and Claim prize' />
            <p className='text-sm'>
              You’ll see how many numbers you matched. If you win, your reward will be sent directly to your wallet!
            </p>
            <button className='btn btn-sm mt-1 w-48' onClick={() => openModal(gridRef as RefObject<HTMLDialogElement>)}>
              See prizes grid
            </button>
            <InstructionModal refObj={gridRef as RefObject<HTMLDialogElement>}>
              <table className='table table-zebra'>
                <thead>
                  <tr className='bg-base-200'>
                    <th>Matches</th>
                    <th>Reward</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>0–1</th>
                    <td>None</td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>Refund of the ticket price</td>
                  </tr>
                  <tr>
                    <th>3</th>
                    <td>5% of the Jackpot</td>
                  </tr>
                  <tr>
                    <th>4</th>
                    <td>30% of the Jackpot</td>
                  </tr>
                  <tr>
                    <th>5</th>
                    <td>100% of the Jackpot (Grand Prize!)</td>
                  </tr>
                </tbody>
              </table>
            </InstructionModal>
          </div>
        </li>
      </ul>

      <p className='mt-4 md:mt-5 xlg:mt-12 place-self-center'>
        <small>
          More details of the ETHery game can be found{' '}
          <Link className='link link-info' to='/faq'>
            on the FAQ page
          </Link>
        </small>
      </p>
    </>
  );
};
