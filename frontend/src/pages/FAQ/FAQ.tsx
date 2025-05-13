import { FC } from 'react';

import { FAQItem } from '@components';

import { faqData } from './faq.config';

export const FAQ: FC = () => {
  return (
    <div className='max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4'>
      <div className='space-y-2'>
        {faqData.slice(0, 6).map(({ question, answer }) => (
          <FAQItem key={question} question={question}>
            {answer}
          </FAQItem>
        ))}
      </div>

      <div className='space-y-2'>
        {faqData.slice(6).map(({ question, answer }) => (
          <FAQItem key={question} question={question}>
            {answer}
          </FAQItem>
        ))}
      </div>
    </div>
  );
};
