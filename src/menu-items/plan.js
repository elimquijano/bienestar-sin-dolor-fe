// assets
import { IconKey } from '@tabler/icons';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const plan = {
  id: 'Plan',
  title: 'Plan',
  caption: 'Paginas de plan',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Plan',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'plan',
          title: 'Plan Usuario',
          type: 'item',
          url: '/plan',
          target: false
        }
        
      ]
    }
  ]
};

export default plan;
