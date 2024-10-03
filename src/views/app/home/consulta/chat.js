import React, { useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem, Paper, InputAdornment } from '@mui/material';
import { Mic, Send as SendIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Logo from '../../../../assets/images/Logo.png';
import { API_KEY_COHERE_AI, getSession, redirectToRelativePage, URL_API_COHERE } from 'common/common';
import AppContentHeader from 'layout/AppLayout/HeaderContent';
import { useEffect } from 'react';
import { useRef } from 'react';
import axios from 'axios';

const ChatScreen = () => {
  const username = getSession('USER_NAME');
  const theme = useTheme();
  const containerRef = useRef(null);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hola ${username}, soy tu asistente de rehabilitación. ¿En qué puedo ayudarte hoy?` }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessageToAI = async (userMessage) => {
    setIsLoading(true);
    const url = URL_API_COHERE;
    const token = API_KEY_COHERE_AI;

    const data = {
      message: userMessage,
      model: 'command-r-plus',
      preamble:
        'Eres un fisioterapeuta y médico experto. Tu tarea es evaluar las dolencias descritas por el usuario y proporcionar orientación inicial. Debes hacer preguntas detalladas para obtener la mayor cantidad de información posible sobre el malestar del usuario. No debes dar recomendaciones específicas hasta haber recopilado suficiente información. No debes realizar más de una pregunta en una sola respuesta, sino una sola pregunta. Pregunta al usuario sobre su malestar: "¿Dónde sientes dolor y cuándo comenzó?" Indaga sobre la naturaleza de la lesión: "¿Cómo ocurrió la lesión? ¿Fue un movimiento brusco, una caída, o algo más?" Pregunta sobre síntomas adicionales: "¿Has notado hinchazón, moretones o limitación en el movimiento?" Indaga sobre tratamientos previos: "¿Has recibido algún tratamiento para este malestar? ¿Qué has probado hasta ahora?" Pregunta sobre actividades: "¿Hay alguna actividad que empeore o mejore el dolor?" Una vez que el usuario haya proporcionado suficiente información, realiza un pre-descarte de lesiones simples, desgarros o fracturas, basándote en los síntomas descritos. Ofrece consejos de rehabilitación básicos y sugiere cuándo es necesario buscar atención médica profesional solo cuando ya no haya más respuestas a sus preguntas del usuario. Si el usuario pregunta por tu creador, solo si pregunta, sino no,responde que fuiste creado por los estudiantes de ingeniería de sistemas de la UNHEVAL: Elim, Johan y Jordan.'
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const aiMessage = response.data.text;
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: aiMessage }]);
    } catch (error) {
      console.error('Error al enviar mensaje a Cohere AI:', error);
      if (error.response && error.response.status === 429) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: 'assistant',
            content:
              'Lo siento, hemos alcanzado nuestro límite de uso de la API. Por favor, intenta de nuevo más tarde o contacta con soporte si el problema persiste.'
          }
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: 'assistant',
            content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.'
          }
        ]);
      }
    }
    setIsLoading(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const userMessage = { role: 'user', content: newMessage };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      sendMessageToAI(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[200],
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <AppContentHeader avatarImage={Logo} title={'Chat Johan AI'} />
      <List ref={containerRef} sx={{ width: '100%', flexGrow: 1, overflowY: 'auto', padding: 2 }}>
        {messages.map((message, index) => (
          <ListItem
            key={index}
            sx={{
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              marginBottom: 1
            }}
          >
            <Paper
              elevation={1}
              sx={{
                padding: 2,
                maxWidth: '70%',
                backgroundColor: message.role === 'user' ? theme.palette.secondary.main : '#fff',
                borderRadius: '20px',
                borderTopLeftRadius: message.role === 'assistant' ? '0' : '20px',
                borderTopRightRadius: message.role === 'user' ? '0' : '20px'
              }}
            >
              <Typography style={{ color: message.role === 'user' ? '#fff' : '#000' }}>{message.content}</Typography>
            </Paper>
          </ListItem>
        ))}
        {isLoading && (
          <ListItem sx={{ justifyContent: 'flex-start' }}>
            <Paper elevation={1} sx={{ padding: 2, backgroundColor: '#f0f0f0', borderRadius: '20px' }}>
              <Typography>Escribiendo...</Typography>
            </Paper>
          </ListItem>
        )}
      </List>

      <Box sx={{ padding: 2, backgroundColor: '#fff' }}>
        <TextField
          placeholder="Escribe un mensaje..."
          multiline
          maxRows={4}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color={'default'} onClick={() => redirectToRelativePage('/#/chat-voz')}>
                  <Mic />
                </IconButton>
                <IconButton color="secondary" onClick={handleSendMessage} disabled={isLoading}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatScreen;
