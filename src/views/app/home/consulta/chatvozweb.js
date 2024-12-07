import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import AppContentHeader from 'layout/MainLayout/HeaderContent';
import Spectrogram from 'ui-component/Spectrogram';
import { API_URL_INTERACCION, getSession, notificationSwal, postData, ResponseAI, SpeakTextWeb } from 'common/common';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router';
import Icon from '../../../../assets/images/Logo.png';

const VoiceChatWebScreen = () => {
  const { id } = useParams();
  const emisor = getSession('USER_SESSION');
  const theme = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratedResponse, setIsGeneratedResponse] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    SpeakTextWeb(`Hola ${emisor?.firstname}, soy tu asistente de rehabilitación. ¿En qué puedo ayudarte hoy?`, setIsSpeaking);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      notificationSwal('error', 'La API de reconocimiento de voz no es compatible con este navegador.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;

    // Establecer el idioma a español
    recognitionInstance.lang = 'es-ES'; // Cambia a 'es-MX' para español de México

    recognitionInstance.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setTranscript(currentTranscript);
    };

    recognitionInstance.onend = () => {
      if (isListening) {
        recognitionInstance.start();
      }
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.stop();
    };
  }, []);

  const handleListen = async () => {
    if (!isListening) {
      recognition.start();
      setIsListening((prev) => !prev);
    } else {
      recognition.stop();
      setIsListening((prev) => !prev);
      if (transcript.trim() !== '') {
        setIsGeneratedResponse(true);
        const response = await ResponseAI(transcript);
        setIsGeneratedResponse(false);
        SpeakTextWeb(response, setIsSpeaking);
        const newInteraction = {
          conversation_id: id,
          user_id: emisor.id,
          pregunta: transcript,
          respuesta: response
        };

        // guardar en la base de datos
        await postData(API_URL_INTERACCION, newInteraction);
      }
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
      {/* Header */}
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

      {/* Recording button */}
      <Box sx={{ padding: 1, display: 'flex', justifyContent: 'center' }}>
        <IconButton color="secondary" onClick={handleListen} sx={{ width: 60, height: 60 }} disabled={isSpeaking}>
          {isListening ? <StopIcon sx={{ fontSize: 40 }} /> : <MicIcon sx={{ fontSize: 40 }} />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default VoiceChatWebScreen;
