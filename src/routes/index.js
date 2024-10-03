import { useRoutes } from 'react-router-dom';
import AuthenticationRoutes from './AuthenticationRoutes';
import AppRoutes from './AppRoutes';
import AppContentRoutes from './AppContentRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([AppRoutes, AppContentRoutes, AuthenticationRoutes]);
}
