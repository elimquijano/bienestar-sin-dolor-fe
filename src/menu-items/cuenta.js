// assets
import { IconKey } from '@tabler/icons';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const cuenta = {
  id: 'cuenta',
  title: 'cuenta',
  caption: 'Paginas de cuenta',
  type: 'group',
  children: [
    {
      id: 'perfil',
      title: 'Mi perfil',
      type: 'item',
      url: '/perfil',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default cuenta;
