import React from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import { styled } from '@mui/material/styles';

const LessonsPath = ({ lessons }) => {
  const Circle = styled('div')(({ completed }) => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: completed ? '#e0f7fa' : '#f5f5f5',
    border: completed ? '2px solid #00796b' : '2px solid #ccc',
    position: 'relative',
    margin: '0 auto',
    '&:not(:last-child)::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      right: '-20px',
      width: '20px',
      height: '2px',
      backgroundColor: completed ? '#00796b' : '#ccc',
      zIndex: -1
    }
  }));

  return (
    <Box sx={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
      <Stepper activeStep={lessons.findIndex((lesson) => !lesson.completed)} orientation="vertical">
        {lessons.map((lesson, index) => (
          <Step key={index}>
            <StepLabel
              icon={
                <Circle completed={lesson.completed}>
                  {lesson.completed ? <CheckCircleIcon color="primary" /> : <LockIcon color="action" />}
                </Circle>
              }
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="h6" sx={{ textAlign: 'left' }}>
                  {lesson.title}
                </Typography>
                <Typography variant="h6" sx={{ textAlign: 'right' }}>
                  {lesson.completed ? 'Disponible' : 'Bloqueado'}
                </Typography>
              </Box>
            </StepLabel>
            <Button
              variant="contained"
              color="primary"
              disabled={!lesson.completed}
              onClick={() => {
                if (lesson.completed) {
                  // Lógica para continuar con la lección
                  console.log(`Continuar con ${lesson.title}`);
                }
              }}
            >
              {lesson.completed ? 'Continuar' : 'Bloqueado'}
            </Button>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default LessonsPath;
