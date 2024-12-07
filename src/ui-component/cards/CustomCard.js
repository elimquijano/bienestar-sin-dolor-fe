import React from 'react';
import { Alert } from '@mui/material';
import { styled } from '@mui/system';

const AlertContainer = styled('div')({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  padding: '32px 16px',
  backgroundColor: 'transparent'
});

const AlertImage = styled('img')({
  width: '120px',
  height: '120px',
  borderRadius: '8px',
  position: 'absolute',
  left: '16px',
  top: '0', // Ajustar para que esté alineada con el contenedor
  animation: 'rotate 1s infinite alternate' // Aplicar la animación
});

// Definir la animación de rotación
const styles = `
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(5deg); // Rotación leve
  }
}
`;

const CustomCard = ({ imageSrc, message }) => {
  return (
    <>
      <style>{styles}</style>
      <AlertContainer>
        <AlertImage src={imageSrc} alt="Alert" />
        <Alert
          icon={false}
          variant="filled"
          severity="success"
          sx={{ width: '100%', display: 'flex', paddingLeft: '120px', alignItems: 'center' }}
        >
          <strong>{message}</strong>
        </Alert>
      </AlertContainer>
    </>
  );
};

export default CustomCard;
