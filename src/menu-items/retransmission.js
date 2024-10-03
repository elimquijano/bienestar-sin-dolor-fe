// assets
import { IconKey } from '@tabler/icons';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const retransmission = {
  id: 'retransmission',
  title: 'Retransmisiónes',
  caption: 'Paginas de devices y host',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Retransmisión',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'gcompanies',
          title: 'Compañias',
          type: 'item',
          url: '/gcompanies',
          target: false
        },
        {
          id: 'gdivitions',
          title: 'Divisiones',
          type: 'item',
          url: '/gdivitions',
          target: false
        },
        {
          id: 'ghostretransmission',
          title: 'Hosts',
          type: 'item',
          url: '/ghostretransmission',
          target: false
        },
        {
          id: 'gretransmission',
          title: 'Pines Devices',
          type: 'item',
          url: '/gretransmission',
          target: false
        },
        {
          id: 'gretransmissionlogs',
          title: 'Logs',
          type: 'item',
          url: '/gretransmissionlogs'
        },
        {
          id: 'gmapas',
          title: 'Mapas',
          type: 'item',
          url: '/mapas',
          target: false
        },
        {
          id: 'grepeticion-ruta-retransmission',
          title: 'Historial de Recorrido de Retransmisión',
          type: 'item',
          url: '/grepeticion-ruta-retransmission',
          target: false
        }
      ]
    }
  ]
};

export default retransmission;
