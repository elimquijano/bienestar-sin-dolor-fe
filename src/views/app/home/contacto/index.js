import React, { useState } from 'react';
import { TextField, Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HistoryCard from 'ui-component/cards/HistoryCard';
import { redirectToRelativePage } from 'common/common';

const buttons = [
  {
    id: 1,
    name: 'Dislocación de Primer Grado',
    percent: 60,
    onPress: () => redirectToRelativePage('/#/my-lesson/1')
  },
  {
    id: 2,
    name: 'Dislocación de la Pierna',
    percent: 25,
    onPress: () => redirectToRelativePage('/#/my-lesson/1')
  }
];

const EspecialistasListScreen = () => {
  const theme = useTheme(); // Usar el tema definido
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
    <div style={{ backgroundColor: theme.palette.grey[200], minHeight: '100vh', width: '100vw', padding: 12 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Buscar..." variant="outlined" fullWidth onChange={handleSearchChange} value={searchQuery} />
        </Grid>
        {filteredButtons.map((b) => (
          <Grid item xs={6} sm={6} md={4} key={b.id}>
            <Paper elevation={3} style={{ padding: 16 }}>
              <HistoryCard name={b.name} percent={b.percent} onPress={b.onPress} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default EspecialistasListScreen;
