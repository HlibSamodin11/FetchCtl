import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
export default function GetStarted({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  useEffect((e) => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    });
  });
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!signInError) {
      setLoading(false);
      onClose();
      return;
    }
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    if (data?.user && !data?.session) {
      setMessage('Check your email to confirm your account.');
      setLoading(false);
      return;
    }
    setLoading(false);
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      onClick={() => {
        onClose();
      }}
    >
      {' '}
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-80"
        onClick={(e) => e.stopPropagation()}
      >
        {' '}
        <form onSubmit={handleAuth} className="flex flex-col gap-3">
          {' '}
          <input
            className="border p-2 rounded"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />{' '}
          <input
            className="border p-2 rounded"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />{' '}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white p-2 rounded"
          >
            {' '}
            {loading ? 'Loading...' : 'Continue'}{' '}
          </button>{' '}
        </form>{' '}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}{' '}
        {message && <p className="text-green-600 text-sm mt-2">{message}</p>}{' '}
        <button onClick={onClose} className="text-sm mt-3 underline">
          {' '}
          Cancel{' '}
        </button>{' '}
      </div>{' '}
    </div>
  );
}
