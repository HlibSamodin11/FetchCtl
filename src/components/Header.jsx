import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ThemeSwitch from './ThemeSwitch';
import GetStarted from './GetStarted';
import User from './User';
import SideMenu from './SideMenu';

const navItems = [
  { label: 'Main',      path: '/' },
  { label: 'Builder',   path: '/builder' },
  { label: 'ASCII',     path: '/ascii' },
  { label: 'Community', path: '/community' },
];

function Header({ user }) {
  const [showForm,   setShowForm]   = useState(false);
  const [active,     setActive]     = useState(0);
  const [pillStyle,  setPillStyle]  = useState({ left: 0, width: 0 });
  const [menuShown,  setMenuShown]  = useState(false);

  const location     = useLocation();
  const containerRef = useRef(null);
  const buttonsRef   = useRef([]);

  // sync active index with current route
  useEffect(() => {
    const i = navItems.findIndex(item => item.path === location.pathname);
    if (i !== -1) setActive(i);
  }, [location]);

  // move the sliding pill under the active tab
  useEffect(() => {
    const btn = buttonsRef.current[active];
    if (btn) setPillStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [active]);

  return (
    <>
      <header className="bg-bg flex justify-center py-5 px-6 md:px-12 transition-all">
        <div className="container flex items-center justify-between">

          <NavLink to="/" className="flex items-center gap-3">
            <div className="rounded-full border">
              <svg className="w-8 h-8"><use href="/sprite.svg#icon-logo" /></svg>
            </div>
            <span className="font-bold italic text-xl tracking-tight text-accent-text">FetchCtl</span>
          </NavLink>

          {/* pill nav — desktop only */}
          <div className="hidden lg:flex lg:absolute rounded-full bg-accent-bg left-[50%] md:-translate-x-1/2 h-[46px] inset-shadow-[inset_0px_0px_10px_0px_rgba(0,0,0,0.1)]">
            <div ref={containerRef} className="relative flex items-center py-2 px-1">
              <div
                className="absolute top-1 bottom-1 rounded-full bg-pill-bg shadow-2xl transition-all duration-300 ease-out"
                style={{ left: pillStyle.left, width: pillStyle.width }}
              />
              {navItems.map((item, i) => (
                <NavLink key={item.path} to={item.path} className="flex items-center">
                  <span
                    ref={el => (buttonsRef.current[i] = el)}
                    className={`text-xs font-bold transition-colors px-6 relative z-10 rounded-full cursor-pointer inline-block ${
                      i === active ? 'text-accent-text' : 'text-main-text'
                    }`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex gap-5">
            {!user ? (
              <button
                onClick={() => setShowForm(true)}
                className="hidden lg:flex group text-get-started-text bg-get-started-bg px-5 rounded-4xl font-bold items-center gap-2 transition-all hover:bg-transparent hover:ring-1 hover:ring-accent-text hover:text-accent-text hover:cursor-pointer"
              >
                Get Started
                <svg className="w-5 h-5">
                  <use href="/sprite.svg#icon-arrow" className="group-hover:fill-accent-text" />
                </svg>
              </button>
            ) : (
              <User user={user} from="header" />
            )}

            <button className="bg-button-bg rounded-2xl p-3 ring transition-all ring-button-stroke group hover:ring-accent-text cursor-pointer">
              <svg className="w-5 h-5">
                <use href="/sprite.svg#icon-search" className="fill-accent-text" />
              </svg>
            </button>

            <ThemeSwitch from="header" />

            <button
              onClick={() => setMenuShown(true)}
              className="bg-button-bg lg:hidden rounded-2xl p-3 ring transition-all ring-button-stroke group hover:ring-accent-text cursor-pointer"
            >
              <svg className="w-5 h-5">
                <use href="/sprite.svg#icon-menu" className="fill-accent-text" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {showForm && <GetStarted onClose={() => setShowForm(false)} />}
      <SideMenu shown={menuShown} setShown={setMenuShown} user={user} />
    </>
  );
}

export default Header;