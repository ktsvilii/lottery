import { SVGProps } from 'react';

export const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='1rem' height='1rem' {...props}>
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='m6.5 17l6 6l13-13'
      ></path>
    </svg>
  );
};
