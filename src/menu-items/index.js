import seguridad from './seguridad';
import { getSession } from 'common/common';
import appuser from './appuser';

const menuItems = {
  items: []
};
const privilegios = JSON.parse(getSession('PRIVILEGIOS'));
if (privilegios) {
  const tieneSeguridad = privilegios.some((item) => item.code === 'PRIV_MOD_SEGURIDAD');

  menuItems.items.push(appuser);
  
  if (tieneSeguridad) {
    menuItems.items.push(seguridad);
  }
}

export default menuItems;
