import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MainLayout({ user }) {
  return (
    <>
      <Header user={user} />
      <Outlet />
      <Footer />
    </>
  );
}

export default MainLayout;
