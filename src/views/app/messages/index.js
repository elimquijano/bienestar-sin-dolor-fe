import { Grid, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider, Stack, Badge } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { API_HOST } from 'common/common';

const Logo = API_HOST + 'images/profiles/default.png';

const MessageScreen = () => {
  const messages = [
    {
      profileImage: Logo,
      name: 'John Doe',
      previousMessage: 'Hola, ¿cómo estás?',
      timestamp: '10:30 AM',
      isRead: false
    },
    {
      profileImage: Logo,
      name: 'Johan Noreña',
      previousMessage: 'Hola, ¿cómo estás?',
      timestamp: '10:30 AM',
      isRead: true
    },
    {
      profileImage: Logo,
      name: 'Jordan',
      previousMessage: 'Hola, ¿cómo estás?',
      timestamp: '10:30 AM',
      isRead: true
    }
  ];

  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState(messages);

  const onChangeSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const listaFiltrada = filtrarLista(messages, query);
    setFilteredMessages(listaFiltrada);
  };

  const filtrarLista = (lista, nombre) => {
    return lista.filter((objeto) => objeto.name.toLowerCase().includes(nombre.toLowerCase()));
  };

  return (
    <Grid container style={{ display: 'flex', flexDirection: 'column' }}>
      <Grid item xs={12}>
        <TextField label="Busca un mensaje..." variant="outlined" fullWidth onChange={onChangeSearch} value={searchQuery} />
      </Grid>
      <Grid item xs={12}>
        {filteredMessages.length > 0 ? (
          <List sx={{ overflowY: 'auto', maxHeight: '72vh' }}>
            {filteredMessages.map((item, index) => (
              <Stack key={index}>
                <ListItem
                  button
                  onClick={() => console.log('Pressed')}
                  style={{
                    padding: 16,
                    backgroundColor: item.isRead ? theme.palette.grey[100] : theme.palette.grey[300]
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={item.profileImage} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" justifyContent="space-between">
                        <Typography style={{ fontWeight: 900 }}>{item.name}</Typography>
                        <Badge badgeContent={4} color="secondary" sx={{ zIndex: 0 }} />
                      </Stack>
                    }
                    secondary={
                      <Stack direction="row" justifyContent="space-between">
                        <Typography>{item.previousMessage}</Typography>
                        <Typography style={{ color: theme.palette.secondary.main }}>{item.timestamp}</Typography>
                      </Stack>
                    }
                  />
                </ListItem>
                <Divider />
              </Stack>
            ))}
          </List>
        ) : (
          <Typography align="center" style={{ padding: 12 }}>
            No hay mensajes disponibles.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default MessageScreen;
