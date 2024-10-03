// assets
import { IconHistory, IconHome, IconMap, IconUserCircle } from '@tabler/icons';

// constant
const icons = {
  IconHome,
  IconHistory,
  IconMap,
  IconUserCircle
};

const appuser = {
  id: 'appuser',
  title: 'appuser',
  caption: 'Paginas de App',
  type: 'group',
  children: [
    {
      id: 'inicio',
      title: 'Inicio',
      type: 'item',
      url: '/app',
      icon: icons.IconHome,
      breadcrumbs: false
    },
    {
      id: 'history',
      title: 'Historial',
      type: 'item',
      url: '/app/history',
      icon: icons.IconHistory,
      breadcrumbs: false
    },
    {
      id: 'map',
      title: 'Mapa',
      type: 'item',
      url: '/app/mapa',
      icon: icons.IconMap,
      breadcrumbs: false
    },
    {
      id: 'account',
      title: 'Cuenta',
      type: 'item',
      url: '/app/account',
      icon: icons.IconUserCircle,
      breadcrumbs: false
    }
  ]
};

export default appuser;
