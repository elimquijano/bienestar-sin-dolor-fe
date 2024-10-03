//import { lazy } from 'react';

import AppLayout from 'layout/AppLayout';
import HistoryScreen from 'views/app/history';
import HomeScreen from 'views/app/home';

// project imports
//import Loadable from 'ui-component/Loadable';

// login option 3 routing
//const HomeScreen = Loadable(lazy(() => import('views/app/home')));

const AppRoutes = {
  path: '/',
  element: <AppLayout />,
  children: [
    {
      path: '/',
      element: <HomeScreen />
    },
    {
      path: '/history',
      element: <HistoryScreen />
    }
  ]
};

export default AppRoutes;
