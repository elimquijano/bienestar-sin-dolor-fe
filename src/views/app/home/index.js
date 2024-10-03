import React from 'react';
import { Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Logo from '../../../assets/images/Logo.png';
import HomeCard from 'ui-component/cards/HomeCard';
import { redirectToRelativePage } from 'common/common';

const HomeScreen = () => {
  const theme = useTheme();
  const buttons = [
    { id: 1, name: 'Preguntale a la IA', imageSource: Logo, onPress: () => redirectToRelativePage('/#/chat') },
    {
      id: 6,
      name: '¿Ya tienes tu descarte?',
      imageSource: Logo,
      onPress: () => {}
    },
    {
      id: 7,
      name: 'Contacta con un especialista',
      imageSource: Logo,
      onPress: () => {}
    },
    { id: 4, name: 'Encuentra centros cercanos', imageSource: Logo, onPress: () => redirectToRelativePage('/#/map') }
  ];

  return (
    <div style={{ backgroundColor: theme.palette.grey[200], minHeight: '100vh', width: '100vw', padding: 12 }}>
      <Grid container spacing={2}>
        {buttons.map((button) => (
          <Grid item xs={6} md={4} lg={3} key={button.id}>
            <Paper elevation={3} style={{ padding: 16, minHeight: 210 }}>
              <HomeCard name={button.name} imageSource={button.imageSource} onPress={button.onPress} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default HomeScreen;
