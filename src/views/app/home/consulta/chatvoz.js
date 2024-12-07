import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { useTheme } from '@mui/material/styles';
import AppContentHeader from 'layout/MainLayout/HeaderContent';
import Spectrogram from 'ui-component/Spectrogram';
import { API_URL_INTERACCION, getSession, notificationSwal, postData, ResponseAI, SpeakTextNative } from 'common/common';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { useParams } from 'react-router';
import { useRef } from 'react';
import Icon from '../../../../assets/images/Logo.png';

const VoiceChatScreen = () => {
  const { id } = useParams();
  const emisor = getSession('USER_SESSION');
  const theme = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratedResponse, setIsGeneratedResponse] = useState(false);
  const [transcript, setTranscript] = useState('');
  const transcriptRef = useRef(transcript);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

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
        return;
      }
      const permission = await SpeechRecognition.requestPermissions();
      if (permission.speechRecognition !== 'granted') {
        notificationSwal('error', 'Permiso de micrófono denegado. Por favor, habilítalo en la configuración de la aplicación.');
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
        } else {
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
    const currentTranscript = transcriptRef.current;
    if (currentTranscript.trim() !== '') {
      try {
        setIsGeneratedResponse(true);
        const response = await ResponseAI(currentTranscript);
        setIsGeneratedResponse(false);
        SpeakTextNative(response, setIsSpeaking);
        const newInteraction = {
          conversation_id: id,
          user_id: emisor.id,
          pregunta: currentTranscript,
          respuesta: response
        };

        // guardar en la base de datos
        await postData(API_URL_INTERACCION, newInteraction);
      } catch (error) {
        notificationSwal('error', 'Error al obtener la respuesta de la IA' + error);
      } finally {
        setTranscript('');
        setIsGeneratedResponse(false);
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
      <AppContentHeader avatarImage={Icon} title={`Chat AI`} isDark={false} />
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
        <Typography variant="" sx={{ mt: 2 }}>
          {transcript}
        </Typography>
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
