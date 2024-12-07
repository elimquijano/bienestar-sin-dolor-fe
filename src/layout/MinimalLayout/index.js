import { Outlet } from 'react-router-dom';

// Project imports
import Customization from '../Customization';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => (
  <>
    <Outlet />
    <Customization />
  </>
);

export default MinimalLayout;
