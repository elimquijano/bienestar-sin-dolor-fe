import { Grid, TextField, Typography, Box, Card, CardMedia, CardContent, CardActions, Button, Chip, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { API_HOST, API_URL_ENFERMEDAD } from 'common/common';
import AppContentHeader from 'layout/MainLayout/HeaderContent';

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
                                <Typography variant="body2" sx={{ marginY: 1 }}>
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
                          <Button fullWidth variant="contained" color="secondary" onClick={() => {}}>
                            Ver Tratamientos
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
