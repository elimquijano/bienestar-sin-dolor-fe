import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Button, InputAdornment, TextField, Grid } from '@mui/material';
import { ExpandLess, ExpandMore, MyLocation, Search } from '@mui/icons-material';
import { API_HOST, API_URL_ESPECIALISTAS, getSession, notificationSwal } from 'common/common';
import IconCenter from '../../../assets/images/icons/hospital.png';
import { Geolocation } from '@capacitor/geolocation'; // Importa la API de Geolocalización de Capacitor

const IconPosition = getSession('USER_SESSION') ? API_HOST + getSession('USER_SESSION').image : '';

const MarkerCustom = ({ item, permanent = false }) => {
  const theme = useTheme();
  const [showTooltip, setShowTooltip] = useState(permanent);
  const location = JSON.parse(item?.location);
  const icono = new L.Icon({
    iconUrl: IconCenter,
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
  });

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={icono}
      eventHandlers={{
        click: () => setShowTooltip((prev) => !prev)
      }}
    >
      {showTooltip && (
        <Tooltip direction="top" offset={[0, -42]} opacity={0.8} permanent>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={API_HOST + item?.image || ''} alt="" style={{ width: '80px', height: '80px', margin: '0.4rem' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: '1 0 auto', padding: '0' }}>
                <h6 style={{ fontWeight: 800, margin: 0 }}>
                  {item?.firstname} {item?.lastname}
                </h6>
                <p style={{ color: 'text.secondary' }}>{item?.address || ''}</p>
                <div style={{ fontWeight: 600 }}>
                  <div style={{ color: 'text.secondary' }}>
                    <span style={{ fontSize: '12px' }}>&#64;</span> {item?.email || ''}
                  </div>
                  <div style={{ color: 'text.secondary' }}>
                    <span style={{ fontSize: '12px' }}>&#9742;</span> {item?.phone || ''}
                  </div>
                </div>
                <div>
                  <button
                    style={{
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.background.paper,
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      fontWeight: 600
                    }}
                    onClick={() => console.log(item.id)}
                  >
                    Enviar mensaje
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Tooltip>
      )}
    </Marker>
  );
};

export default function MapNativeScreen() {
  const [location, setLocation] = useState(null);
  const [centros, setCentros] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [formNameValue, setFormNameValue] = useState('');
  const [mapCenter, setMapCenter] = useState([-9.930648, -76.241496]);
  const [mapZoom, setMapZoom] = useState(7);
  const [mapKey, setMapKey] = useState(Date.now());
  const [positionWatcher, setPositionWatcher] = useState(null);

  const iconPosition = new L.Icon({
    iconUrl: IconPosition,
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
  });

  function mostrarEnMapa(row) {
    const location = JSON.parse(row.location);
    setMapCenter([location.latitude, location.longitude]);
    setMapZoom(18);
    setMapKey(Date.now());
  }

  const handleShowTable = () => {
    setShowTable((prev) => !prev);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    const listaFiltrada = filtrarLista(centros, value);
    setFormNameValue(value);
    setFilteredRows(listaFiltrada);
  };

  const filtrarLista = (lista, nombre) => {
    return lista.filter((objeto) => objeto.name.toLowerCase().includes(nombre.toLowerCase()));
  };

  const startWatchingLocation = async () => {
    try {
      // Opciones para el seguimiento de la posición
      const options = {
        enableHighAccuracy: true, // Usar GPS para mayor precisión
        timeout: 10000, // Tiempo máximo para obtener la posición (en milisegundos)
        maximumAge: 0 // No usar una posición en caché
      };

      // Iniciar el seguimiento de la posición
      const watcherId = await Geolocation.watchPosition(options, (position, err) => {
        if (err) {
          notificationSwal(
            'error',
            `No se pudo obtener la ubicación: ${err.message == 'location disabled' ? 'Activa tu GPS' : err.message}`
          );
          return;
        }

        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      });

      // Guardar el ID del watcher en el estado
      setPositionWatcher(watcherId);
    } catch (error) {
      notificationSwal('error', `Error al iniciar el seguimiento de la ubicación: ${error.message}`);
    }
  };

  const getLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition(); // Usamos Geolocation de Capacitor
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      setMapCenter([latitude, longitude]);
      setMapZoom(12);
      setMapKey(Date.now());
      startWatchingLocation();
    } catch (error) {
      notificationSwal(
        'error',
        `No se pudo obtener la ubicación: ${error.message == 'location disabled' ? 'Activa tu GPS' : error.message}`
      );
    }
  };

  useEffect(() => {
    fetch(API_URL_ESPECIALISTAS + 'all')
      .then((response) => response.json())
      .then((data) => {
        setCentros(data);
        setFilteredRows(data);
      })
      .catch((error) => console.log('Error en obtener especialistas: ' + error));

    return () => {
      if (positionWatcher) {
        Geolocation.clearWatch({ id: positionWatcher });
      }
    };
  }, []);

  return (
    <Grid container sx={{ height: '90%', width: '100%' }}>
      <Paper sx={{ position: 'relative', height: '100%', width: '100%', padding: 1 }}>
        <Paper style={{ position: 'absolute', zIndex: 500 }} className="m-2">
          <div className="text-center">
            <Button fullWidth onClick={handleShowTable}>
              {showTable ? <ExpandLess color="secondary" /> : <ExpandMore color="secondary" />}
            </Button>
          </div>
          {showTable && (
            <div className="p-3">
              <TextField
                id="form_name"
                name="form_name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
                value={formNameValue}
                onChange={handleSearchChange}
                variant="outlined"
                size="small"
              />
              <TableContainer sx={{ maxHeight: 150 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableBody>
                    {centros
                      .filter((obj) => filteredRows.some((filtro) => filtro.id === obj.id))
                      .map((row, index) => {
                        const tieneCoordenadas = row.location !== null;
                        return (
                          <TableRow
                            key={index}
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            onClick={
                              tieneCoordenadas
                                ? () => {
                                    handleShowTable();
                                    mostrarEnMapa(row);
                                  }
                                : undefined
                            }
                            sx={{ cursor: 'pointer' }}
                          >
                            <TableCell key={index} align={'left'} className="d-flex justify-content-between align-items-center">
                              {`${row['firstname']} ${row['lastname']}`}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </Paper>
        <Paper style={{ position: 'absolute', right: 0, bottom: 16, zIndex: 500 }} className="m-2">
          <div className="text-center">
            <Button fullWidth onClick={getLocation}>
              <MyLocation color="secondary" />
            </Button>
          </div>
        </Paper>
        <MapContainer key={mapKey} style={{ width: '100%', height: '100%' }} center={mapCenter} zoom={mapZoom} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {centros
            .filter((centro) => centro.location)
            .map((centro, index) => {
              const isView = centro.id == id;
              return <MarkerCustom key={index} item={centro} permanent={isView} />;
            })}
          {location && (
            <Marker position={[location.latitude, location.longitude]} icon={iconPosition}>
              <Tooltip permanent direction="top" offset={[0, -30]} opacity={0.6}>
                Estás Aquí
              </Tooltip>
            </Marker>
          )}
        </MapContainer>
      </Paper>
    </Grid>
  );
}
