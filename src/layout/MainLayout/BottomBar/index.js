import React from 'react';
import { History, Home, Map } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import menuItems from 'menu-items';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Capacitor } from '@capacitor/core';

const AppBarBottom = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const navItems = menuItems.items;
  console.log(navItems);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const buttons = [
    { label: 'Inicio', icon: <Home />, component: Link, to: '/', onClick: () => setValue(0) },
    { label: 'Tratamientos', icon: <History />, component: Link, to: '/history', onClick: () => setValue(1) },
    { label: 'Mapa', icon: <Map />, component: Link, to: `${Capacitor.isNativePlatform() ? 'map' : 'map-web'}`, onClick: () => setValue(2) }
  ];
  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      sx={{ display: { xs: 'flex', md: 'none' } }}
    >
      {buttons.map((b, index) => {
        return (
          <BottomNavigationAction
            key={index}
            label={b.label}
            icon={b.icon}
            component={b.component}
            to={b.to}
            onClick={b.onClick}
            sx={{
              color: value === index ? theme.palette.secondary.main : 'inherit',
              '&.Mui-selected': {
                color: theme.palette.secondary.main
              }
            }}
          />
        );
      })}
    </BottomNavigation>
  );
};

export default AppBarBottom;
