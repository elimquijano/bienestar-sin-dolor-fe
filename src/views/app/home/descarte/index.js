import { Grid, TextField, List, Typography, Box, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { API_HOST } from 'common/common';
import AppContentHeader from 'layout/MainLayout/HeaderContent';

const Logo = API_HOST + 'images/profiles/default.png';

const TratamientoScreen = () => {
  const tratamientos = [
    {
      id: '1',
      name: 'Terapia Manual',
      sessions: '10',
      description:
        'La terapia manual es una técnica que utiliza las manos para aliviar el dolor, mejorar la movilidad y facilitar la recuperación de lesiones. Se enfoca en manipular los tejidos blandos y las articulaciones para restaurar la función y reducir la tensión.',
      image: Logo
    }
  ];

  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState(tratamientos);

  const onChangeSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const listaFiltrada = filtrarLista(tratamientos, query);
    setFilteredMessages(listaFiltrada);
  };

  const filtrarLista = (lista, nombre) => {
    return lista.filter((objeto) => objeto.name.toLowerCase().includes(nombre.toLowerCase()));
  };

  return (
    <>
      <AppContentHeader />
      <Grid container style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
        <Grid item xs={12}>
          <TextField label="Busca un mensaje..." variant="outlined" fullWidth onChange={onChangeSearch} value={searchQuery} />
        </Grid>
        <Grid item xs={12}>
          {filteredMessages.length > 0 ? (
            <List sx={{ overflowY: 'auto', maxHeight: '72vh' }}>
              {filteredMessages.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    backgroundColor: theme.palette.grey[100],
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
                        marginBottom: 2, // Equivale a 16px
                        backgroundColor: theme.palette.background.default,
                        borderRadius: 2 // Equivale a 8px
                      }}
                    >
                      <CardMedia
                        component="img"
                        alt={item.name}
                        image={item.image}
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 2 // Equivale a 8px
                        }}
                      />
                      <CardContent>
                        <Typography variant="h5">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Num sesiones: {item.sessions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button variant="contained" onClick={() => {}}>
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
              No hay mensajes disponibles.
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default TratamientoScreen;
