import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SET_MENU } from 'store/actions';
import { fetchAPIAsync, notificationSwal, API_URL_TDISPOSITIVOS, getSession } from 'common/common';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import 'leaflet/dist/leaflet.css';
import { MapContainer, LayersControl, TileLayer } from 'react-leaflet';
import { tableCellClasses } from '@mui/material/TableCell';
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Button, InputAdornment, TextField } from '@mui/material';
import { Circle, ExpandLess, ExpandMore, Search } from '@mui/icons-material';
import RotatedMarker from 'ui-component/marker/RotatedMarker';

const columns = [{ id: 'name', label: 'Placa', minWidth: 5, key: 1 }];

export default function VehiculosMapa() {
  const idUser = getSession('USER_ID');
  const [page] = useState(0);
  const [rowsPerPage] = useState(10000);
  const [filteredRows, setFilteredRows] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [vehiculos, setVehiculos] = useState({});
  const [formNameValue, setFormNameValue] = useState('');
  const [vehiculoActual, setVehiculoActual] = useState({});
  const [mapCenter, setMapCenter] = useState([-9.930648, -76.241496]);
  const [mapZoom, setMapZoom] = useState(5);
  const [mapKey, setMapKey] = useState(Date.now());
  const icono = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/809/809998.png',
    iconSize: [35, 35], // Tamaño del icono, puedes ajustarlo según tus necesidades
    iconAnchor: [17, 35], // Punto del icono que corresponderá a la ubicación del marcador
    popupAnchor: [0, -35] // Punto desde el cual se abrirá el popup en relación con iconAnchor
  });
  const { BaseLayer } = LayersControl;

  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: false });
  };

  useEffect(() => {
    handleLeftDrawerToggle();
    SearchFilter(page);
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://159.65.107.11:3050/');

    ws.onopen = () => {
      ws.send('Hello Server!');
    };

    ws.onmessage = (event) => {
      const data = event.data;
      const message = data.toString();
      const object = JSON.parse(message);
      if (object.positions !== undefined && totalItems > 0) {
        const newVehiculos = vehiculos.map((row) => {
          const matchingPosition = object.positions.find((position) => position.deviceId === row.id);
          if (matchingPosition) {
            return { ...row, ...matchingPosition, id: row.id };
          } else {
            return row;
          }
        });
        setVehiculos(newVehiculos);
      }
    };

    return () => {
      ws.close();
    };
  }, [vehiculos]);

  async function SearchFilter(numPage) {
    let filter = {};
    filter.page = numPage + 1;
    filter.paginate = rowsPerPage;
    if (numPage === undefined || numPage === null) {
      filter.page = page + 1;
    }

    if (idUser) {
      filter.user_id = idUser;
    }
    try {
      const result = await fetchAPIAsync(API_URL_TDISPOSITIVOS, filter, 'GET');
      setVehiculos(result?.data);
      setFilteredRows(result?.data);
      setTotalItems(result?.total);
    } catch (error) {
      notificationSwal('error', error);
    }
  }

  function mostrarEnMapa(row) {
    setMapCenter([row.latitude, row.longitude]);
    setMapZoom(18);
    setMapKey(Date.now());
    setVehiculoActual(row);
    setShowInfo(true);
  }

  const handleShowTable = () => {
    setShowTable(showTable ? false : true);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    const listaFiltrada = filtrarLista(vehiculos, value);
    setFormNameValue(value);
    setFilteredRows(listaFiltrada);
  };

  const filtrarLista = (lista, nombre) => {
    return lista.filter((objeto) => objeto.name.toLowerCase().includes(nombre.toLowerCase()));
  };

  const definirColorDeEstado = (estado) => {
    let color = '';
    switch (estado) {
      case 'online':
        color = 'text-success';
        break;
      case 'offline':
        color = 'text-danger';
        break;
      case 'unknown':
        color = 'text-secondary';
        break;

      default:
        break;
    }
    return color;
  };

  return (
    <div className="h-100">
      {totalItems > 0 ? (
        <Paper sx={{ width: '100%', overflow: 'hidden' }} className="p-3 h-100">
          <div style={{ position: 'relative' }} className="h-100">
            <Paper style={{ position: 'absolute', zIndex: 500 }} className="m-2">
              <div className="text-center">
                <Button fullWidth onClick={() => handleShowTable()}>
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
                    value={formNameValue || ''}
                    onChange={handleSearchChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  <TableContainer sx={{ maxHeight: 150 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableBody>
                        {vehiculos
                          .filter((obj) => filteredRows.some((filtro) => filtro.id === obj.id))
                          .map((row, index) => {
                            const tieneCoordenadas = typeof row.latitude === 'number' && typeof row.longitude === 'number';

                            return (
                              <TableRow
                                key={index}
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                onClick={tieneCoordenadas ? () => mostrarEnMapa(row) : () => {}}
                                sx={{ cursor: 'pointer' }}
                              >
                                {columns.map((column, index) => {
                                  const value = row[column.id];
                                  const status = definirColorDeEstado(row['status']);
                                  return (
                                    <TableCell
                                      key={index}
                                      align={column.align}
                                      className="d-flex justify-content-between align-items-center"
                                    >
                                      {column.format && typeof value === 'number' ? column.format(value) : value}
                                      <Circle fontSize="small" sx={{ fontSize: '10px' }} className={status} />
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </Paper>
            <MapContainer
              key={mapKey}
              style={{ minHeight: 500, width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={mapZoom}
              zoomControl={false}
            >
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
              {vehiculos
                .filter((vehiculo) => vehiculo.latitude && vehiculo.longitude)
                .map((vehiculo, index) => {
                  const tieneCoordenadas = typeof vehiculo.latitude === 'number' && typeof vehiculo.longitude === 'number';
                  return (
                    <RotatedMarker
                      key={index}
                      position={[vehiculo.latitude, vehiculo.longitude]}
                      icon={icono}
                      rotationOrigin={'center center'}
                      rotationAngle={vehiculo.course + 180 || 180}
                      eventHandlers={{
                        click: tieneCoordenadas
                          ? () => {
                              setVehiculoActual(vehiculo);
                              setShowInfo(true);
                            }
                          : () => {}
                      }}
                    />
                  );
                })}
            </MapContainer>
            {showInfo &&
              vehiculos
                .filter((obj) => obj.id === vehiculoActual.id)
                .map((vehiculo, index) => {
                  return (
                    <Paper key={index} style={{ position: 'absolute', width: '100%', zIndex: 500, bottom: '0', borderRadius: 0 }}>
                      <div style={{ position: 'relative' }}>
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
                        <div className="row pt-3">
                          <div className="col-md-4">
                            <h6 className="text-center">{vehiculo?.name || 'No especificado'}</h6>
                            <TableContainer>
                              <Table size="small" sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: 'none' } }}>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>Modelo</TableCell>
                                    <TableCell>{vehiculo?.model || 'No especificado'}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Velocidad</TableCell>
                                    <TableCell>{vehiculo?.speed || '0'} Km/h</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Distancia Total</TableCell>
                                    <TableCell>{vehiculo?.distance || '0'} Km</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>
                                      <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${vehiculo.latitude}%2C${vehiculo.longitude}&heading=0`}
                                      >
                                        Ver en Street View
                                      </a>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </div>
                          <div className="col-md-4">
                            <iframe
                              title="Google Street View"
                              style={{ width: '100%', height: '100%', border: '0' }}
                              loading="lazy"
                              allowFullScreen
                              referrerPolicy="no-referrer-when-downgrade"
                              src={`https://www.google.com/maps/embed?pb=!4v1713045861300!6m8!1m7!1sjhqJmDM2qaJ1xLzFZ70V3w!2m2!1d-9.885907245784033!2d-76.20035109839036!3f63.22497578776092!4f0!5f0.7820865974627469`}
                            />
                          </div>
                          <div className="col-md-4">
                            <h6 className="text-center">Alertas</h6>
                            latitud: {vehiculo.latitude}
                            <br />
                            longitud: {vehiculo.longitude}
                          </div>
                        </div>
                      </div>
                    </Paper>
                  );
                })}
          </div>
        </Paper>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }} className="p-3">
          <div className="alert alert-warning" role="alert">
            No se encontraron resultados.
          </div>
        </Paper>
      )}
    </div>
  );
}
