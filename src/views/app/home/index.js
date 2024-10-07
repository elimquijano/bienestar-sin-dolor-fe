import React, { useEffect, useState } from 'react';
import { Grid, Paper } from '@mui/material';
import IconConsulta from '../../../assets/images/icons/service.png';
import IconDescarte from '../../../assets/images/icons/virus.png';
import IconContact from '../../../assets/images/icons/nurse.png';
import IconFind from '../../../assets/images/icons/rehabilitation.png';
import HomeCard from 'ui-component/cards/HomeCard';
import { API_URL_PARTICIPANTE, getSession, redirectToRelativePage } from 'common/common';
import { Capacitor } from '@capacitor/core';

const HomeScreen = () => {
  const tipoConversation = 1; //AI
  const [conversacionConAI, setConversacionConAI] = useState({});
  const buttons = [
    {
      id: 1,
      name: 'Preguntale a la IA',
      imageSource: IconConsulta,
      onPress: () => redirectToRelativePage(`/#/chat/${conversacionConAI?.id}`)
    },
    {
      id: 6,
      name: '¿Ya tienes tu descarte?',
      imageSource: IconDescarte,
      onPress: () => redirectToRelativePage('/#/tratamientos')
    },
    {
      id: 7,
      name: 'Contacta con un especialista',
      imageSource: IconContact,
      onPress: () => redirectToRelativePage('/#/especialistas')
    },
    {
      id: 4,
      name: 'Encuentra centros cercanos',
      imageSource: IconFind,
      onPress: () => redirectToRelativePage(`/#/${Capacitor.isNativePlatform() ? 'map/0' : 'map-web/0'}`)
    }
  ];

  useEffect(() => {
    fetch(API_URL_PARTICIPANTE + `conversation?user_id=${getSession('USER_SESSION')?.id}&tipo_id=${tipoConversation}`)
      .then((response) => response.json())
      .then((data) => {
        const conversation = data.find((d) => d.tipo_id == tipoConversation);
        setConversacionConAI(conversation);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Grid container spacing={2} sx={{ paddingBottom: 6 }}>
      {buttons.map((button) => (
        <Grid item xs={6} md={4} lg={3} key={button.id}>
          <Paper elevation={3} style={{ padding: 16, minHeight: 210 }}>
            <HomeCard name={button.name} imageSource={button.imageSource} onPress={button.onPress} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default HomeScreen;
