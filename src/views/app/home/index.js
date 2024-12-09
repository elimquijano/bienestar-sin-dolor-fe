import React, { useState, useEffect } from 'react';
import { Grid, Stack } from '@mui/material';
import IconDoubts from '../../../assets/images/icons/service.png';
import IconXRay from '../../../assets/images/icons/virus.png';
import IconConsultation from '../../../assets/images/icons/nurse.png';
import HomeCard from 'ui-component/cards/HomeCard';
import { API_URL_CONVERSATION, fetchAPIAsync, getSession, redirectToRelativePage, ResponseAI } from 'common/common';
import CustomCard from 'ui-component/cards/CustomCard';
import Logo from '../../../assets/images/Logo.png';

const HomeScreen = () => {
  // Obtener la sesión del usuario una vez
  const userSession = getSession('USER_SESSION');
  const [motivationalMessage, setMotivationalMessage] = useState('');

  // Manejar la interacción con la IA
  const handleChatAI = async () => {
    try {
      // Buscar conversaciones existentes
      const result = await fetchAPIAsync(API_URL_CONVERSATION, { user_id: userSession.id }, 'GET');

      // Obtener el ID de la conversación existente o crear una nueva
      const conversationId = result?.data[0]?.id || (await createNewConversation(userSession.id));

      // Redirigir a la conversación
      redirectToRelativePage(`/#/chat/${conversationId}`);
    } catch (error) {
      console.error('Error handling chat AI:', error);
    }
  };

  // Crear una nueva conversación
  const createNewConversation = async (userId) => {
    const newConversation = await fetchAPIAsync(API_URL_CONVERSATION, { user_id: userId }, 'POST');
    return newConversation?.id;
  };

  // Obtener un mensaje motivacional al montar el componente
  useEffect(() => {
    const fetchMotivationalMessage = async () => {
      const message = await ResponseAI(
        userSession?.firstname,
        'Eres un asistente de un aplicativo y tu misión es dar solo una frase motivacional muy corta distinta a usuarios de un aplicativo de guía de rehabilitación de lesiones y desgarros. El usuario te dará su nombre y tú debes brindarle solo la frase corta con su nombre sin responderle.'
      );
      setMotivationalMessage(message);
    };

    fetchMotivationalMessage();
  }, [userSession]);

  // Definir los botones con acciones asociadas
  const buttons = [
    {
      id: 1,
      name: '¿Tienes dudas? Pregúntale a la IA',
      imageSource: IconConsultation,
      onPress: handleChatAI
    },
    {
      id: 2,
      name: '¿Ya tienes tu descarte?',
      imageSource: IconDoubts,
      onPress: () => redirectToRelativePage('/#/enfermedades')
    },
    {
      id: 3,
      name: '¿Quieres analizar una radiografía?',
      imageSource: IconXRay,
      onPress: () => redirectToRelativePage('/#/radiografia')
    },
  ];
  return (
    <Grid container>
      <Grid item xs={12} md={12} lg={12} align="center">
        <Stack spacing={2} alignItems="center" justifyContent="center">
          <CustomCard imageSrc={Logo} message={motivationalMessage || ''} />
        </Stack>
      </Grid>
      <Grid item xs={12} md={12} lg={12} align="center">
        <Grid container spacing={2} sx={{ paddingBottom: 8 }}>
          {buttons.map((button) => (
            <Grid key={button.id} item xs={12} md={4}>
              <HomeCard name={button.name} imageSource={button.imageSource} onPress={button.onPress} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomeScreen;
