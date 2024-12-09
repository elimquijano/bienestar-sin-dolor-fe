import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Paper, Typography, IconButton, Grid, LinearProgress } from '@mui/material';
import { CameraAlt, HideImage, Image, FlipCameraAndroid, Camera, NoPhotography, Circle } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import AppContentHeader from 'layout/MainLayout/HeaderContent';
import { API_URL_RADIOGRAFIA, getSession, URL_API_CLASSIFIER } from 'common/common';

const ImageClassifier = () => {
  const theme = useTheme();
  const [mode, setMode] = useState('file');
  const [image, setImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currentDeviceId, setCurrentDeviceId] = useState(null);
  const [apiResults, setApiResults] = useState(null);
  const [isSend, setIsSend] = useState(false);
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
    setIsSend(true);
    const imageToSend = capturedImage || image;

    if (!imageToSend) return;

    try {
      const formData = new FormData();
      const blob = await (await fetch(imageToSend)).blob();
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      formData.append('image', file);

      const response = await fetch(URL_API_CLASSIFIER, {
        method: 'POST',
        body: formData
      });

      const results = await response.json();
      setApiResults(results);
      if (results?.success) {
        formData.append('user_id', getSession('USER_SESSION')?.id);
        formData.append('result', JSON.stringify(results));

        await fetch(API_URL_RADIOGRAFIA, {
          method: 'POST',
          body: formData
        });
      }
    } catch (error) {
      console.error('Error enviando imagen:', error);
      setApiResults({ error: 'No se pudo clasificar la imagen' });
    } finally {
      setIsSend(false);
    }
  };

  const cleanChanges = (type) => {
    setApiResults(null);
    setCapturedImage(null);
    setImage(null);
    setMode(type);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.grey[100], height: '100vh' }}>
      <AppContentHeader style={{ position: 'fixed', width: '100%', zIndex: 1 }} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
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
                  onClick={() => cleanChanges('file')}
                  aria-label="Modo de selección de archivo"
                >
                  {image ? <HideImage /> : <Image />}
                </Button>

                {/* Botón de cámara */}
                <Button
                  variant="contained"
                  color={mode === 'camera' ? 'primary' : 'secondary'}
                  onClick={() => cleanChanges('camera')}
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
                  <Button variant="contained" color="success" onClick={sendImageToAPI} disabled={isSend}>
                    {isSend ? 'Clasificando...' : 'Clasificar'}
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
          {/* Resultados de la API */}
          <Grid item xs={12} sm={6}>
            <Paper
              sx={{
                p: 2,
                width: '100%'
              }}
            >
              <Grid container spacing={4}>
                <Grid item xs={12} className={'text-center'}>
                  <Typography sx={{ fontWeight: 'bold', marginBottom: 2, fontSize: 48, color: theme.palette.secondary.main }}>
                    {apiResults?.confidence || '--'}%
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'center', marginBottom: 4 }}>
                    {apiResults
                      ? apiResults?.success
                        ? `de la imagen probablemente sea una radiografía de una ${apiResults?.predictedClass}`
                        : apiResults?.message
                      : 'de la imagen probablemente sea una radiografía de una --'}
                  </Typography>
                  <LinearProgress
                    sx={{ height: 20, borderRadius: 5 }}
                    color="secondary"
                    variant="determinate"
                    value={apiResults?.confidence || 0}
                  />
                </Grid>
                <Grid item xs={12} spacing={2}>
                  {apiResults?.allProbabilities?.map((res, index) => {
                    return (
                      <Grid key={index} container sx={{ display: 'flex', alignItems: 'center' }}>
                        <Circle color={res?.class == apiResults?.predictedClass ? 'secondary' : 'inherit'} />
                        <Typography>Radiografía de una {res?.class || ''}</Typography>
                        <LinearProgress
                          sx={{ height: 5, borderRadius: 2, flexGrow: 1, margin: 2 }}
                          color={res?.class == apiResults?.predictedClass ? 'secondary' : 'inherit'}
                          variant="determinate"
                          value={res?.probability || 0}
                        />
                        <Typography>{res?.probability || 0}%</Typography>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ImageClassifier;
