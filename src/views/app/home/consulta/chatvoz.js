import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Mic as MicIcon, Stop as StopIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Spectrogram from 'ui-component/Spectrogram';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';
import { API_KEY_COHERE_AI, getSession, notificationSwal, URL_API_COHERE } from 'common/common';
import AppContentHeader from 'layout/AppLayout/HeaderContent';
import axios from 'axios';

const VoiceChatScreen = () => {
  const username = getSession('USER_NAME');
  const theme = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [transcriptionTimeout, setTranscriptionTimeout] = useState(null);

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

  useEffect(() => {
    requestPermissions();
    speakText(`Hola ${username}, soy tu asistente de rehabilitación. ¿En qué puedo ayudarte hoy?`);
    return () => {
      stopListening();
    };
  }, []);

  const requestPermissions = async () => {
    if (Capacitor.isNativePlatform()) {
      const { available } = await SpeechRecognition.available();
      if (available) {
        await SpeechRecognition.requestPermissions();
      }
    }
  };

  const handleUserMessage = useCallback(async (text) => {
    setIsListening(false);
    const responseText = await sendMessageToAI(text);
    speakText(responseText);
  }, []);

  const speakText = useCallback(async (text) => {
    try {
      setIsSpeaking(true);
      await TextToSpeech.speak({
        text: text,
        lang: 'es-ES',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient'
      });
    } catch (error) {
      notificationSwal('error', `Error en la síntesis de voz: ${error.message}`);
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const handlePartialResults = (result) => {
    const partialTranscription = result.matches[0];

    // Si ya hay un temporizador, lo limpiamos
    if (transcriptionTimeout) {
      clearTimeout(transcriptionTimeout);
    }

    // Establecemos un nuevo temporizador
    const timeout = setTimeout(() => {
      handleUserMessage(partialTranscription);
    }, 1000); // Espera 1 segundo después de que el usuario deja de hablar

    setTranscriptionTimeout(timeout);
  };

  const startListening = useCallback(async () => {
    try {
      setIsListening(true);

      await SpeechRecognition.start({
        language: 'es-ES',
        maxResults: 1,
        prompt: 'Habla ahora',
        partialResults: true,
        popup: false
      });

      SpeechRecognition.addListener('partialResults', handlePartialResults);
    } catch (error) {
      notificationSwal('error', `Error al iniciar el reconocimiento de voz: ${error.message}`);
      setIsListening(false);
    }
  }, [transcriptionTimeout]);

  const stopListening = useCallback(async () => {
    if (isListening) {
      try {
        await SpeechRecognition.stop();
        setIsListening(false);
        if (transcriptionTimeout) {
          clearTimeout(transcriptionTimeout);
        }
      } catch (error) {
        notificationSwal('error', `Error al detener el reconocimiento de voz: ${error.message}`);
      }
    }
  }, [isListening, transcriptionTimeout]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  console.log(messages);

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
      <AppContentHeader />
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
          {isListening ? 'Escuchando...' : isSpeaking ? 'Hablando...' : ''}
        </Typography>
      </Box>

      {/* Recording button */}
      <Box sx={{ padding: 1, display: 'flex', justifyContent: 'center' }}>
        <IconButton color="secondary" onClick={toggleListening} sx={{ width: 60, height: 60 }}>
          {isListening ? <StopIcon sx={{ fontSize: 40 }} /> : <MicIcon sx={{ fontSize: 40 }} />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default VoiceChatScreen;
