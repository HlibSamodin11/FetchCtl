import { Routes, Route, Navigate } from 'react-router-dom';
import Main from './pages/Main';
import Builder from './pages/Builder';
import Ascii from './pages/Ascii';
import Community from './pages/Community';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
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
