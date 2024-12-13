import React, { useState } from 'react';
import { TextField, Grid, Paper, Typography } from '@mui/material';
import HistoryCard from 'ui-component/cards/HistoryCard';
import { API_URL_TRATAMIENTO, getSession, redirectToRelativePage } from 'common/common';
import { useEffect } from 'react';

const TratamientosScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [buttons, setButtons] = useState([]);
  const [filteredButtons, setFilteredButtons] = useState([]);

  useEffect(() => {
    fetch(API_URL_TRATAMIENTO + `user?form_user_id=${getSession('USER_SESSION')?.id}`)
      .then((response) => response.json())
      .then((data) => {
        const tratamientos = data?.data || [];
        const mapeo = tratamientos?.map((t) => {
          return {
            id: t.id,
            name: 'Ejercicios Fisicos para la Gonartrosis',
            percent: t.progreso_total,
            onPress: () => redirectToRelativePage('/#/tratamientos/' + t.id)
          };
        });
        setButtons(mapeo);
        setFilteredButtons(mapeo);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const listaFiltrada = filtrarLista(buttons, query);
    setFilteredButtons(listaFiltrada);
  };

  const filtrarLista = (lista, nombre) => {
    return lista.filter((objeto) => objeto.name.toLowerCase().includes(nombre.toLowerCase()));
  };

  return (
    <Grid container style={{ display: 'flex', flexDirection: 'column' }}>
      <Grid item xs={12}>
        <TextField label="Buscar..." variant="outlined" fullWidth onChange={handleSearchChange} value={searchQuery} />
      </Grid>
      <Grid item xs={12}>
        {filteredButtons.length > 0 ? (
          <Grid container sx={{ overflowY: 'auto', maxHeight: '72vh' }}>
            {filteredButtons.map((b, index) => (
              <Grid item xs={6} sm={6} md={4} key={index}>
                <Paper elevation={3} style={{ padding: 8, margin: 8 }}>
                  <HistoryCard name={b.name} percent={b.percent} onPress={b.onPress} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography align="center" style={{ padding: 12 }}>
            No hay tratamientos en proceso.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default TratamientosScreen;
