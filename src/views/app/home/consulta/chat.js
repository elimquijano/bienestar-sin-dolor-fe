import React, { useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem, Paper, InputAdornment } from '@mui/material';
import { Mic, Send as SendIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { API_HOST, API_URL_CONVERSATION, API_URL_MENSAJE, getSession, postData, redirectToRelativePage, ResponseAI } from 'common/common';
import AppContentHeader from 'layout/MainLayout/HeaderContent';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { useParams } from 'react-router';

const ChatScreen = () => {
  const { id } = useParams();
  const emisor = getSession('USER_SESSION');
  const [receptor, setReceptor] = useState({});
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
        const newMessageUser = {
          conversation_id: id,
          user_id: emisor.id,
          content: newMessage
        };
        const responseUser = await postData(API_URL_MENSAJE, newMessageUser);
        const userMessage = { role: 'user', content: responseUser.content };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setNewMessage('');

        setIsWriting(true);
        const responseAI = await ResponseAI(newMessage);
        const newMessageAssistant = {
          conversation_id: id,
          user_id: receptor.id,
          content: responseAI
        };
        const responseAssistant = await postData(API_URL_MENSAJE, newMessageAssistant);
        const aiMessage = { role: 'assistant', content: responseAssistant.content };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
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

  const formatearManyMessage = (arrayMessage) => {
    const messagesFormated = arrayMessage.map((m) => {
      const role = m.user_id == emisor.id ? 'user' : 'assistant';
      return { role: role, content: m.content };
    });

    return messagesFormated;
  };

  useEffect(() => {
    fetch(API_URL_CONVERSATION + `/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const participante = data?.participantes.find((p) => p.id !== emisor?.id);
        setReceptor(participante);
        setMessages([...formatearManyMessage(data?.mensajes), messageDefault]);
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
      <AppContentHeader
        avatarImage={API_HOST + receptor?.image || ''}
        title={`${receptor?.firstname} ${receptor?.lastname}`}
        isDark={false}
      />
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
        {isWriting && (
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
