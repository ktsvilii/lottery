import React, { useRef } from 'react';

import { Link } from 'react-router-dom';
import { InstructionModal } from '../InstructionModal';
import { useConnectWallet, useMobile } from '../../hooks';
import { TimelineIcon, StepHeader } from './components';

const faucetLinks = [
  {
    label: 'Google Faucet',
    href: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
  },
  {
    label: 'POW Faucet',
    href: 'https://sepolia-faucet.pk910.de/',
  },
];

export const Instructions = () => {
  const { handleConnectWallet } = useConnectWallet();

  const buyRef = useRef<HTMLDialogElement>(null);
  const chooseRef = useRef<HTMLDialogElement>(null);
  const gridRef = useRef<HTMLDialogElement>(null);

  const mobile = useMobile();

  const openModal = (ref: React.RefObject<HTMLDialogElement | null>) => {
    ref.current?.showModal();
  };

  return (
    <div className='max-w-2xl md:col-span-3'>
      <h1 className='text-3xl text-center mb-2'>How to play?</h1>
      <ul className='timeline timeline-snap-icon max-md:timeline-compact timeline-vertical place-self-center'>
        {/* Step 1 */}
        <li>
          <TimelineIcon />
          <div className='timeline-start md:text-end mb-4 md:mb-0'>
            <StepHeader title='Connect MetaMask wallet' />
            <button className='btn btn-sm mt-1 w-48' onClick={handleConnectWallet}>
              Connect MetaMask
            </button>
          </div>
          <hr className='bg-neutral' />
        </li>

        {/* Step 2 */}
        <li>
          <hr className='bg-neutral' />
          <TimelineIcon />
          <div className='timeline-end'>
            <StepHeader title='Get some Sepolia ETH' />
            {!mobile && <p className='text-sm'>Don't worry, it's free!</p>}
            <div className='container space-x-2 space-y-2 flex flex-wrap'>
              {faucetLinks.map(({ label, href }) => (
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
            <StepHeader title='Buy a ticket' />
            {!mobile && <p className='text-sm'>To participate you will need an ETHery ticket</p>}
            <button className='btn btn-sm mt-1 w-48' onClick={() => openModal(buyRef)}>
              See details
            </button>
            <InstructionModal refObj={buyRef}>
              <ul className='steps steps-vertical flex flex-col'>
                <li className='step step-neutral'>Click the "Buy Ticket" button.</li>
                <li className='step step-neutral'>Complete transaction in Metamask wallet</li>
                <li className='step step-neutral'>We assign a new ticket number to your wallet</li>
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
            <StepHeader title='Time to play!' />
            {!mobile && <p className='text-sm'>Submit your unique 5 Numbers in range 0 and 36</p>}
            <button className='btn btn-sm mt-1 w-48' onClick={() => openModal(chooseRef)}>
              See details
            </button>
            <InstructionModal refObj={chooseRef}>
              <ul className='steps steps-vertical flex flex-col'>
                <li className='step step-neutral'>Submit 5 unique numbers in range 0 and 36.</li>
                <li className='step step-neutral'>Order doesn't matter</li>
                <li className='step step-neutral'>Once submitted, your combination is locked and cannot be changed.</li>
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
            <StepHeader title='Wait for the Winning Combination' />
            {!mobile && (
              <p className='text-sm'>Blockchain will generate a random the winning combination using Chainlink VRF.</p>
            )}
          </div>
          <hr className='bg-neutral' />
        </li>

        {/* Step 6 */}
        <li>
          <hr className='bg-neutral' />
          <TimelineIcon />
          <div className='timeline-end md:mb-0'>
            <StepHeader title='Check results and Claim prize' />
            {!mobile && (
              <p className='text-sm'>
                You’ll see how many numbers you matched. If you win, your reward will be sent directly to your wallet!
              </p>
            )}
            <button className='btn btn-sm mt-1 w-48' onClick={() => openModal(gridRef)}>
              See prizes grid
            </button>
            <InstructionModal refObj={gridRef}>
              <table className='table table-zebra'>
                <thead>
                  <tr className='bg-base-200'>
                    <th>Matches</th>
                    <th>Reward</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>0</th>
                    <td>Better luck next time</td>
                  </tr>
                  <tr>
                    <th>1</th>
                    <td>Refund 80% of the ticket price</td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>5% of the Jackpot</td>
                  </tr>
                  <tr>
                    <th>3</th>
                    <td>10% of the Jackpot</td>
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

      <p className='mt-1 md:mt-5 xlg:mt-12 place-self-center'>
        <small>
          More details of the ETHery game can be found{' '}
          <Link className='link' to='/faq'>
            on the FAQ page
          </Link>
        </small>
      </p>
    </div>
  );
};
