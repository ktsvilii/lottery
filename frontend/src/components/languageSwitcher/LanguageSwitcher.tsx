import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const getItemClass = (lang: string) => (currentLanguage === lang ? 'swap-on' : 'swap-off');

  const changeLanguage = () => {
    const selectedLang = document.querySelector('div.swap-off')?.innerHTML.toLowerCase();
    i18n.changeLanguage(selectedLang);
  };

  return (
    <label className='swap'>
      <input type='checkbox' checked onChange={changeLanguage} />
      <div className={getItemClass('en')}>EN</div>
      <div className={getItemClass('uk')}>UK</div>
    </label>
  );
};
