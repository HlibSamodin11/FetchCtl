import { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function GetStarted({ onClose }) {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [success, setSuccess] = useState(false);

  // prevent spam clicking auth requests
  const cooldownRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  async function handleAuth(e) {
    e.preventDefault();
    if (loading || cooldownRef.current) return;

    if (!email.trim() || !password.trim()) {
      setAuthError('Email and password required');
      return;
    }

    setAuthError('');
    cooldownRef.current = true;
    setLoading(true);

    try {
      let data, error;

      if (authMode === 'login') {
        ({ data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password }));
      } else {
        ({ data, error } = await supabase.auth.signUp({ email: email.trim(), password }));
      }

      if (error) throw error;

      console.log(`${authMode} success:`, data.user);
      setSuccess(true);
      setTimeout(() => onClose(), 1800);
    } catch (err) {
      setAuthError(err.message);
      setLoading(false);
      setTimeout(() => {
        cooldownRef.current = false;
      }, authMode === 'login' ? 1500 : 3000);
    }
  }

  async function handleOAuth(provider) {
    setAuthError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) setAuthError(error.message);
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      onClick={!success ? onClose : undefined}
    >
      <div
        className="relative w-96 bg-accent-bg border border-button-stroke rounded-2xl px-9 py-10 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >

        {success ? (
          <div className="flex flex-col items-center justify-center gap-4 py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center animate-scale-in">
              <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-accent-text font-bold text-base">
              {authMode === 'login' ? 'Welcome back!' : 'Account created!'}
            </p>
            <p className="text-main-text text-xs">Taking you in...</p>
          </div>
        ) : (
          <>
            {/* top tag */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-accent-bg border border-button-stroke border-t-0 rounded-b-xl px-4 py-1 flex items-center gap-2">
              <div className="rounded-full bg-accent-text p-0.5">
                <svg className="w-3.5 h-3.5">
                  <use href="/sprite.svg#icon-logo" />
                </svg>
              </div>
              <span className="text-xs font-bold italic text-accent-text">FetchCtl</span>
            </div>

            {/* tabs */}
            <div className="flex gap-1 bg-accent-bg border border-button-stroke rounded-xl p-1 mb-7">
              {['login', 'register'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setAuthMode(tab); setAuthError(''); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authMode === tab
                      ? 'bg-get-started-bg text-get-started-text shadow-sm ring-1 ring-black/20'
                      : 'text-main-text hover:text-accent-text'
                  }`}
                >
                  {tab === 'login' ? 'Log in' : 'Register'}
                </button>
              ))}
            </div>

            {/* oauth */}
            <div className="flex flex-col gap-2 mb-4">
              <button
                onClick={() => handleOAuth('google')}
                className="w-full py-2.5 flex items-center justify-center gap-3 bg-button-bg border border-button-stroke rounded-xl text-sm font-bold text-accent-text hover:border-accent-text transition-all cursor-pointer"
              >
                <svg className="w-4 h-4">
                  <use href="/sprite.svg#icon-google" />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleOAuth('github')}
                className="w-full py-2.5 flex items-center justify-center gap-3 bg-button-bg border border-button-stroke rounded-xl text-sm font-bold text-accent-text hover:border-accent-text transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-accent-text">
                  <use href="/sprite.svg#icon-github" />
                </svg>
                Continue with GitHub
              </button>
            </div>

            {/* divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-button-stroke" />
              <span className="text-xs text-main-text">or</span>
              <div className="flex-1 h-px bg-button-stroke" />
            </div>

            {/* form */}
            <form onSubmit={handleAuth} className="flex flex-col gap-3">
              <input
                className="bg-button-bg border border-button-stroke rounded-xl px-4 py-3 text-sm text-accent-text placeholder:text-main-text outline-none focus:border-accent-text transition-all disabled:opacity-50"
                type="email"
                placeholder="Email"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className="w-full bg-button-bg border border-button-stroke rounded-xl px-4 py-3 text-sm text-accent-text placeholder:text-main-text outline-none focus:border-accent-text transition-all disabled:opacity-50"
                type="password"
                placeholder="Password"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
              />

              {authMode === 'login' && (
                <p className="text-right text-xs text-main-text hover:text-accent-text transition cursor-pointer -mt-1">
                  Forgot password?
                </p>
              )}

              {authError && (
                <p className="text-xs text-red-500">{authError}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full py-3 bg-get-started-bg text-get-started-text ring-1 ring-black/20 rounded-xl text-sm font-bold transition-all hover:opacity-80 disabled:opacity-50 cursor-pointer"
              >
                {loading
                  ? authMode === 'login' ? 'Signing you in...' : 'Creating account...'
                  : authMode === 'login' ? 'Log in' : 'Register'}
              </button>
            </form>

            {/* switch mode */}
            <p className="mt-5 text-center text-xs text-main-text">
              {authMode === 'login' ? (
                <>Don't have an account?{' '}
                  <button onClick={() => { setAuthMode('register'); setAuthError(''); }} className="text-accent-text underline cursor-pointer">
                    Register
                  </button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-accent-text underline cursor-pointer">
                    Log in
                  </button>
                </>
              )}
            </p>
          </>
        )}

      </div>
    </div>
  );
}