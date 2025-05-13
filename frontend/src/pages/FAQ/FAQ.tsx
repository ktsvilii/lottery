import { FC } from 'react';

import { Trans, useTranslation } from 'react-i18next';

const FAQItem: FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
  <div className='collapse collapse-arrow bg-base-100 border border-base-300'>
    <input type='radio' name='lottery-faq' />
    <div className='collapse-title font-semibold'>
      <p>{question}</p>
    </div>
    <div className='collapse-content text-sm'>{children}</div>
  </div>
);

interface FAQSchema {
  answer: string;
  question: string;
}

export const FAQ: FC = () => {
  const { t } = useTranslation();
  const config = t('FAQ', { returnObjects: true }) as Record<string, Record<string, FAQSchema>>;

  return (
    <div className='max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4'>
      {Object.keys(config).map(column => {
        return (
          <div className='space-y-2' key={column}>
            {Object.keys(config[column]).map(item => {
              return (
                <FAQItem question={config[column][item].question} key={item}>
                  <Trans i18nKey={`FAQ.${column}.${item}.answer`} components={[<br />]} />
                </FAQItem>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
