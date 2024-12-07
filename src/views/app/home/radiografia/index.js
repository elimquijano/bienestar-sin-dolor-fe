import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Box, Button, Card, CardContent, Typography, Grid, Stack } from '@mui/material';
import AppContentHeader from 'layout/MainLayout/HeaderContent';
import { URL_API_CLASSIFIER } from 'common/common';
import { useTheme } from '@mui/material/styles';
import { Camera, CameraAlt, Collections } from '@mui/icons-material';

const ImageClassifier = () => {
  const theme = useTheme();
  const [withCamera, setWithCamera] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]); // Lista de cámaras
  const [selectedDeviceId, setSelectedDeviceId] = useState(''); // Cámara seleccionada
  const webcamRef = useRef(null);

  // Capturar la imagen de la cámara y enviarla a la API
  const captureAndPredict = useCallback(async () => {
    if (!webcamRef.current) return;

    setIsLoading(true);

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const blob = await fetch(imageSrc).then((res) => res.blob());

      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');

      try {
        const response = await fetch(URL_API_CLASSIFIER, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Error en la API: ${response.statusText}`);
        }

        const result = await response.json();
        setPrediction(result);
        setError(null);
      } catch (err) {
        console.error('Error al clasificar la imagen:', err);
        setError(`Error al clasificar la imagen: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  }, [webcamRef]);

  // Obtener dispositivos de video al montar el componente
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter((device) => device.kind === 'videoinput');
        setVideoDevices(videoInputDevices);
        if (videoInputDevices.length > 0) {
          setSelectedDeviceId(videoInputDevices[0].deviceId); // Seleccionar la primera cámara
        }
      } catch (err) {
        console.error('Error al enumerar dispositivos:', err);
      }
    };

    getDevices();
  }, []);
  console.log(videoDevices);

  const openCamera = () => {
    setWithCamera(true);
  };
  const closeCamera = () => {
    setWithCamera(false);
  };

  const uploadImage = () => {};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.grey[100], height: '100vh' }}>
      <AppContentHeader style={{ position: 'fixed', width: '100%', zIndex: 1 }} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: '16px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ maxWidth: 400, mb: 3, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                width={240}
                height={240}
                videoConstraints={{ deviceId: selectedDeviceId }} // Configurar cámara activa
                style={{ borderRadius: 8 }}
              />
              <Stack direction="row" spacing={2}>
                <Button onClick={withCamera ? closeCamera : uploadImage}>
                  <Collections />
                </Button>
                <Button onClick={!withCamera ? openCamera : captureAndPredict} disabled={isLoading}>
                  {!withCamera ? <CameraAlt /> : <Camera />}
                </Button>
                {withCamera && <Button>Cambiar Cámara</Button>}
              </Stack>
            </Card>
          </Grid>
          {prediction && (
            <Grid item xs={12} md={6}>
              <Card sx={{ maxWidth: 400, p: 2 }}>
                <CardContent>
                  <Typography variant="h4">Resultados</Typography>
                  <Typography variant="body1">
                    <strong>Predicción:</strong> {prediction.predictedClass}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Confianza:</strong> {prediction.confidence}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default ImageClassifier;
