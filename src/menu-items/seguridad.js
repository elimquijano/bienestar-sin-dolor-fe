// assets
import { IconKey } from '@tabler/icons';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const seguridad = {
  id: 'seguridad',
  title: 'Seguridad',
  caption: 'Paginas de seguridad',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Seguridad',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'rol',
          title: 'Roles',
          type: 'item',
          url: '/rol',
          target: false
        },
        {
          id: 'privilegio',
          title: 'Privilegios',
          type: 'item',
          url: '/privilegio',
          target: false
        },
        {
          id: 'modulo',
          title: 'Modulos',
          type: 'item',
          url: '/modulo',
          target: false
        },
        {
          id: 'usuario',
          title: 'Gestión de usuarios',
          type: 'item',
          url: '/usuario',
          target: false
        },
        {
          id: 'contacto',
          title: 'Gestión de Contactos',
          type: 'item',
          url: '/contacto',
          target: false
        },
        {
          id: 'local',
          title: 'Gestión de locales',
          type: 'item',
          url: '/local',
          target: false
        }
        
      ]
    }
  ]
};

export default seguridad;
