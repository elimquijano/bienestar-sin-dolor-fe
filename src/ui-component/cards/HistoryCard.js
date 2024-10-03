import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'; // Usar CircularProgress de Material-UI
import { useTheme } from '@mui/material/styles';

const HistoryCard = ({ onPress, percent, name }) => {
  const theme = useTheme(); // Usar el tema definido

  return (
    <Card
      style={{
        backgroundColor: theme.palette.background.default,
        cursor: 'pointer',
        position: 'relative' // Añadir posición relativa para el contenedor
      }}
      onClick={onPress} // Cambié onPress a onClick para React.js
    >
      <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
        <Box position="relative" display="inline-flex">
          {/* Círculo de fondo */}
          <CircularProgress
            variant="determinate"
            value={100}
            size={100}
            thickness={6}
            sx={{
              color: theme.palette.grey[200] // Color del círculo no llenado
            }}
          />
          <Box position="absolute" top={0} left={0} display="flex" alignItems="center" justifyContent="center">
            <CircularProgress
              variant="determinate"
              value={percent}
              size={100}
              thickness={6}
              sx={{
                color: theme.palette.secondary.main // Color del progreso
              }}
            />
            {/* Label en el centro */}
            <Box position="absolute" top={0} left={0} bottom={0} right={0} display="flex" alignItems="center" justifyContent="center">
              <Typography variant="caption" component="div" color="text.secondary">
                {`${Math.round(percent)}%`}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" style={{ fontWeight: 700, textAlign: 'center', marginTop: 20, color: theme.palette.text.secondary }}>
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
