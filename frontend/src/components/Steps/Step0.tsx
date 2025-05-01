import { FC } from 'react';

export const Step0: FC = () => {
  return (
    <div className='flex flex-col justify-center items-center h-full w-full space-y-5'>
      <h1 className='text-3xl text-center'>
        <strong>Step 1.</strong> Purchase an ETHery ticket
      </h1>
      <button className='btn btn-sm btn-primary min-w-72 text-xl h-16'>Buy now</button>
    </div>
  );
};
