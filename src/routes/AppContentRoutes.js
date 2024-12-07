import { lazy } from 'react';

// project imports
import MinimalLayout from 'layout/MinimalLayout';
import Loadable from 'ui-component/Loadable';
import WebcamCapture from 'ui-component/camera';

const AccountScreen = Loadable(lazy(() => import('views/app/account')));
const LessonScreen = Loadable(lazy(() => import('views/app/history/lessons')));
const ChatScreen = Loadable(lazy(() => import('views/app/home/consulta/chat')));
const VoiceChatScreen = Loadable(lazy(() => import('views/app/home/consulta/chatvoz')));
const VoiceChatWebScreen = Loadable(lazy(() => import('views/app/home/consulta/chatvozweb')));
const TratamientoScreen = Loadable(lazy(() => import('views/app/home/descarte')));
const Model = Loadable(lazy(() => import('ui-component/animation')));
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
      path: '/tratamientos',
      element: <TratamientoScreen />
    },
    {
      path: '/camera',
      element: <WebcamCapture />
    },
    {
      path: '/animate',
      element: <Model />
    },
    {
      path: '/radiografia',
      element: <ImageClassifierPage />
    },
    {
      path: '/pose-detection',
      element: <PoseDetectionPage />
    },
    {
      path: '/my-lesson/:id',
      element: <LessonScreen />
    }
  ]
};

export default AppContentRoutes;
