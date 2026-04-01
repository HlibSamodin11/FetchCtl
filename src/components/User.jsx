import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function User({ user, from, onClose }) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
      .then(({ data }) => data && setUsername(data.username));
  }, [user]);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  useEffect(() => {
    const onDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function goTo(path) {
    setOpen(false);
    onClose?.();
    navigate(path);
  }

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
          <use href="/sprite.svg#icon-user" className="stroke-accent-text" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-bg border border-button-stroke rounded-xl shadow-lg z-50 text-accent-text">
          <div className="px-4 py-3 border-b border-button-stroke">
            {username ? (
              <p className="text-sm font-bold">@{username}</p>
            ) : (
              <p className="text-xs text-main-text truncate">{user?.email}</p>
            )}
          </div>

          <button
            onClick={() => username && goTo(`/u/${username}`)}
            disabled={!username}
            className="w-full text-left px-4 py-2 hover:bg-accent-bg text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Profile
          </button>
          <button
            onClick={() => goTo('/settings')}
            className="w-full text-left px-4 py-2 hover:bg-accent-bg text-sm"
          >
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