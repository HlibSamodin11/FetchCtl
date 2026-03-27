import { useEffect, useState } from 'react';

function ThemeSwitch() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="bg-button-bg rounded-2xl p-3 border border-button-stroke transition"
    >
      <svg className="w-5 h-5">
        <use
          href={
            theme === 'dark' ? '/sprite.svg#icon-sun' : '/sprite.svg#icon-moon'
          }
          className="fill-accent-text"
        />
      </svg>
    </button>
  );
}

export default ThemeSwitch;
