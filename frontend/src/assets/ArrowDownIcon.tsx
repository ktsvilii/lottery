import { FC, SVGProps } from 'react';

export const ArrowDownIcon: FC = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='1em' height='1em' {...props}>
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12.013 3L12 20.789m7-6.776L12 21l-7-6.988'
      ></path>
    </svg>
  );
};
