import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import AppContentHeader from 'layout/MainLayout/HeaderContent';
import Spectrogram from 'ui-component/Spectrogram';
import {
  API_HOST,
  API_URL_CONVERSATION,
  API_URL_MENSAJE,
  getSession,
  notificationSwal,
  postData,
  ResponseAI,
  SpeakTextWeb
} from 'common/common';
import { useTheme } from '@mui/material/styles';

const VoiceChatWebScreen = () => {
  const { id } = useParams();
  const emisor = getSession('USER_SESSION');
  const [receptor, setReceptor] = useState({});
  const theme = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratedResponse, setIsGeneratedResponse] = useState(false);
  const [recognition, setRecognition] = useState(null);

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
    setIsListening((prev) => !prev);
    if (!isListening) {
      recognition.start();
    } else {
      recognition.stop();
      if (transcript.trim() !== '') {
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
        SpeakTextWeb(responseAssistant.content, setIsSpeaking);
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
