//import { lazy } from 'react';

import MinimalLayout from 'layout/MinimalLayout';
import AccountScreen from 'views/app/account';
import LessonScreen from 'views/app/history/lessons';
import ChatScreen from 'views/app/home/consulta/chat';
import VoiceChatScreen from 'views/app/home/consulta/chatvoz';
import VoiceChatWebScreen from 'views/app/home/consulta/chatvozweb';
import EspecialistasListScreen from 'views/app/home/contacto';
import MapNativeScreen from 'views/app/home/contacto/mapa/mapnative';
import MapWebScreen from 'views/app/home/contacto/mapa/mapweb';
import TratamientoScreen from 'views/app/home/descarte';

// project imports
//import Loadable from 'ui-component/Loadable';

// login option 3 routing
//const HomeScreen = Loadable(lazy(() => import('views/app/home')));

const AppContentRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/chat/:id',
      element: <ChatScreen />
    },
    {
      path: '/chat-voz/:id',
      element: <VoiceChatScreen />
    },
    {
      path: '/chat-voz-web',
      element: <VoiceChatWebScreen />
    },
    {
      path: '/config',
      element: <AccountScreen />
    },
    {
      path: '/especialistas',
      element: <EspecialistasListScreen />
    },
    {
      path: '/map/:id',
      element: <MapNativeScreen />
    },
    {
      path: '/map-web/:id',
      element: <MapWebScreen />
    },
    {
      path: '/tratamientos',
      element: <TratamientoScreen />
    },
    {
      path: '/my-lesson/:id',
      element: <LessonScreen />
    }
  ]
};

export default AppContentRoutes;
