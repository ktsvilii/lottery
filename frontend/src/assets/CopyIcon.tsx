import { SVGProps } from 'react';

export const CopyIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      stroke='darkgray'
      strokeWidth='0.2px'
      width='1rem'
      height='1rem'
      {...props}
    >
      <path fill='currentColor' d='M7.5 17V3h11v14zm1-1h9V4h-9zm-4 4V6.616h1V19h9.385v1zm4-4V4z'></path>
    </svg>
  );
};
