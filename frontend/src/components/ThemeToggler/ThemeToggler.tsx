import { BlackThemeIcon, LightThemeIcon } from '../../assets';
import { useTheme } from '../../providers';

export const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'black' : 'light');
  };

  return (
    <label className='toggle text-base-content'>
      <input
        type='checkbox'
        value={theme}
        checked={theme !== 'light'}
        className='theme-controller'
        onChange={toggleTheme}
      />

      <LightThemeIcon />

      <BlackThemeIcon />
    </label>
  );
};
