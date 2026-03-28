import { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

export default function GetStarted({ onClose }) {
  const [mode, setMode] = useState('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const cooldownRef = useRef(false);

  async function registerUser(e) {
    e.preventDefault();

    if (loading || cooldownRef.current) return;

    cooldownRef.current = true;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      console.log('User registered:', data.user);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);

      setTimeout(() => {
        cooldownRef.current = false;
      }, 3000);
    }
  }

  async function loginUser(e) {
    e.preventDefault();

    if (loading || cooldownRef.current) return;

    cooldownRef.current = true;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('User logged in:', data.user);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);

      setTimeout(() => {
        cooldownRef.current = false;
      }, 1500);
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">
          {mode === 'register' ? 'Register' : 'Log in'}
        </h2>

        {mode === 'register' ? (
          <form onSubmit={registerUser} className="flex flex-col gap-3">
            <input
              className="border p-2 rounded"
              type="email"
              placeholder="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="border p-2 rounded"
              type="password"
              placeholder="password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="bg-black text-white p-2 rounded disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
          </form>
        ) : (
          <form onSubmit={loginUser} className="flex flex-col gap-3">
            <input
              className="border p-2 rounded"
              type="email"
              placeholder="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="border p-2 rounded"
              type="password"
              placeholder="password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="bg-black text-white p-2 rounded disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Log in'}
            </button>
          </form>
        )}

        <div className="mt-4 flex flex-col gap-2 text-sm">
          {mode === 'register' ? (
            <button className="underline" onClick={() => setMode('login')}>
              Already have an account? Log in
            </button>
          ) : (
            <button className="underline" onClick={() => setMode('register')}>
              Need an account? Register
            </button>
          )}

          <button className="underline" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
