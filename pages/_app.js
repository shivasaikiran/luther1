// import { useEffect } from 'react';
// import Router from 'next/router';
import '../styles/globals.css';

import Layout from '@/Components/Layout';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import MyState from '@/Context/myState';

import { Provider } from 'react-redux';
import { store } from './../redux/store';



function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // useEffect(() => {
  //   const handleRouteChange = (url) => {
  //     console.log(`App is changing to: ${url}`);
  //   };

  //   Router.events.on('routeChangeStart', handleRouteChange);

  //   if ('scrollRestoration' in history) {
  //     history.scrollRestoration = 'manual';
      
  //     const restoreScroll = () => {
  //       window.scrollTo(0, 0);
  //     };

  //     Router.events.on('routeChangeComplete', restoreScroll);

  //     return () => {
  //       Router.events.off('routeChangeStart', handleRouteChange);
  //       Router.events.off('routeChangeComplete', restoreScroll);
  //     };
  //   }
  // }, []);

  return (
    <MyState>
      
    <Provider store={store}>
    <Layout>
        <ToastContainer />
        
        <Component {...pageProps} />
          
        </Layout>
      
    </Provider>
       
       
      
    </MyState>
    
  );
}

export default MyApp;
