import { Grid, TextField, Typography, Box, Card, CardMedia, CardContent, CardActions, Button, Chip, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import {
  API_HOST,
  API_URL_ENFERMEDAD,
  API_URL_TRATAMIENTO,
  fetchAPIAsync,
  getSession,
  notificationSwal,
  redirectToRelativePage
} from 'common/common';
import AppContentHeader from 'layout/MainLayout/HeaderContent';
import Logo from '../../../../assets/images/Logo.png';
import CustomCard from 'ui-component/cards/CustomCard';

const EnfermedadesScreen = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [enfermedades, setEnfermedades] = useState([]);
  const [filteredEnfermedades, setFilteredEnfermedades] = useState([]);

  const onChangeSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const listaFiltrada = filtrarLista(enfermedades, query);
    setFilteredEnfermedades(listaFiltrada);
  };

  const filtrarLista = (lista, nombre) => {
    return lista.filter((objeto) => objeto.etiquetas.toLowerCase().includes(nombre.toLowerCase()));
  };

  useEffect(() => {
    fetch(API_URL_ENFERMEDAD + 'withsintoma')
      .then((response) => response.json())
      .then((data) => {
        setEnfermedades(data);
        setFilteredEnfermedades(data);
      })
      .catch((error) => console.log(error));
  }, []);

  function obtenerFechaActual() {
    const fecha = new Date();
    const anio = fecha.getFullYear(); // Obtener el año
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Obtener el mes (0-11) y agregar un cero a la izquierda
    const dia = String(fecha.getDate()).padStart(2, '0'); // Obtener el día y agregar un cero a la izquierda si es necesario

    return `${anio}-${mes}-${dia}`; // Formato YYYY-MM-DD
  }

  const takeTratamiento = async (enfermedadID) => {
    //buscar tratamiento_guia en bd
    try {
      const result = await fetchAPIAsync(API_URL_TRATAMIENTO + 'guia', { form_enfermedad_id: enfermedadID }, 'GET');
      if (result?.data[0]) {
        const tratamiento_guia_id = result.data[0]?.id;
        const tratamientoUser = await fetchAPIAsync(API_URL_TRATAMIENTO + 'user', { form_tratamiento_guia_id: tratamiento_guia_id }, 'GET');
        if (tratamientoUser?.data[0]) {
          const response = tratamientoUser?.data[0];
          if (getSession('DAYSWEEK') && JSON.parse(getSession('DAYSWEEK'))?.find((t) => t.tratamiento_user_id == response.id)) {
            redirectToRelativePage('/#/tratamientos/' + response.id);
          } else {
            redirectToRelativePage('/#/days-for-week/' + response.id);
          }
        } else {
          //crear un tratamiento usuario
          const data = {
            user_id: getSession('USER_SESSION').id,
            tratamiento_guia_id: tratamiento_guia_id,
            fecha_inicio: obtenerFechaActual()
          };
          const response = await fetchAPIAsync(API_URL_TRATAMIENTO + 'user', data, 'POST');
          if (getSession('DAYSWEEK') && JSON.parse(getSession('DAYSWEEK'))?.find((t) => t.tratamiento_user_id == response.id)) {
            redirectToRelativePage('/#/tratamientos/' + response.id);
          } else {
            redirectToRelativePage('/#/days-for-week/' + response.id);
          }
        }
      } else {
        const newtratamiento = {
          enfermedad_id: enfermedadID,
          descripcion: enfermedades.find((e) => e.id == enfermedadID)?.nombre
        };
        const result = await fetchAPIAsync(API_URL_TRATAMIENTO + 'guia', newtratamiento, 'POST');
        if (result?.id) {
          const tratamiento_guia_id = result?.id;
          //crear un tratamiento usuario
          const data = {
            user_id: getSession('USER_SESSION').id,
            tratamiento_guia_id: tratamiento_guia_id,
            fecha_inicio: obtenerFechaActual()
          };
          const response = await fetchAPIAsync(API_URL_TRATAMIENTO + 'user', data, 'POST');
          if (getSession('DAYSWEEK') && JSON.parse(getSession('DAYSWEEK'))?.find((t) => t.tratamiento_user_id == response.id)) {
            redirectToRelativePage('/#/tratamientos/' + response.id);
          } else {
            redirectToRelativePage('/#/days-for-week/' + response.id);
          }
        }
      }
    } catch (error) {
      notificationSwal('error', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.grey[100], height: '100vh' }}>
      <AppContentHeader style={{ position: 'fixed', width: '100%', zIndex: 1 }} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: '16px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="¿Que se te diagnosticó? Busca aquí..."
              variant="outlined"
              fullWidth
              onChange={onChangeSearch}
              value={searchQuery}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomCard
              imageSrc={Logo}
              message={
                '¡OJO! Si experimentas alguno de los síntomas marcados en rojo, es muy probable que tengas la lesión o condición perteneciente. En ese caso, es recomendable que inicies el tratamiento de inmediato.'
              }
            />
          </Grid>
          <Grid item xs={12}>
            {filteredEnfermedades.length > 0 ? (
              <Grid container spacing={2}>
                {filteredEnfermedades.map((item, index) => {
                  const tags = item?.etiquetas?.split(',') || [];
                  const sintomas = item?.sintomas;
                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 2,
                          minHeight: 450,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                          <CardMedia
                            component="img"
                            alt={item.nombre}
                            image={API_HOST + item?.image || ''}
                            sx={{ width: 50, height: 50, borderRadius: 2 }}
                          />
                          <Box sx={{ marginLeft: 1 }}>
                            <Typography variant="h4">{item?.nombre || ''}</Typography>
                          </Box>
                        </CardContent>
                        <CardContent>
                          <Typography variant="body1" color="secondary" sx={{ marginY: 1, fontWeight: 800 }}>
                            SINTOMAS:
                          </Typography>
                          <ul>
                            {sintomas.map((sintoma, index) => (
                              <li key={index}>
                                <Typography variant="body2" sx={{ marginY: 1, color: `${sintoma.peso > 1 ? 'red' : 'black'}` }}>
                                  {sintoma?.descripcion}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ marginTop: 2, maxWidth: '100%' }}>
                            {tags.map((tag, index) => (
                              <Chip key={index} size="small" label={tag} />
                            ))}
                          </Stack>
                        </CardContent>
                        <CardActions>
                          <Button fullWidth variant="contained" color="secondary" onClick={() => takeTratamiento(item.id)}>
                            Comenzar tratamiento
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Typography align="center" style={{ padding: 12 }}>
                No hay enfermedades disponibles.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EnfermedadesScreen;
