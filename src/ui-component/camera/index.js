import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { CameraAlt } from '@mui/icons-material';
import { Button } from '@mui/material';

const videoConstraints = {
  facingMode: 'user'
};

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  return (
    <>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} width={'100%'} />
      <Button variant="contained" color="primary" endIcon={<CameraAlt />} onClick={capture}>
        Capture photo
      </Button>
      {imgSrc && <img src={imgSrc} alt="webcam capture" />}
    </>
  );
};

export default WebcamCapture;
