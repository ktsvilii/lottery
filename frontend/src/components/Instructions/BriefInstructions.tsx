import { FC } from 'react';

import { Link } from 'react-router-dom';

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

export const BriefInstructions: FC = () => {
  return (
    <div className='md:col-span-3'>
      <h1 className='text-4xl text-center mb-5'>How to play?</h1>
      <ul className='timeline timeline-snap-icon max-sm:timeline-compact max-w-8xl timeline-vertical place-self-center'>
        {/* Timeline Step 1 */}
        <li>
          <TimelineIcon />
          <div className='timeline-start mb-7 sm:text-end'>
            <StepHeader title='Connect MetaMask wallet' />
          </div>
          <hr />
        </li>

        {/* Step 2 */}
        <li>
          <hr />
          <TimelineIcon />
          <div className='timeline-end mb-7'>
            <StepHeader title='Get some Sepolia ETH' />
          </div>
          <hr />
        </li>

        {/* Step 2 */}
        <li>
          <hr />
          <TimelineIcon />
          <div className='timeline-start mb-7'>
            <StepHeader title='Buy a ticket' />
          </div>
          <hr />
        </li>

        {/* Step 3 */}
        <li>
          <hr />
          <TimelineIcon />
          <div className='timeline-end mb-7'>
            <StepHeader title='Submit your 5 Lucky Numbers' />
          </div>
          <hr />
        </li>

        {/* Step 4 */}
        <li>
          <hr />
          <TimelineIcon />
          <div className='timeline-start mb-3 sm:text-end'>
            <StepHeader title='Check results and Claim your prize' />
          </div>
        </li>
      </ul>

      <p className='md:mt-5 xlg:mt-12 place-self-center'>
        <small>
          More details of the ETHery game can be found{' '}
          <Link className='link link-info' to='/faq'>
            on the FAQ page
          </Link>
        </small>
      </p>
    </div>
  );
};
