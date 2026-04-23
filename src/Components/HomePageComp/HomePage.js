import React from 'react';
import Navbar from '../NavbarComp/Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import ApplicationStore from '../../Utility/localStorageUtil';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const { accessToken, userDetails } = ApplicationStore().getStorage('userDetails');

    setTimeout(() => {
      // if (accessToken) {

      //   navigate('/MasterDashboard');
      // }
    }, 2000);
  }, []);


  const location = useLocation();
  const currentPath = location.pathname;

  // If the current route is 'DispatchDashboard', hide Navbar
  const shouldHideNavbar = currentPath.includes('DispatchDashboard');


  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        // minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#e3e4e6'
      }}
    >
      <div style={{ width: '100%', }}>
     <Navbar />
      </div>
      <div
        style={{
          height: '100vh',
          width: '100%',
          overflow: 'auto',
          // marginTop: '43px', // Default marginTop
          '@media (max-width: 768px)': {
            // marginTop: '200px', // Adjust marginTop for screens less than or equal to 768px (sm and xs)
          },
          '@media (min-width: 769px) and (max-width: 992px)': {
            // marginTop: 'px', // Adjust marginTop for screens between 769px and 992px (md)
          },
          // Add more media queries as needed for other screen sizes
        }}
      >
        <Outlet />
      </div>
      <div style={{ width: '100%', }}>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
