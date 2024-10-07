import React from 'react';
import { History, Home, Message } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import menuItems from 'menu-items';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const AppBarBottom = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const navItems = menuItems.items;
  console.log(navItems);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      sx={{ display: { xs: 'flex', md: 'none' } }}
    >
      <BottomNavigationAction
        label="Inicio"
        icon={<Home />}
        component={Link}
        to="/"
        onClick={() => setValue(0)}
        sx={{
          color: value === 0 ? theme.palette.secondary.main : 'inherit',
          '&.Mui-selected': {
            color: theme.palette.secondary.main
          }
        }}
      />
      <BottomNavigationAction
        label="Historial"
        icon={<History />}
        component={Link}
        to="/history"
        onClick={() => setValue(1)}
        sx={{
          color: value === 1 ? theme.palette.secondary.main : 'inherit',
          '&.Mui-selected': {
            color: theme.palette.secondary.main
          }
        }}
      />
      <BottomNavigationAction
        label="Mensajes"
        icon={<Message />}
        component={Link}
        to="/messages"
        onClick={() => setValue(2)}
        sx={{
          color: value === 2 ? theme.palette.secondary.main : 'inherit',
          '&.Mui-selected': {
            color: theme.palette.secondary.main
          }
        }}
      />
    </BottomNavigation>
  );
};

export default AppBarBottom;
