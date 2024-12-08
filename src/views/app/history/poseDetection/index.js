import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { Box, Typography, Card, Button, LinearProgress } from '@mui/material';

const VideoPoseDetectionLogger = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const [status, setStatus] = useState('Inicializando...');
  const [progress, setProgress] = useState(0);
  const [detectedPoses, setDetectedPoses] = useState([]);

  useEffect(() => {
    const initializeDetector = async () => {
      try {
        setStatus('Configurando TensorFlow.js...');
        await tf.setBackend('webgl');
        await tf.ready();

        setStatus('Cargando modelo MoveNet...');
        const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
        });
        detectorRef.current = detector;
        setStatus('Listo para detectar poses en video.');
      } catch (err) {
        console.error('Error al inicializar la detección:', err);
        setStatus('Error al cargar el modelo.');
      }
    };

    initializeDetector();
  }, []);

  const processVideo = async (videoElement) => {
    if (!detectorRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const detectedFrames = [];

    // Reset previous state
    setDetectedPoses([]);
    setProgress(0);

    const processFrame = async (currentTime) => {
      return new Promise((resolve) => {
        videoElement.currentTime = currentTime;
        
        videoElement.onseeked = async () => {
          // Set canvas size to match video
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;

          // Clear previous frame
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw video frame
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

          // Detect pose
          try {
            const poses = await detectorRef.current.estimatePoses(canvas);
            
            if (poses.length > 0) {
              const pose = poses[0];
              
              // Store frame data
              detectedFrames.push({
                frameTime: currentTime,
                pose: pose
              });

              // Draw pose
              drawPose(pose, canvas);
            }
          } catch (error) {
            console.error('Error detecting pose:', error);
          }

          resolve();
        };
      });
    };

    // Process every second of the video
    for (let time = 0; time < videoElement.duration; time += 1) {
      await processFrame(time);
      
      // Update progress
      const progressPercentage = Math.floor((time / videoElement.duration) * 100);
      setProgress(progressPercentage);
    }

    // Log detected poses
    console.log('Detected Poses:', detectedFrames);
    setDetectedPoses(detectedFrames);
    setStatus(`Detección completada. ${detectedFrames.length} frames procesados.`);
  };

  const drawPose = (pose, canvas) => {
    const ctx = canvas.getContext('2d');

    // Draw keypoints
    pose.keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.5) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }
    });

    // Draw connections
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      videoRef.current.src = videoURL;
      
      videoRef.current.onloadedmetadata = () => {
        setStatus('Video cargado. Iniciando detección de poses...');
        processVideo(videoRef.current);
      };
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Detección de Poses en Video
      </Typography>

      <Button 
        variant="contained" 
        component="label" 
        sx={{ mb: 2 }}
      >
        Subir Video
        <input 
          type="file" 
          hidden 
          accept="video/*" 
          onChange={handleFileUpload}
        />
      </Button>

      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ width: '100%', mb: 2 }}
      />

      <Card sx={{ position: 'relative', width: 640, height: 480, overflow: 'hidden' }}>
        <video
          ref={videoRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'none'
          }}
          controls={false}
        >
          <track kind="captions" />
        </video>
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

      {detectedPoses.length > 0 && (
        <Box sx={{ mt: 2, width: '100%' }}>
          <Typography variant="h6">
            Detalle de Poses Detectadas
          </Typography>
          <pre>{JSON.stringify(detectedPoses, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
};

export default VideoPoseDetectionLogger;