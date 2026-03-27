import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ThemeSwitch from './ThemeSwitch';

function Header() {
  const navItems = [
    { label: 'Main', path: '/' },
    { label: 'Builder', path: '/builder' },
    { label: 'ASCII', path: '/ascii' },
    { label: 'Community', path: '/community' },
  ];

  const location = useLocation();

  const [active, setActive] = useState(0);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  const containerRef = useRef(null);
  const buttonsRef = useRef([]);

  useEffect(() => {
    const activeIndex = navItems.findIndex(
      (item) => item.path === location.pathname,
    );
    if (activeIndex !== -1) {
      setActive(activeIndex);
    }
  }, [location]);

  useEffect(() => {
    const activeButton = buttonsRef.current[active];
    if (activeButton) {
      const { offsetLeft, offsetWidth } = activeButton;
      setPillStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [active]);

  return (
    <>
      <header className="bg-bg flex justify-center py-5 transition-all">
        <div className="container flex items-center justify-between">
          <NavLink to={'/'} className="flex items-center gap-3">
            <div className={`rounded-full border`}>
              <svg className="w-8 h-8">
                <use href="/sprite.svg#icon-logo" />
              </svg>
            </div>

            <span className="font-bold italic text-xl tracking-tight text-accent-text">
              FetchCtl
            </span>
          </NavLink>
          <div className="hidden md:flex md:absolute rounded-full bg-accent-bg left-[50%] md:-translate-x-1/2 h-[46px] inset-shadow-[inset_0px_0px_10px_0px_rgba(0,_0,_0,_0.1)]">
            <div ref={containerRef} className="relative flex items-center p-2">
              <div
                className="absolute top-1 bottom-1 rounded-full bg-pill-bg shadow-2xl transition-all duration-300 ease-out"
                style={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                }}
              />

              {navItems.map((item, i) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={'flex items-center'}
                >
                  <span
                    className={`text-xs font-bold transition-colors px-6 relative z-10  rounded-full cursor-pointer inline-block ${
                      i === active ? 'text-accent-text' : 'text-main-text'
                    }`}
                    ref={(el) => (buttonsRef.current[i] = el)}
                  >
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex gap-5">
            <button className="text-get-started-text bg-get-started-bg px-5 rounded-4xl font-bold flex items-center gap-2">
              Get Started
              <svg className="w-5 h-5">
                <use href="/sprite.svg#icon-arrow"></use>
              </svg>
            </button>
            <button className="bg-button-bg rounded-2xl p-3 border border-button-stroke">
              <svg className=" w-5 h-5">
                <use
                  href="/sprite.svg#icon-search"
                  className="fill-accent-text"
                ></use>
              </svg>
            </button>
            <ThemeSwitch />
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
