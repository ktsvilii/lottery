import { FC } from 'react';

export const FAQItem: FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
  <div className='collapse collapse-arrow bg-base-100 border border-base-300'>
    <input type='radio' name='lottery-faq' />
    <div className='collapse-title font-semibold'>
      <p>{question}</p>
    </div>
    <div className='collapse-content text-sm'>{children}</div>
  </div>
);
