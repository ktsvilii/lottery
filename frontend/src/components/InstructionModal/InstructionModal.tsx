import React, { RefObject } from 'react';
import { TFunction } from 'i18next';

type Props = {
  refObj: RefObject<HTMLDialogElement | null>;
  children: React.ReactNode;
  t: TFunction;
};

export const InstructionModal = ({ refObj, children, t }: Props) => (
  <dialog ref={refObj} className='modal'>
    <div className='modal-box'>{children}</div>
    <form method='dialog' className='modal-backdrop'>
      <button>{t('home.start_game.close_button')}</button>
    </form>
  </dialog>
);
