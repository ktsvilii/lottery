import { FC, SVGProps } from 'react';

export const ArrowUpIcon: FC = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='1em' height='1em' {...props}>
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12.013 21L12 3.211m7 6.777L12 3L5 9.988'
      ></path>
    </svg>
  );
};
