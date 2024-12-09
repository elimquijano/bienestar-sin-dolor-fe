import React from 'react';
import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import AppContentHeader from 'layout/MainLayout/HeaderContent';
import CustomizedTimeline from 'ui-component/timeline/CustomizationTimeline';
import { Check } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const PlanTratamientoScreen = () => {
  const theme = useTheme();
  const daysPerweek = 4;
  const lessons = [
    { id: 1, name: 'DIA 1', icon: <Check />, available: true, completed: false },
    { id: 2, name: 'DIA 2', icon: <Check />, available: false, completed: false },
    { id: 3, name: 'DIA 3', icon: <Check />, available: false, completed: false },
    { id: 4, name: 'DIA 4', icon: <Check />, available: false, completed: false },
    { id: 5, name: 'DIA 5', icon: <Check />, available: false, completed: false },
    { id: 5, name: 'DIA 5', icon: <Check />, available: false, completed: false },
    { id: 5, name: 'DIA 5', icon: <Check />, available: false, completed: false },
    { id: 5, name: 'DIA 5', icon: <Check />, available: false, completed: false },
    { id: 5, name: 'DIA 5', icon: <Check />, available: false, completed: false },
    { id: 5, name: 'DIA 5', icon: <Check />, available: false, completed: false },
    { id: 5, name: 'DIA 5', icon: <Check />, available: false, completed: false },
    { id: 5, name: 'DIA 5', icon: <Check />, available: false, completed: false },
    { id: 5, name: 'DIA 5', icon: <Check />, available: false, completed: false }
  ];
  const numIncompleted = lessons.filter((obj) => !obj.completed).length;
  return (
    <Box sx={{ backgroundColor: theme.palette.grey[100], height: '100vh' }}>
      <AppContentHeader />
      <Grid container>
        <Grid item xs={12} className="p-4" sx={{ backgroundColor: theme.palette.secondary.main }}>
          <Typography variant="h2" color={theme.palette.background.default} className="py-4">
            Dislocación de Primer Grado
          </Typography>
          <Typography variant="" color={theme.palette.background.default} className="py-2">
            {numIncompleted} dias restantes
          </Typography>
          <Box sx={{ width: '100%' }}>
            <LinearProgress variant="determinate" value={75} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <CustomizedTimeline items={lessons} daysPerWeek={daysPerweek} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlanTratamientoScreen;
