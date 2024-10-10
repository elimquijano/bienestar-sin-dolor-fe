import { Grid, TextField, List, Typography, Box, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { API_HOST, API_URL_TRATAMIENTO } from 'common/common';
import AppContentHeader from 'layout/MainLayout/HeaderContent';

const TratamientoScreen = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [tratamientos, setTratamientos] = useState([]);
  const [filteredTratamientos, setFilteredTratamientos] = useState([]);

  const onChangeSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const listaFiltrada = filtrarLista(tratamientos, query);
    setFilteredTratamientos(listaFiltrada);
  };

  const filtrarLista = (lista, nombre) => {
    return lista.filter((objeto) => objeto.name.toLowerCase().includes(nombre.toLowerCase()));
  };

  useEffect(() => {
    fetch(API_URL_TRATAMIENTO)
      .then((response) => response.json())
      .then((data) => {
        setTratamientos(data?.data);
        setFilteredTratamientos(data?.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Box sx={{ backgroundColor: theme.palette.grey[100], height: '100vh' }}>
      <AppContentHeader />
      <Grid container style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
        <Grid item xs={12}>
          <TextField label="Busca un tratamiento..." variant="outlined" fullWidth onChange={onChangeSearch} value={searchQuery} />
        </Grid>
        <Grid item xs={12}>
          {filteredTratamientos.length > 0 ? (
            <List sx={{ overflowY: 'auto', maxHeight: '80vh' }}>
              {filteredTratamientos.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      padding: '16px'
                    }}
                  >
                    <Card
                      sx={{
                        backgroundColor: theme.palette.background.default,
                        borderRadius: 2
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                        <CardMedia
                          component="img"
                          alt={item.name}
                          image={API_HOST + item.image || ''}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 2
                          }}
                        />
                        <Box sx={{ marginLeft: 1 }}>
                          <Typography variant="h5">{item.name ||''}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Num sesiones: {item.sessions ||''}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {`${item.description?.slice(1, 100)}...`}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button variant="outlined" color="secondary" onClick={() => {}}>
                          Ver Detalles
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => {}}>
                          Comenzar Ahora
                        </Button>
                      </CardActions>
                    </Card>
                  </Box>
                </Box>
              ))}
            </List>
          ) : (
            <Typography align="center" style={{ padding: 12 }}>
              No hay tratamientos disponibles.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TratamientoScreen;
