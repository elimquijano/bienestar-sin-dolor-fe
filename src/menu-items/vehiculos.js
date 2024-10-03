// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const vehiculos = {
  id: 'vehiculos',
  title: 'vehiculos',
  caption: 'Paginas de vehiculos',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Mis Vehiculos',
      type: 'collapse',
      icon: icons.IconBrandChrome,

      children: [
        {
          id: 'mis-vehiculos',
          title: 'Ver en Mapa',
          type: 'item',
          url: '/vehiculos-mapa',
          target: false
        },
        {
          id: 'mi-recorrido',
          title: 'Repetición Ruta',
          type: 'item',
          url: '/repeticion-ruta',
          target: false
        }
      ]
    }
  ]
};

export default vehiculos;
