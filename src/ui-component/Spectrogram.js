import React from 'react';
import { Box } from '@mui/material';

const Spectrogram = ({ isActive, backgroundColor = '#000', color = '#fff' }) => {
  return (
    <Box
      sx={{
        width: 300,
        height: 300,
        borderRadius: '50%',
        backgroundColor: backgroundColor,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isActive && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '4px',
            padding: '0 10px'
          }}
        >
          {[...Array(20)].map((_, index) => (
            <Box
              key={index}
              sx={{
                width: '4%',
                height: '20%',
                backgroundColor: color,
                animation: 'spectro 1.5s infinite',
                animationDelay: `${index * 0.1}s`
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Spectrogram;
