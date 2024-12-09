import React, { useState } from 'react';
import { TextField, Grid, Paper, Typography } from '@mui/material';
import HistoryCard from 'ui-component/cards/HistoryCard';
import { redirectToRelativePage } from 'common/common';

const buttons = [
  {
    id: 1,
    name: 'Dislocación de Primer Grado',
    percent: 60,
    onPress: () => redirectToRelativePage('/#/tratamientos/1')
  }
];

const TratamientosScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredButtons, setFilteredButtons] = useState(buttons);

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
            No hay mensajes disponibles.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default TratamientosScreen;
