import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import 'leaflet/dist/leaflet.css';
import { MapContainer, LayersControl, TileLayer, Marker } from 'react-leaflet';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  InputAdornment,
  TextField,
  Grid,
  Typography,
  Box
} from '@mui/material';
import { ExpandLess, ExpandMore, LocationOn, Person, Phone, Search } from '@mui/icons-material';
import RotatedMarker from 'ui-component/marker/RotatedMarker';
import { useEffect } from 'react';
import AppContentHeader from 'layout/AppLayout/HeaderContent';
import { API_HOST, getSession, notificationSwal } from 'common/common';
import IconCenter from '../../../../assets/images/icons/hospital.png';

const IconPosition = API_HOST + getSession('USER_AVATAR');

export default function ContactoScreen() {
  const theme = useTheme();
  const [location, setLocation] = useState(null);
  const [filteredRows, setFilteredRows] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [formNameValue, setFormNameValue] = useState('');
  const [actualItem, setActualItem] = useState({});
  const [mapCenter, setMapCenter] = useState([-9.930648, -76.241496]);
  const [mapZoom, setMapZoom] = useState(7);
  const [mapKey, setMapKey] = useState(Date.now());

  const icono = new L.Icon({
    iconUrl: IconCenter,
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
  });

  const iconPosition = new L.Icon({
    iconUrl: IconPosition,
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
  });

  const { BaseLayer } = LayersControl;

  function mostrarEnMapa(row) {
    handleShowTable();
    setMapCenter([row.latitude, row.longitude]);
    setMapZoom(18);
    setMapKey(Date.now());
    setActualItem(row);
    setShowInfo(true);
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

  const getLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      setLocation(position.coords);
      setMapCenter([position.coords.latitude, position.coords.longitude]);
      setMapZoom(12);
      setMapKey(Date.now());
    } catch (err) {
      notificationSwal('error', 'No se pudo obtener la ubicación');
    }
  };

  const updateLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      setLocation(position.coords);
    } catch (err) {
      notificationSwal('error', 'No se pudo obtener la ubicación, activa el GPS');
    }
  };

  useEffect(() => {
    setFilteredRows(centros);
    // Obtener la ubicación inmediatamente al montar el componente
    getLocation();

    // Configurar el intervalo para actualizar cada 3 segundos
    const intervalId = setInterval(() => {
      updateLocation();
    }, 5000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[200],
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <AppContentHeader title={'Cercanos a tu ubicación'} isDark={false} />
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        {location != null ? (
          <>
            <Paper style={{ position: 'absolute', zIndex: 500 }} className="m-2">
              <div className="text-center">
                <Button fullWidth onClick={handleShowTable}>
                  {showTable ? <ExpandLess /> : <ExpandMore />}
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
                          .filter((obj) => filteredRows.some((filtro) => filtro.id == obj.id))
                          .map((row, index) => {
                            const tieneCoordenadas = typeof row.latitude === 'number' && typeof row.longitude === 'number';
                            return (
                              <TableRow
                                key={index}
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                onClick={tieneCoordenadas ? () => mostrarEnMapa(row) : undefined}
                                sx={{ cursor: 'pointer' }}
                              >
                                <TableCell key={index} align={'left'} className="d-flex justify-content-between align-items-center">
                                  {row['name']}
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
            <MapContainer key={mapKey} style={{ width: '100%', height: '100%' }} center={mapCenter} zoom={mapZoom} zoomControl={false}>
              <LayersControl position="topright">
                <BaseLayer checked name="OpenStreetMap">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </BaseLayer>
                <BaseLayer name="Google">
                  <TileLayer
                    url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    maxZoom={20}
                  />
                </BaseLayer>
                <BaseLayer name="Google Satélite">
                  <TileLayer
                    url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    maxZoom={20}
                  />
                </BaseLayer>
                <BaseLayer name="Google Híbrido">
                  <TileLayer
                    url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    maxZoom={20}
                  />
                </BaseLayer>
                <BaseLayer name="Google Relieve">
                  <TileLayer
                    url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    maxZoom={20}
                  />
                </BaseLayer>
              </LayersControl>
              {centros
                .filter((centro) => centro.latitude && centro.longitude)
                .map((centro, index) => {
                  const tieneCoordenadas = typeof centro.latitude === 'number' && typeof centro.longitude === 'number';
                  return (
                    <RotatedMarker
                      key={index}
                      position={[centro.latitude, centro.longitude]}
                      icon={icono}
                      rotationOrigin={'center center'}
                      rotationAngle={centro?.course + 0 || 0}
                      eventHandlers={{
                        click: tieneCoordenadas
                          ? () => {
                              setActualItem(centro);
                              setShowInfo(true);
                            }
                          : undefined
                      }}
                    />
                  );
                })}
              {location && <Marker position={[location?.latitude, location?.longitude]} icon={iconPosition} />}
            </MapContainer>
            {showInfo &&
              centros
                .filter((obj) => obj.id === actualItem.id)
                .map((centro, index) => {
                  return (
                    <Paper key={index} style={{ position: 'absolute', width: '100%', zIndex: 500, bottom: '0', borderRadius: 0 }}>
                      <Grid container direction="column" alignItems="center" style={{ position: 'relative' }}>
                        <Paper
                          style={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translate(-50%, -75%)',
                            zIndex: 500
                          }}
                        >
                          <Button fullWidth onClick={() => setShowInfo(false)}>
                            <ExpandMore />
                          </Button>
                        </Paper>
                        <Grid item className="p-3">
                          <Typography variant="h4" align="center">
                            {centro?.name || 'No especificado'}
                          </Typography>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={4}>
                              <img src={centro?.logo} alt={centro?.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                            </Grid>
                            <Grid item xs={8}>
                              <Grid container direction="column">
                                <Grid item>
                                  <Typography variant="body2">
                                    <LocationOn /> {centro.address}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant="body2">
                                    <Person /> {centro.responsbale}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant="body2">
                                    <Phone /> {centro.phone}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  );
                })}
          </>
        ) : (
          <Paper sx={{ width: '100%', overflow: 'hidden', height: '100%' }} className="p-3">
            <div className="alert alert-warning" role="alert">
              No se pudo obtener la ubicación. Asegúrate de que los servicios de ubicación estén activados y que hayas concedido los
              permisos necesarios.
            </div>
          </Paper>
        )}
      </div>
    </Box>
  );
}
