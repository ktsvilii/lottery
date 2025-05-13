import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { UkraineIcon, USIcon } from '../../assets';

export const LanguageSwitcher: FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'uk' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <label className='swap'>
      <input type='checkbox' checked={currentLanguage === 'en'} onChange={toggleLanguage} />
      <div className={currentLanguage === 'en' ? 'swap-on' : 'swap-off'}>
        {currentLanguage === 'en' ? <USIcon /> : <UkraineIcon />}
      </div>
    </label>
  );
};
