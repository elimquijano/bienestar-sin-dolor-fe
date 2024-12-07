import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// login option 3 routing
const HomeScreen = Loadable(lazy(() => import('views/app/home')));
const MapNativeScreen = Loadable(lazy(() => import('views/app/mapa/mapnative')));
const MapWebScreen = Loadable(lazy(() => import('views/app/mapa/mapweb')));
const HistoryScreen = Loadable(lazy(() => import('views/app/history')));

const AppRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <HomeScreen />
    },
    {
      path: '/map',
      element: <MapNativeScreen />
    },
    {
      path: '/map-web',
      element: <MapWebScreen />
    },
    {
      path: '/history',
      element: <HistoryScreen />
    }
  ]
};

export default AppRoutes;
