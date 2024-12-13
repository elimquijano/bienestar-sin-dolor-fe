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
  title: 'Menú Principal',
  caption: 'Paginas de bienestar sin dolor',
  type: 'group',
  children: [
    {
      id: 'inicio',
      title: 'Inicio',
      type: 'item',
      url: '/',
      icon: icons.IconHome,
      breadcrumbs: false
    },
    {
      id: 'history',
      title: 'Historial',
      type: 'item',
      url: '/history',
      icon: icons.IconHistory,
      breadcrumbs: false
    },
    {
      id: 'map',
      title: 'Mapa',
      type: 'item',
      url: '/map-web',
      icon: icons.IconMap,
      breadcrumbs: false
    }
  ]
};

export default appuser;
