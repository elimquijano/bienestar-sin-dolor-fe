import React, { useEffect, useState } from 'react';
import { TextField, Grid, Paper, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { API_HOST, API_ROL_WITH_USER, redirectToRelativePage } from 'common/common';
import UserInfoCard from 'ui-component/cards/UserInfoCard';
import AppContentHeader from 'layout/MainLayout/HeaderContent';
import { Capacitor } from '@capacitor/core';

const EspecialistasListScreen = () => {
  const idRol = 2;
  const theme = useTheme();
  const [especialistas, setEspecialistas] = useState([]);
  const [filteredEspecialist, setFilteredEspecialist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(API_ROL_WITH_USER + `/${idRol}`)
      .then((response) => response.json())
      .then((data) => {
        setEspecialistas(data?.users);
        setFilteredEspecialist(data?.users);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const listaFiltrada = filtrarLista(especialistas, query);
    setFilteredEspecialist(listaFiltrada);
  };

  const filtrarLista = (lista, nombre) => {
    return lista.filter((objeto) => objeto.firstname.toLowerCase().includes(nombre.toLowerCase()));
  };

  return (
    <Box style={{ backgroundColor: theme.palette.grey[200], height: '100vh' }}>
      <AppContentHeader />
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TextField label="Buscar especialistas..." variant="outlined" fullWidth onChange={handleSearchChange} value={searchQuery} />
        </Grid>
        {filteredEspecialist.map((esp, index) => (
          <Grid item xs={12} key={index}>
            <Paper elevation={3}>
              <UserInfoCard
                title={`${esp.firstname} ${esp.lastname}`}
                subtitle={esp.address}
                content={esp.email}
                imagepath={API_HOST + esp.image}
                buttons={
                  <>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => redirectToRelativePage(`/#/${Capacitor.isNativePlatform() ? 'map/' : 'map-web/'}${esp.id}`)}
                    >
                      Ver en Mapa
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => redirectToRelativePage(`/#/${Capacitor.isNativePlatform() ? 'map/' : 'map-web/'}${esp.id}`)}
                    >
                      Enviar Mensaje
                    </Button>
                  </>
                }
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EspecialistasListScreen;
