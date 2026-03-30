import '@fontsource/jetbrains-mono/400';
import '@fontsource/jetbrains-mono/500';
import '@fontsource/jetbrains-mono/600';
import '@fontsource/jetbrains-mono/700';
import '@fontsource/jetbrains-mono/800';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Main from './pages/Main';
import Builder from './pages/Builder';
import Ascii from './pages/Ascii';
import Community from './pages/Community';
import Header from './components/Header';
import Footer from './components/Footer';
import GetStarted from './components/GetStarted';
import UsernameSetup from './components/UsernameSetup';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [needsUsername, setNeedsUsername] = useState(false);

  async function checkProfile(u) {
    if (!u) return;
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', u.id)
      .single();
    if (!data?.username) setNeedsUsername(true);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      checkProfile(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user || null;
      setUser(u);
      if (event === 'SIGNED_IN') checkProfile(u);
      if (event === 'SIGNED_OUT') setNeedsUsername(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <>
      <Header user={user} />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/ascii" element={<Ascii user={user} onOpenLogin={() => setShowLogin(true)} />} />
        <Route path="/community" element={<Community />} />
      </Routes>
      <Footer />
      {showLogin && <GetStarted onClose={() => setShowLogin(false)} />}
      {needsUsername && user && (
        <UsernameSetup user={user} onDone={() => setNeedsUsername(false)} />
      )}
    </>
  );
}

export default App;