import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

import Main from './pages/Main';
import Builder from './pages/Builder';
import Ascii from './pages/Ascii';
import Community from './pages/Community';

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Header user={user} />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/ascii" element={<Ascii />} />
        <Route path="/community" element={<Community />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
