import { Outlet } from 'react-router-dom';

// project imports
import { Stack } from '@mui/material';
import AppBarBottom from './BottomBar';
import Customization from 'layout/Customization';
import AppHeader from './Header';

const AppLayout = () => (
  <>
    <Stack direction={'column'} justifyContent={'space-between'}>
      <AppHeader />
      <Outlet />
      <AppBarBottom />
    </Stack>
    <Customization />
  </>
);

export default AppLayout;
