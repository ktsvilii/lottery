import React, { RefObject } from 'react';

type Props = {
  refObj: RefObject<HTMLDialogElement>;
  children: React.ReactNode;
};

export const InstructionModal = ({ refObj, children }: Props) => (
  <dialog ref={refObj} className='modal'>
    <div className='modal-box max-w-2xl'>{children}</div>
    <form method='dialog' className='modal-backdrop'>
      <button>close</button>
    </form>
  </dialog>
);
