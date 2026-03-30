import { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

function User({ user, from }) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
      .then(({ data }) => data && setUsername(data.username));
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`hidden ${from === 'header' ? 'lg:inline-block' : 'inline-block'} relative`}
      ref={dropdownRef}
    >
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
            {username
              ? <p className="text-sm font-bold">@{username}</p>
              : <p className="text-xs text-main-text truncate">{user?.email}</p>
            }
          </div>

          <button className="w-full text-left px-4 py-2 hover:bg-accent-bg text-sm">
            Profile
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-accent-bg text-sm">
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-500 text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default User;