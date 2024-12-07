import React, { useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem, Paper, InputAdornment } from '@mui/material';
import { Mic, Send as SendIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { API_URL_INTERACCION, getSession, postData, redirectToRelativePage, ResponseAI } from 'common/common';
import AppContentHeader from 'layout/MainLayout/HeaderContent';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { useParams } from 'react-router';
import Icon from '../../../../assets/images/Logo.png';

const ChatScreen = () => {
  const { id } = useParams();
  const emisor = getSession('USER_SESSION');
  const theme = useTheme();
  const containerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const messageDefault = {
    role: 'assistant',
    content: `Hola ${emisor?.firstname}, soy tu asistente de rehabilitación. ¿En qué puedo ayudarte hoy?`
  };

  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      setIsLoading(true);
      try {
        const userMessage = { role: 'user', content: newMessage };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setNewMessage('');
        setIsWriting(true);
        const responseAI = await ResponseAI(newMessage);
        const aiMessage = { role: 'assistant', content: responseAI };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        const newInteraction = {
          conversation_id: id,
          user_id: emisor.id,
          pregunta: newMessage,
          respuesta: responseAI
        };

        // guardar en la base de datos
        await postData(API_URL_INTERACCION, newInteraction);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        setIsWriting(false);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatearManyMessage = (arrayMessage = []) => {
    const messagesFormated = [];

    arrayMessage?.forEach((m) => {
      // Formatear la pregunta
      const pregunta = {
        role: 'user',
        content: m.pregunta
      };
      messagesFormated.push(pregunta);

      // Formatear la respuesta
      const respuesta = {
        role: 'assistant',
        content: m.respuesta
      };
      messagesFormated.push(respuesta);
    });

    return messagesFormated;
  };

  useEffect(() => {
    fetch(API_URL_INTERACCION + `?conversation_id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages([...formatearManyMessage(data?.data), messageDefault]);
      })
      .catch((error) => console.log(error));
  }, []);

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
      <AppContentHeader avatarImage={Icon} title={`Chat AI`} isDark={false} />
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
                borderTopLeftRadius: message.role === 'assistant' ? '0' : 'auto',
                borderTopRightRadius: message.role === 'user' ? '0' : 'auto'
              }}
            >
              <Typography style={{ color: message.role === 'user' ? '#fff' : '#000' }}>{message.content}</Typography>
            </Paper>
          </ListItem>
        ))}
        {isWriting && (
          <ListItem sx={{ justifyContent: 'flex-start' }}>
            <Paper elevation={1} sx={{ padding: 2, backgroundColor: '#f0f0f0', borderRadius: 'auto' }}>
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
                <IconButton
                  color={'default'}
                  onClick={() => redirectToRelativePage(`/#/${Capacitor.isNativePlatform() ? 'chat-voz/' : 'chat-voz-web/'}${id}`)}
                >
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
