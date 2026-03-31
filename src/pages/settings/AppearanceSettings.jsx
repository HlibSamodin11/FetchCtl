import { useEffect, useState } from 'react';

function AppearanceSettings() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const btnBase = 'py-2 px-5 rounded-2xl transition-colors';

  const active = 'bg-button-bg text-accent-text border border-button-border';
  const inactive =
    'bg-transparent hover:bg-button-bg/70 border border-button-border/50';

  return (
    <div>
      <h2 className="text-accent-text font-bold text-xl">Appearance</h2>
      <p>Customize how the app looks.</p>

      <div className="pt-5">
        <div className="p-5 rounded-2xl bg-area border border-area-bg">
          <h3 className="pb-4">Theme</h3>

          <div className="flex gap-2">
            <button
              onClick={() => changeTheme('dark')}
              className={`${btnBase} ${theme === 'dark' ? active : inactive}`}
            >
              Dark
            </button>

            <button
              onClick={() => changeTheme('light')}
              className={`${btnBase} ${theme === 'light' ? active : inactive}`}
            >
              Light
            </button>

            <button
              onClick={() => changeTheme('system')}
              className={`${btnBase} ${theme === 'system' ? active : inactive}`}
            >
              System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppearanceSettings;
