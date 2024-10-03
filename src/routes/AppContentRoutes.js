//import { lazy } from 'react';

import MinimalLayout from 'layout/MinimalLayout';
import AccountScreen from 'views/app/account';
import LessonScreen from 'views/app/history/lessons';
import MapScreen from 'views/app/home/contacto';
import ChatScreen from 'views/app/home/consulta/chat';
import VoiceChatScreen from 'views/app/home/consulta/chatvoz';

// project imports
//import Loadable from 'ui-component/Loadable';

// login option 3 routing
//const HomeScreen = Loadable(lazy(() => import('views/app/home')));

const AppContentRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/chat',
      element: <ChatScreen />
    },
    {
      path: '/chat-voz',
      element: <VoiceChatScreen />
    },
    {
      path: '/config',
      element: <AccountScreen />
    },
    {
      path: '/map',
      element: <MapScreen />
    },
    {
      path: '/my-lesson/:id',
      element: <LessonScreen />
    }
  ]
};

export default AppContentRoutes;
