import React from 'react';
import { Box } from '@mui/material';
import LessonsPath from 'ui-component/route';
import { useTheme } from '@emotion/react';
import AppContentHeader from 'layout/MainLayout/HeaderContent';

const LessonScreen = () => {
  const theme = useTheme();
  const lessons = [
    { id: 1, title: 'Lección 1', completed: true },
    { id: 2, title: 'Lección 2', completed: false },
    { id: 3, title: 'Lección 3', completed: false },
    { id: 4, title: 'Lección 4', completed: true },
    { id: 5, title: 'Lección 5', completed: false }
  ];
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[200],
        height: '100%',
        width: '100%'
      }}
    >
      <AppContentHeader />
      <LessonsPath lessons={lessons} />
    </Box>
  );
};

export default LessonScreen;
