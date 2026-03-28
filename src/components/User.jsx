import { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

function User({ user }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-button-bg rounded-2xl p-3 ring transition-all ring-button-stroke hover:ring-accent-text"
      >
        <svg className="w-5 h-5">
          <use href="/sprite.svg#icon-user" className="fill-accent-text" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-bg border border-button-stroke rounded-xl shadow-lg z-50 text-accent-text">
          <div className="px-4 py-3 border-b border-button-stroke">
            <p className="text-sm font-semibold truncate">{user?.email}</p>
          </div>

          <button className="w-full text-left px-4 py-2 hover:bg-accent-bg">
            Profile
          </button>

          <button className="w-full text-left px-4 py-2 hover:bg-accent-bg">
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default User;
