// assets
import { IconKey } from '@tabler/icons';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const traccar = {
  id: 'traccar',
  title: 'Traccar',
  caption: 'Paginas de traccar',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Traccar',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'tdispositivos',
          title: 'Dispositivos',  
          type: 'item',
          url: '/tdispositivos',
          target: false 
        },
        {
          id: 'iconos',
          title: 'Iconos Personalizados',  
          type: 'item',
          url: '/iconos ',
          target: false 
        },
        {
          id: 'photos',
          title: 'Imagen Personalizados',  
          type: 'item',
          url: '/photos',
          target: false 
        },
        {
          id: 'detalle',
          title: 'Detalle Vehiculo',  
          type: 'item',
          url: '/detalle',
          target: false 
        },
      ]
    }
  ]
};

export default traccar;
