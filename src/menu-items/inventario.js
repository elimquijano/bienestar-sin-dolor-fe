// assets
import { IconKey } from '@tabler/icons';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const inventario = {
  id: 'inventario',
  title: 'Inventario',
  caption: 'Paginas de Inventario',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'productos',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'producto',
          title: 'Gestion de productos',
          type: 'item',
          url: '/producto',
          target: false
        },
        {
          id: 'categoria',
          title: 'Categoria',
          type: 'item',
          url: '/categoria',
          target: false
        }
      ]
    },
    {
      id: 'authentication',
      title: 'Compras',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'compra',
          title: 'Ordenes de compra',
          type: 'item',
          url: '/compra',
          target: false
        },
        {
          id: 'proovedor',
          title: 'Proveedores',
          type: 'item',
          url: '/proveedor',
          target: false
        }
      ]
    },
    {
      id: 'authentication',
      title: 'ventas',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'venta',
          title: 'venta',
          type: 'item',
          url: '/venta',
          target: false
        },
        {
          id: 'cliente',
          title: 'Cliente',
          type: 'item',
          url: '/cliente',
          target: false
        }
      ]
    },
    {
      id: 'authentication',
      title: 'reportes',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'reporte_existencia',
          title: 'Reporte de existencias',
          type: 'item',
          url: '/reporte/inventario',
          target: false
        },
        {
          id: 'transaccion',
          title: 'Transacciones',
          type: 'item',
          url: '/transacciones',
          target: false
        }
      ]
    }
  ]
};

export default inventario;
