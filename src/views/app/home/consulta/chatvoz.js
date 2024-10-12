import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { useTheme } from '@mui/material/styles';
import AppContentHeader from 'layout/MainLayout/HeaderContent';
import Spectrogram from 'ui-component/Spectrogram';
import { API_HOST, API_URL_CONVERSATION, API_URL_MENSAJE, getSession, notificationSwal, postData, ResponseAI, SpeakTextNative } from 'common/common';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { useParams } from 'react-router';

const VoiceChatScreen = () => {
  const { id } = useParams();
  const emisor = getSession('USER_SESSION');
  const [receptor, setReceptor] = useState({});
  const theme = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratedResponse, setIsGeneratedResponse] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    fetch(API_URL_CONVERSATION + `/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const participante = data?.participantes.find((p) => p.id !== emisor?.id);
        setReceptor(participante);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    checkPermission();
    SpeakTextNative(`Hola ${emisor?.firstname}, soy tu asistente de rehabilitación. ¿En qué puedo ayudarte hoy?`, setIsSpeaking);
    return () => {
      SpeechRecognition.removeAllListeners();
    };
  }, []);

  const checkPermission = async () => {
    try {
      const { available } = await SpeechRecognition.available();
      if (!available) {
        notificationSwal('error', 'El reconocimiento de voz no está disponible en este dispositivo.');
      }
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      notificationSwal('error', `Error al verificar disponibilidad: ${error.message}`);
    }
  };

  const startListening = async () => {
    try {
      await SpeechRecognition.start({
        language: 'es-ES',
        maxResults: 1,
        prompt: 'Habla ahora',
        partialResults: true,
        popup: false
      });

      SpeechRecognition.addListener('partialResults', (result) => {
        if (result.matches && result.matches.length > 0) {
          setTranscript(result.matches[0]);
        }
      });

      SpeechRecognition.addListener('listeningState', (data) => {
        if (data.status == 'started') {
          setIsListening(true);
        } else if (data.status == 'stopped') {
          setIsListening(false);
          SpeakReponseAI();
        }
      });
    } catch (error) {
      console.error('Error al iniciar el reconocimiento de voz:', error);
      notificationSwal('error', `Error al iniciar el reconocimiento de voz: ${error.message}`);
    }
  };

  const SpeakReponseAI = async () => {
    if (transcript.trim() !== '') {
      try {
        setIsGeneratedResponse(true);
        const newMessageUser = {
          conversation_id: id,
          user_id: emisor.id,
          content: transcript
        };
        const responseUser = await postData(API_URL_MENSAJE, newMessageUser);
        const response = await ResponseAI(responseUser.content);
        
        const newMessageAssistant = {
          conversation_id: id,
          user_id: receptor.id,
          content: response
        };
        const responseAssistant = await postData(API_URL_MENSAJE, newMessageAssistant);
        setIsGeneratedResponse(false);
        SpeakTextNative(responseAssistant.content, setIsSpeaking);
      } catch (error) {
        console.log('Error al obtener la respuesta de la IA', error);
      }
    }
  };

  const handleListen = async () => {
    if (!isListening) {
      await startListening();
    }
  };

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
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Spectrogram isActive={isListening || isSpeaking} backgroundColor={theme.palette.grey[200]} color={theme.palette.secondary.main} />
        <Typography variant="h6" sx={{ mt: 2, color: theme.palette.secondary.main }}>
          {isListening
            ? 'Escuchando...'
            : isGeneratedResponse
            ? 'Generando respuesta...'
            : isSpeaking
            ? 'Hablando...'
            : 'Presiona el botón para hablar'}
        </Typography>
        <Typography variant="" sx={{ mt: 2}}>{transcript}</Typography>
      </Box>

      <Box sx={{ padding: 1, display: 'flex', justifyContent: 'center' }}>
        <IconButton color="secondary" onClick={handleListen} sx={{ width: 60, height: 60 }} disabled={isSpeaking || isGeneratedResponse}>
          {isListening ? <StopIcon sx={{ fontSize: 40 }} /> : <MicIcon sx={{ fontSize: 40 }} />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default VoiceChatScreen;
