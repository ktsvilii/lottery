import { FC, useId } from 'react';
import { Link } from 'react-router-dom';
import { StepHeader } from './components';
import { BRIEF_INSTRUCTIONS_STEPS } from '@constants';
import { TimelineIcon } from '@assets';

export const BriefInstructions: FC = () => {
  const id = useId();
  return (
    <div className='md:col-span-3'>
      <h1 className='text-4xl text-center mb-5'>How to play?</h1>
      <ul className='timeline timeline-snap-icon max-sm:timeline-compact max-w-8xl timeline-vertical place-self-center'>
        {BRIEF_INSTRUCTIONS_STEPS.map((title, index) => (
          <li key={id + index}>
            {index !== 0 && <hr className='bg-neutral' />}
            <TimelineIcon />
            <div className={`mb-7 ${index % 2 === 0 ? 'timeline-start sm:text-end' : 'timeline-end'}`}>
              <StepHeader title={title} />
            </div>
            {index < BRIEF_INSTRUCTIONS_STEPS.length - 1 && <hr className='bg-neutral' />}
          </li>
        ))}
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
