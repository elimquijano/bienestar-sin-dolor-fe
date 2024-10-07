//import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import HistoryScreen from 'views/app/history';
import HomeScreen from 'views/app/home';
import MessageScreen from 'views/app/messages';

// project imports
//import Loadable from 'ui-component/Loadable';

// login option 3 routing
//const HomeScreen = Loadable(lazy(() => import('views/app/home')));

const AppRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <HomeScreen />
    },
    {
      path: '/history',
      element: <HistoryScreen />
    },
    {
      path: '/messages',
      element: <MessageScreen />
    }
  ]
};

export default AppRoutes;
