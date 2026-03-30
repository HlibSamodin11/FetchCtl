import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ResetPassword() {
  const [ready,    setReady]    = useState(false); // true once supabase confirms the recovery session
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [done,     setDone]     = useState(false);
  const navigate = useNavigate();

  // supabase fires PASSWORD_RECOVERY when the user lands here via the reset link
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) { setError(err.message); return; }

    setDone(true);
    setTimeout(() => navigate('/'), 2000);
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="relative w-full max-w-sm bg-accent-bg border border-button-stroke rounded-2xl px-9 py-10">

        {/* top tag */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-accent-bg border border-button-stroke border-t-0 rounded-b-xl px-4 py-1 flex items-center gap-2">
          <div className="rounded-full bg-accent-text p-0.5">
            <svg className="w-3.5 h-3.5"><use href="/sprite.svg#icon-logo" /></svg>
          </div>
          <span className="text-xs font-bold italic text-accent-text">FetchCtl</span>
        </div>

        {/*success */}
        {done && (
          <div className="flex flex-col items-center gap-4 py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-accent-text font-bold text-base">Password updated!</p>
            <p className="text-main-text text-xs">Redirecting you home...</p>
          </div>
        )}

        {/* waiting for recovery event*/}
        {!done && !ready && (
          <div className="flex flex-col items-center gap-3 py-6">
            <p className="text-main-text/40 text-sm font-jetbrains animate-pulse">Verifying link...</p>
            <p className="text-main-text/20 text-xs text-center">
              If nothing happens, your reset link may have expired.{' '}
              <button onClick={() => navigate('/')} className="underline hover:text-accent-text transition">
                Go home
              </button>
            </p>
          </div>
        )}

        {/* new password form */}
        {!done && ready && (
          <>
            <p className="text-accent-text font-bold text-sm mb-1">Set a new password</p>
            <p className="text-main-text text-xs mb-6">Pick something you'll remember.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="New password"
                value={password}
                disabled={loading}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-button-bg border border-button-stroke rounded-xl px-4 py-3 text-sm text-accent-text placeholder:text-main-text outline-none focus:border-accent-text transition-all disabled:opacity-50"
                autoFocus
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                disabled={loading}
                onChange={e => { setConfirm(e.target.value); setError(''); }}
                className="w-full bg-button-bg border border-button-stroke rounded-xl px-4 py-3 text-sm text-accent-text placeholder:text-main-text outline-none focus:border-accent-text transition-all disabled:opacity-50"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full py-3 bg-get-started-bg text-get-started-text ring-1 ring-black/20 rounded-xl text-sm font-bold transition-all hover:opacity-80 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Saving...' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}