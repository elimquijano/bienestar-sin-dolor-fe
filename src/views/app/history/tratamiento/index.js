import React from 'react';
import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import AppContentHeader from 'layout/MainLayout/HeaderContent';
import CustomizedTimeline from 'ui-component/timeline/CustomizationTimeline';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router';
import { useState } from 'react';
import { API_URL_TRATAMIENTO, getSession } from 'common/common';
import { useEffect } from 'react';
import { Check } from '@mui/icons-material';

const PlanTratamientoScreen = () => {
  const { id } = useParams(); //tratamiento_user.id
  const theme = useTheme();
  const daysPerweek = JSON.parse(getSession('DAYSWEEK'))?.find((t) => t.tratamiento_user_id == id)?.numberForWeek;
  const [lessons, setLessons] = useState([]);
  const [numIncompleted, setNumIncompleted] = useState(0);
  const [tratamientoGuia, setTratamientoGuia] = useState({});

  useEffect(() => {
    fetch(API_URL_TRATAMIENTO + `user?form_tratamiento_guia_id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        const tratamientoUser = data?.data[0] || {};
        setTratamientoGuia({ ...tratamientoUser, descripcion: 'Ejercicios Fisicos para la Gonartrosis' });
        const improvisado = [
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
        ]
        setLessons(improvisado);
        setNumIncompleted(improvisado.filter((i)=>i.available == false).length);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Box sx={{ backgroundColor: theme.palette.grey[100], height: '100vh' }}>
      <AppContentHeader />
      <Grid container>
        <Grid item xs={12} className="p-4" sx={{ backgroundColor: theme.palette.secondary.main }}>
          <Typography variant="h2" color={theme.palette.background.default} className="py-4">
            {String(tratamientoGuia?.descripcion || '').toUpperCase()}
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
