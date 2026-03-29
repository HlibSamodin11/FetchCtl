import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import User from './User';
import GetStarted from './GetStarted';
import ThemeSwitch from './ThemeSwitch';

function SideMenu({ shown, setShown, user }) {
  const navItems = [
    { label: 'Main', path: '/' },
    { label: 'Builder', path: '/builder' },
    { label: 'ASCII', path: '/ascii' },
    { label: 'Community', path: '/community' },
  ];
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    if (shown) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [shown]);

  useEffect((e) => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setShown(false);
      }
    });
  });
  return (
    <div
      className={`flex justify-end fixed z-20 inset-0 bg-bg/50 backdrop-blur-sm transition-opacity duration-300 ${
        shown
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setShown(false)}
    >
      {showForm && <GetStarted onClose={() => setShowForm(false)} />}
      <div
        className={`bg-bg w-screen text-accent-text  sm:w-120 h-full flex flex-col p-7.5 transform transition-transform duration-300  ${
          shown ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="flex flex-col justify-between h-full font-grotesk">
          <div className="flex flex-wrap justify-between items-center border-b border-reverse/50 pb-4 gap-5">
            <NavLink
              to={'/'}
              className="flex items-center gap-3"
              onClick={() => setShown(false)}
            >
              <div className={`rounded-full border border-reverse`}>
                <svg className="w-8 h-8">
                  <use href="/sprite.svg#icon-logo" />
                </svg>
              </div>
            </NavLink>
            <div className="flex gap-5">
              {!user ? (
                <button
                  className="flex group py-2 text-get-started-text bg-get-started-bg px-5 rounded-4xl font-bold  items-center gap-2 transition-all hover:bg-transparent hover:ring-1 hover:ring-accent-text hover:text-accent-text hover:cursor-pointer"
                  onClick={() => {
                    setShowForm(true);
                  }}
                >
                  Get Started
                  <svg className="w-5 h-5">
                    <use
                      href="/sprite.svg#icon-arrow"
                      className="group-hover:fill-accent-text"
                    ></use>
                  </svg>
                </button>
              ) : (
                <User user={user} />
              )}
              <ThemeSwitch />
            </div>
          </div>
          <div>
            <ul className="flex flex-col text-main-text gap-10">
              {navItems.map((item, i) => (
                <li onClick={() => setShown(false)}>
                  <NavLink
                    to={item.path}
                    key={`menu-${item.path}`}
                    className="cursor-pointer text-4xl  uppercase font-grotesk font-black hover:text-accent-text transition-colors"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-reverse/50 pt-4 flex items-center justify-between">
            {' '}
            <a
              href="https://github.com/HlibSamodin11/FetchCtl"
              target="_blank"
              rel="noreferrer"
              className="inline-block 
              hover:opacity-70 transition"
            >
              <svg
                className="w-6 h-6 text-accent-text"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="/sprite.svg#icon-github"></use>
              </svg>
            </a>
            <p className="text-xs text-accent-text">
              © 2026 FetchCtl. All rights reserved.
            </p>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default SideMenu;
