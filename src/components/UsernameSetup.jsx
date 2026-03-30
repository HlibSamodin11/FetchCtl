import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function UsernameSetup({ user, onDone }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const u = username.trim().toLowerCase();
    if (!u) return;
    if (!/^[a-z0-9_]{3,20}$/.test(u)) {
      setError('3–20 chars, letters/numbers/underscores only');
      return;
    }

    setLoading(true);
    setError('');

    const { error: err } = await supabase
      .from('profiles')
      .insert({ id: user.id, username: u });

    if (err) {
      setError(err.code === '23505' ? 'username taken' : err.message);
      setLoading(false);
    } else {
      onDone(u);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="relative w-96 bg-accent-bg border border-button-stroke rounded-2xl px-9 py-10">
        {/* top tag */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-accent-bg border border-button-stroke border-t-0 rounded-b-xl px-4 py-1 flex items-center gap-2">
          <div className="rounded-full bg-accent-text p-0.5">
            <svg className="w-3.5 h-3.5">
              <use href="/sprite.svg#icon-logo" />
            </svg>
          </div>
          <span className="text-xs font-bold italic text-accent-text">FetchCtl</span>
        </div>

        <h2 className="text-accent-text font-bold text-base mb-1">Pick a username</h2>
        <p className="text-main-text text-xs mb-6">this is how others will see you</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-main-text select-none">@</span>
            <input
              autoFocus
              className="w-full bg-button-bg border border-button-stroke rounded-xl pl-8 pr-4 py-3 text-sm text-accent-text placeholder:text-main-text outline-none focus:border-accent-text transition-all disabled:opacity-50"
              placeholder="cooluser_42"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              disabled={loading}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="mt-1 w-full py-3 bg-get-started-bg text-get-started-text ring-1 ring-black/20 rounded-xl text-sm font-bold transition-all hover:opacity-80 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Saving...' : 'Set username'}
          </button>
        </form>
      </div>
    </div>
  );
}