import React, { useEffect, useState } from 'react';
import { TextField, Grid, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  API_HOST,
  API_ROL_WITH_USER,
  API_URL_CONVERSATION,
  fetchAPIAsync,
  getSession,
  postData,
  redirectToRelativePage
} from 'common/common';
import UserInfoCard from 'ui-component/cards/UserInfoCard';
import { Capacitor } from '@capacitor/core';

const EspecialistasListScreen = () => {
  const idRol = 2;
  const tipoConversation = 2; // USER-ESPECIALISTA
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

  const sendMessage = async (receptor_id) => {
    try {
      const data = { emisor_id: getSession('USER_SESSION')?.id, receptor_id: receptor_id };
      const result = await fetchAPIAsync(API_URL_CONVERSATION + 'exist', data, 'GET');
      if (result?.id) {
        redirectToRelativePage(`/#/chat-user/${result?.id}`);
      } else {
        const newConversation = {
          tipo_id: tipoConversation,
          emisor_id: data.emisor_id,
          receptor_id: data.receptor_id
        };

        const response = await postData(API_URL_CONVERSATION + 'bloque', newConversation);
        if (response?.id) {
          redirectToRelativePage(`/#/chat-user/${response?.id}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box style={{ backgroundColor: theme.palette.grey[200], height: '100vh' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Buscar especialistas..." variant="outlined" fullWidth onChange={handleSearchChange} value={searchQuery} />
        </Grid>
        {filteredEspecialist.map((esp, index) => (
          <Grid item xs={12} key={index}>
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
                  <Button variant="contained" color="secondary" onClick={() => sendMessage(esp.id)}>
                    Enviar Mensaje
                  </Button>
                </>
              }
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EspecialistasListScreen;
