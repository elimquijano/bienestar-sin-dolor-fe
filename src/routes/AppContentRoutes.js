import { lazy } from 'react';

// project imports
import MinimalLayout from 'layout/MinimalLayout';
import Loadable from 'ui-component/Loadable';

const AccountScreen = Loadable(lazy(() => import('views/app/account')));
const ChatScreen = Loadable(lazy(() => import('views/app/home/consulta/chat')));
const VoiceChatScreen = Loadable(lazy(() => import('views/app/home/consulta/chatvoz')));
const VoiceChatWebScreen = Loadable(lazy(() => import('views/app/home/consulta/chatvozweb')));
const EnfermedadesScreen = Loadable(lazy(() => import('views/app/home/descarte')));
const TratamientosScreen = Loadable(lazy(() => import('views/app/history/tratamiento')));
const LeccionScreen = Loadable(lazy(() => import('views/app/history/tratamiento/leccion')));
const ImageClassifierPage = Loadable(lazy(() => import('views/app/home/radiografia')));
const PoseDetectionPage = Loadable(lazy(() => import('views/app/history/poseDetection')));

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
      path: '/chat-voz-web/:id',
      element: <VoiceChatWebScreen />
    },
    {
      path: '/config',
      element: <AccountScreen />
    },
    {
      path: '/enfermedades',
      element: <EnfermedadesScreen />
    },
    {
      path: '/tratamientos/:id',
      element: <TratamientosScreen />
    },
    {
      path: '/leccion/:id',
      element: <LeccionScreen />
    },
    {
      path: '/radiografia',
      element: <ImageClassifierPage />
    },
    {
      path: '/pose-detection',
      element: <PoseDetectionPage />
    },
  ]
};

export default AppContentRoutes;
