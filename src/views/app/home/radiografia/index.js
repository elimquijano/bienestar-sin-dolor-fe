import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Paper, Typography, IconButton } from '@mui/material';
import { CameraAlt, Send, HideImage, Image, FlipCameraAndroid, Camera, NoPhotography } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import AppContentHeader from 'layout/MainLayout/HeaderContent';
import { URL_API_CLASSIFIER } from 'common/common';

const ImageClassifier = () => {
  const theme = useTheme();
  const [mode, setMode] = useState('file');
  const [image, setImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currentDeviceId, setCurrentDeviceId] = useState(null);
  const [apiResults, setApiResults] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Obtener dispositivos de cámara
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');
        setDevices(videoDevices);

        if (videoDevices.length > 0) {
          setCurrentDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error obteniendo dispositivos de cámara:', error);
      }
    };

    getDevices();
  }, []);

  // Iniciar stream de cámara
  useEffect(() => {
    if (mode === 'camera' && currentDeviceId) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [mode, currentDeviceId]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          deviceId: { exact: currentDeviceId },
          width: { ideal: 240 },
          height: { ideal: 240 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        video.addEventListener('loadedmetadata', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const drawFrame = () => {
            if (!video.paused && !video.ended) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              requestAnimationFrame(drawFrame);
            }
          };

          drawFrame();
        });
      }
    } catch (error) {
      console.error('Error iniciando cámara:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Cambiar entre dispositivos de cámara
  const switchCamera = () => {
    const currentIndex = devices.findIndex((device) => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    setCurrentDeviceId(devices[nextIndex].deviceId);
  };

  // Manejar selección de archivo
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setMode('file');
      };
      reader.readAsDataURL(file);
    }
  };

  // Capturar foto
  const capturePhoto = () => {
    if (canvasRef.current) {
      const capturedImageData = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(capturedImageData);
    }
  };

  // Enviar imagen a la API
  const sendImageToAPI = async () => {
    const imageToSend = capturedImage || image;

    if (!imageToSend) return;

    try {
      // Simular llamada a API (reemplazar con tu endpoint real)
      const response = await fetch(URL_API_CLASSIFIER, {
        method: 'POST',
        body: JSON.stringify({ image: imageToSend }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const results = await response.json();
      setApiResults(results);
    } catch (error) {
      console.error('Error enviando imagen:', error);
      setApiResults({ error: 'No se pudo clasificar la imagen' });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.grey[100], height: '100vh' }}>
      <AppContentHeader style={{ position: 'fixed', width: '100%', zIndex: 1 }} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
        <Paper sx={{ padding: 2 }}>
          {/* Contenedor de imagen/cámara */}
          <Box
            sx={{
              width: '100%',
              height: 300,
              bgcolor: 'rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2
            }}
            onClick={() => mode === 'file' && fileInputRef.current.click()}
          >
            <canvas
              ref={canvasRef}
              style={{
                display: mode === 'camera' && !capturedImage ? 'block' : 'none',
                width: '240px',
                height: '240px',
                objectFit: 'contain'
              }}
              aria-label="Vista de la cámara"
            />

            {(mode === 'file' || capturedImage) && (
              <img
                src={capturedImage || image}
                alt="Pulse aquí para seleccionar una imagen"
                style={{
                  maxWidth: '240px',
                  maxHeight: '240px',
                  objectFit: 'contain'
                }}
              />
            )}

            {/* Input oculto para archivos */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileUpload}
              aria-label="Seleccionar archivo de imagen"
            />
          </Box>

          {/* Controles */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 2
            }}
          >
            {/* Botón de archivo */}
            <Button
              variant="contained"
              color={mode === 'file' ? 'primary' : 'secondary'}
              onClick={() => {
                setCapturedImage(null);
                setImage(null);
                setMode('file');
              }}
              aria-label="Modo de selección de archivo"
            >
              {image ? <HideImage /> : <Image />}
            </Button>

            {/* Botón de cámara */}
            <Button
              variant="contained"
              color={mode === 'camera' ? 'primary' : 'secondary'}
              onClick={() => {
                setCapturedImage(null);
                setImage(null);
                setMode('camera');
              }}
              aria-label="Modo de cámara"
            >
              {capturedImage ? <NoPhotography /> : <CameraAlt />}
            </Button>

            {mode === 'camera' && (
              <>
                {/* Cambiar cámara */}
                <IconButton color="primary" onClick={switchCamera} aria-label="Cambiar dispositivo de cámara">
                  <FlipCameraAndroid />
                </IconButton>

                {/* Capturar foto o enviar */}
                <IconButton color="primary" onClick={capturePhoto} aria-label={'Capturar foto'}>
                  <Camera />
                </IconButton>
              </>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
            {(capturedImage || image) && (
              <Button variant="contained" color="success" onClick={sendImageToAPI}>
                <Send /> Clasificar
              </Button>
            )}
          </Box>
        </Paper>
        {/* Resultados de la API */}
        {apiResults && (
          <Paper
            elevation={3}
            sx={{
              mt: 2,
              p: 2,
              width: '100%'
            }}
          >
            <Typography variant="h6">Resultados de Clasificación</Typography>
            <pre>{JSON.stringify(apiResults, null, 2)}</pre>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default ImageClassifier;
