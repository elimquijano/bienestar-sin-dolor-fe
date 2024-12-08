import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { Box, Typography, Card, Select, MenuItem } from '@mui/material';

const PoseDetectionLogger = () => {
  const webcamRef = useRef(null); // Referencia a la webcam
  const canvasRef = useRef(null); // Referencia al canvas para dibujar
  const [status, setStatus] = useState('Inicializando...');
  const [videoDevices, setVideoDevices] = useState([]); // Lista de cámaras disponibles
  const [selectedDeviceId, setSelectedDeviceId] = useState(''); // Cámara seleccionada
  const detectorRef = useRef(null); // Referencia al detector de poses
  const [isDetecting, setIsDetecting] = useState(false); // Estado de detección

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

    const initializeDetector = async () => {
      try {
        setStatus('Configurando TensorFlow.js...');
        await tf.setBackend('webgl');
        await tf.ready();

        setStatus('Cargando modelo MoveNet...');
        const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
        });
        detectorRef.current = detector; // Almacenar detector
        setStatus('Listo para detectar poses.');
      } catch (err) {
        console.error('Error al inicializar la detección:', err);
      }
    };

    getDevices();
    initializeDetector();
  }, []);

  const startPoseDetection = async () => {
    setIsDetecting(true);
    setStatus('Iniciando detección de poses...');

    const detectPose = async () => {
      if (!webcamRef.current || !detectorRef.current) return;

      const video = webcamRef.current.video;
      const canvas = canvasRef.current;

      if (video && video.readyState === 4 && canvas) {
        const poses = await detectorRef.current.estimatePoses(video);

        if (poses.length > 0) {
          drawPose(poses[0], canvas, video); // Dibuja la pose detectada
          setStatus(`Puntos clave detectados: ${poses[0].keypoints.length}`);
        } else {
          setStatus('No se detectaron poses.');
        }
      }

      if (isDetecting) {
        requestAnimationFrame(detectPose);
      }
    };

    detectPose();
  };

  const handleCameraChange = (deviceId) => {
    setSelectedDeviceId(deviceId);
    stopPoseDetection(); // Detenemos la detección actual
    setStatus('Cambiando de cámara...');
    setTimeout(() => {
      startPoseDetection(); // Reinicia la detección con la nueva cámara
    }, 1000); // Le damos tiempo a la cámara para inicializarse
  };

  const stopPoseDetection = () => {
    setIsDetecting(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
    }
    setStatus('Detección pausada.');
  };

  const drawPose = (pose, canvas, video) => {
    const ctx = canvas.getContext('2d');

    // Configurar tamaño del canvas para que coincida con el video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Limpia el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja puntos clave
    pose.keypoints.forEach((keypoint) => {
      console.log(keypoint)
      if (keypoint.score > 0.5) {
        // Filtra puntos con baja confianza
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }
    });

    // Dibuja conexiones entre puntos clave
    const connections = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);
    connections.forEach(([startIdx, endIdx]) => {
      const start = pose.keypoints[startIdx];
      const end = pose.keypoints[endIdx];

      if (start.score > 0.5 && end.score > 0.5) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    if (selectedDeviceId) {
      startPoseDetection();
    }
  }, [selectedDeviceId]);

  console.log(status)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Detección de Poses en Tiempo Real
      </Typography>

      {videoDevices.length > 1 && (
        <Select value={selectedDeviceId} onChange={(e) => handleCameraChange(e.target.value)} sx={{ mb: 2, width: '300px' }}>
          {videoDevices.map((device) => (
            <MenuItem key={device.deviceId} value={device.deviceId}>
              {device.label || `Cámara ${device.deviceId}`}
            </MenuItem>
          ))}
        </Select>
      )}

      <Card sx={{ position: 'relative', mt: 4, width: 640, height: 480, overflow: 'hidden' }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: 'scaleX(-1)' // Refleja el video para la experiencia del usuario
          }}
          videoConstraints={{ deviceId: selectedDeviceId }} // Cámara seleccionada
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        />
      </Card>

      <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
        {status}
      </Typography>
    </Box>
  );
};

export default PoseDetectionLogger;
