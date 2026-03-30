import { useEffect, useState } from 'react';

function ThemeSwitch({ from }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  return (
    <button
      onClick={toggleTheme}
      className={`hidden ${from === 'header' ? 'lg:inline-block' : 'inline-block'} bg-button-bg rounded-2xl p-3 ring transition-all ring-button-stroke group hover:ring-accent-text cursor-pointer`}
    >
      <svg className="w-5 h-5">
        <use
          href={theme === 'dark' ? '/sprite.svg#icon-sun' : '/sprite.svg#icon-moon'}
          className="fill-accent-text"
        />
      </svg>
    </button>
  );
}

export default ThemeSwitch;