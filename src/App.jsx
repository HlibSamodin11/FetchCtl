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

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
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
    </>
  );
}

export default App;