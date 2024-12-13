import { Box, Button, Grid, Typography } from '@mui/material';
import { createSession, getSession, redirectToRelativePage } from 'common/common';
import AppContentHeader from 'layout/MainLayout/HeaderContent';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useTheme } from '@mui/material/styles';

const DaysForWeekend = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [numberForWeek, setNumberForWeek] = useState(4);
  const daysWeekButtons = [
    { label: '1', onClick: () => setNumberForWeek(1) },
    { label: '2', onClick: () => setNumberForWeek(2) },
    { label: '3', onClick: () => setNumberForWeek(3) },
    { label: '4', onClick: () => setNumberForWeek(4) },
    { label: '5', onClick: () => setNumberForWeek(5) },
    { label: '6', onClick: () => setNumberForWeek(6) },
    { label: '7', onClick: () => setNumberForWeek(7) }
  ];
  const handleSubmit = () => {
    const days = getSession('DAYSWEEK') || [];
    console.log(days);

    const matchTratamiento = days?.filter((f) => f.tratamiento_user_id !== id);
    createSession('DAYSWEEK', JSON.stringify([...matchTratamiento, { tratamiento_user_id: id, numberForWeek: numberForWeek }]));
    redirectToRelativePage('/#/tratamientos/' + id);
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.grey[100], height: '100vh' }}>
      <AppContentHeader />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
        <Grid container sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: '100%' }}>
          <Grid item xs={12} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 4 }} className="text-center">
            <Typography variant="h1">Establece tu objetivo semanal</Typography>
            <Typography variant="body1">Recomendamos al menos 4 sesiones a la semana para obtener mejores resultados.</Typography>
            <Typography variant="body1">Número de sesiones por semana</Typography>
            <Grid
              container
              sx={{
                display: 'flex',
                flexWrap: 'wrap', // Permite que los elementos se envuelvan en la siguiente fila
                justifyContent: 'center', // Centra los elementos en el eje horizontal
                alignItems: 'center',
                gap: 2
              }}
            >
              {daysWeekButtons.map((b, index) => {
                const variant = index + 1 == numberForWeek ? 'contained' : 'outlined';
                const color = index + 1 == numberForWeek ? 'white' : 'black';
                return (
                  <Button key={index} variant={variant} color="secondary" onClick={b.onClick}>
                    <Typography variant="h1" color={color}>
                      {b.label}
                    </Typography>
                  </Button>
                );
              })}
            </Grid>
            <Typography variant="">
              Si está conforme con la cantidad de sesiones por semana pulse SIGUIENTE sino seleccione a libre elección
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="secondary" onClick={handleSubmit}>
              SIGUIENTE
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DaysForWeekend;
