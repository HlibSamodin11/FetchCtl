import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function GetStarted({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const signUpResult = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpResult.data?.session) {
      setLoading(false);
      onClose();
      return;
    }

    if (
      signUpResult.error &&
      signUpResult.error.message.toLowerCase().includes('already registered')
    ) {
      const signInResult = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInResult.error) {
        setError(signInResult.error.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      onClose();
      return;
    }

    if (signUpResult.error) {
      setError(signUpResult.error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onClose();
  };

  return (
    <div className="absolute top-20 left-20 bg-white p-4 rounded-xl shadow z-20 w-80">
      <form onSubmit={handleAuth} className="flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 rounded"
        >
          {loading ? 'Loading...' : 'Continue'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button onClick={onClose} className="text-sm mt-3 underline">
        Cancel
      </button>
    </div>
  );
}
