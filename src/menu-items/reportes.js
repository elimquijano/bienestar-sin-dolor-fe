// assets
import { IconKey } from '@tabler/icons';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const reportes = {
  id: 'Reportes',
  title: 'Reportes',
  caption: 'Paginas de seguridad',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Reportes',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'reportePosition',
          title: 'Reporte Positions',
          type: 'item',
          url: '/reportes/positions',
          target: false
        }
        
      ]
    }
  ]
};

export default reportes;
