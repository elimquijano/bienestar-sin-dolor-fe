import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SET_MENU } from 'store/actions';
import { fetchAPIAsync, notificationSwal, API_URL_TDISPOSITIVOS, getSession, API_URL_TPOSICIONES } from 'common/common';
import L from 'leaflet';
//import 'leaflet-rotatedmarker';
import 'leaflet/dist/leaflet.css';
import { MapContainer, LayersControl, TileLayer, Marker, Polyline, Polygon, Tooltip } from 'react-leaflet';
import { Paper, Button, Slider, IconButton, Select, MenuItem } from '@mui/material';
import {
  CleaningServices,
  FastForwardRounded,
  FastRewindRounded,
  GetApp,
  PauseRounded,
  PlayArrowRounded,
  Search,
  Tune
} from '@mui/icons-material';
import { exportToExcel } from 'common/MaterialExportToExel';
import { columnsTPositionsList } from 'common/ExportColums';
import RotatedMarker from 'ui-component/marker/RotatedMarker';

export default function RepeticionRuta() {
  const idUser = getSession('USER_ID');
  const [page, setPage] = useState(0);
  const [filteredRows, setFilteredRows] = useState({});
  const [searchFilter, setSearchFilter] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [vehiculos, setVehiculos] = useState({});
  const [posiciones, setPosiciones] = useState([]);
  const [positionActual, setPositionActual] = useState(0);
  const [showForm, setShowForm] = useState(true);
  const [paused, setPaused] = useState(true);
  const [mapCenter, setMapCenter] = useState([-9.930648, -76.241496]);
  const [mapZoom, setMapZoom] = useState(7);
  const [mapKey, setMapKey] = useState(Date.now());
  const { BaseLayer } = LayersControl;
  const icono = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/809/809998.png',
    iconSize: [35, 35], // Tamaño del icono, puedes ajustarlo según tus necesidades
    iconAnchor: [17, 35], // Punto del icono que corresponderá a la ubicación del marcador
    popupAnchor: [0, -35] // Punto desde el cual se abrirá el popup en relación con iconAnchor
  });
  const alertIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/4201/4201973.png',
    iconSize: [35, 35], // Tamaño del icono, puedes ajustarlo según tus necesidades
    iconAnchor: [17, 35], // Punto del icono que corresponderá a la ubicación del marcador
    popupAnchor: [0, -35] // Punto desde el cual se abrirá el popup en relación con iconAnchor
  });

  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: false });
  };

  useEffect(() => {
    handleLeftDrawerToggle();
    fetch(API_URL_TDISPOSITIVOS + '?paginate=10000' + (idUser ? '&user_id=' + idUser : ''))
      .then((response) => response.json())
      .then((data) => setVehiculos(data?.data))
      .catch((error) => console.error('Error en la solicitud de Dispositivos:', error));
  }, []);

  useEffect(() => {
    let intervalId = null;

    if (!paused) {
      intervalId = setInterval(() => {
        setPositionActual((prevPosition) => {
          // Incrementa positionActual hasta un máximo de totalItems - 1
          const nextPosition = prevPosition + 1;
          if (nextPosition == totalItems - 1) {
            setPaused(true);
          }
          return nextPosition < totalItems ? nextPosition : prevPosition;
        });
      }, 500); // Incrementa positionActual cada medio segundo
    }

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId); // Limpia el intervalo cuando paused es true o cuando el componente se desmonta
      }
    };
  }, [paused, totalItems]); // Vuelve a ejecutar useEffect cuando paused o totalItems cambian

  async function SearchFilter(numPage) {
    if (ValidacionItemSave(searchFilter) === false) {
      return;
    }
    let filter = searchFilter;
    filter.page = numPage + 1;
    if (numPage === undefined || numPage === null) {
      filter.page = page + 1;
    }
    try {
      const result = await fetchAPIAsync(API_URL_TPOSICIONES, filter, 'GET');
      setPosiciones(result?.data.map((row) => [row.latitude, row.longitude]));
      setFilteredRows(result?.data);
      setTotalItems(result?.total);
      setMapCenter([result?.data[positionActual].latitude, result?.data[positionActual].longitude]);
      setMapZoom(14);
      setMapKey(Date.now());
      setShowForm(false);
    } catch (error) {
      notificationSwal('error', error);
    }
  }

  function CleanFilter() {
    setFilteredRows({});
    setSearchFilter({});
    setPage(0);
    setTotalItems(0);
    setTotalItems(0);
    setMapCenter([-9.930648, -76.241496]);
    setMapZoom(7);
    setMapKey(Date.now());
  }

  function ValidacionItemSave(itemSave) {
    let response = true;
    let msgResponse = '';

    if (!itemSave || Object.keys(itemSave).length === 0) {
      msgResponse += '* Debe completar los campos obligatorios.<br>';
      response = false;
    } else {
      if (!itemSave.form_device_id) {
        msgResponse += '* Debe seleccionar un Dispositivo.<br>';
        response = false;
      }
      if (!itemSave.form_desde_fecha) {
        msgResponse += '* Debe agregar la fecha de Inicio.<br>';
        response = false;
      }
      if (!itemSave.form_hasta_fecha) {
        msgResponse += '* Debe agregar la fecha de Fin.<br>';
        response = false;
      }
    }

    if (response === false) {
      notificationSwal('error', msgResponse);
    }

    return response;
  }

  async function ExportFilter() {
    let filter = searchFilter;
    filter.page = 1;
    filter.paginate = 10000;
    try {
      const result = await fetchAPIAsync(API_URL_TPOSICIONES, filter, 'GET');
      if (result && result.data.length > 0) {
        exportToExcel(result.data, columnsTPositionsList, 'Posiciones');
      } else {
        notificationSwal('info', 'No hay datos para exportar.');
      }
    } catch (error) {
      notificationSwal('error', error);
    }
  }

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchFilter((prevSearch) => ({
      ...prevSearch,
      [name]: value
    }));
  };

  const changePosition = (row, index) => {
    setPositionActual(index);
    console.log(row);
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleChangeSliderValue = (event, newValue) => {
    setPositionActual(newValue);
  };

  const previousPosition = () => {
    if (positionActual > 0) {
      setPositionActual(positionActual - 1);
    }
  };

  const nextPosition = () => {
    if (positionActual < totalItems - 1) {
      setPositionActual(positionActual + 1);
    }
  };

  const restarCincoHoras = (fechaString) => {
    let fecha = new Date(fechaString.replace(' ', 'T') + 'Z');
    fecha.setTime(fecha.getTime() - 5 * 60 * 60 * 1000);
    let fechaFormateada = fecha.toISOString().slice(0, 19).replace('T', ' ');

    return fechaFormateada;
  };

  const rotatePoints = (center, angleInDegrees) => {
    const size = 0.0001;
    const points = [
      [center[0] + size, center[1] + size / 2],
      [center[0] + size, center[1] - size / 2],
      [center[0] - size, center[1]]
    ];
    const angleInRadians = (angleInDegrees + 180) * (Math.PI / 180);
    const rotatedPoints = points.map((point) => {
      const xRotated = Math.cos(angleInRadians) * (point[0] - center[0]) - Math.sin(angleInRadians) * (point[1] - center[1]) + center[0];
      const yRotated = Math.sin(angleInRadians) * (point[0] - center[0]) + Math.cos(angleInRadians) * (point[1] - center[1]) + center[1];

      return [xRotated, yRotated];
    });

    return rotatedPoints;
  };

  return (
    <div className="h-100">
      <Paper sx={{ width: '100%', overflow: 'hidden' }} className="p-3 h-100">
        <div style={{ position: 'relative' }} className="h-100">
          <Paper style={{ position: 'absolute', zIndex: 500 }} className="m-2">
            {showForm ? (
              <div className="p-3">
                <div className="form">
                  <div className="form-group">
                    <label htmlFor="Id_compani">Dispositivo(*):</label>
                    <Select
                      id="form_device_id"
                      name="form_device_id"
                      value={searchFilter.form_device_id || '0'}
                      onChange={handleSearchChange}
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="0">
                        <em>Seleccione un Dispositivo</em>
                      </MenuItem>
                      {vehiculos.length > 0 &&
                        vehiculos.map((vehiculo, index) => {
                          return (
                            <MenuItem key={index} value={vehiculo.id}>
                              <em>{vehiculo.name}</em>
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="form_desde_fecha">Desde(*):</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="form_desde_fecha"
                      id="form_desde_fecha"
                      onChange={handleSearchChange}
                      value={searchFilter.form_desde_fecha || ''}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form_hasta_fecha">Hasta(*):</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="form_hasta_fecha"
                      id="form_hasta_fecha"
                      onChange={handleSearchChange}
                      value={searchFilter.form_hasta_fecha || ''}
                    />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-success w-100 mb-1" onClick={() => SearchFilter()}>
                      <Search /> BUSCAR
                    </button>
                    <button className="btn btn-danger w-100 mb-1" onClick={CleanFilter}>
                      <CleaningServices />
                      LIMPIAR
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <Button onClick={handleShowForm}>
                    <Tune />
                  </Button>
                  <h6 className="text-center">{filteredRows[positionActual]?.name || ''}</h6>
                  <Button onClick={ExportFilter}>
                    <GetApp />
                  </Button>
                </div>
                <Slider value={positionActual} onChange={handleChangeSliderValue} min={0} max={totalItems - 1} />
                <div className="g-grid">
                  <div className="text-center">
                    {positionActual + 1}/{totalItems}
                  </div>
                  <div className="text-center">
                    <IconButton onClick={previousPosition} disabled={positionActual == 0}>
                      <FastRewindRounded />
                    </IconButton>
                    <IconButton onClick={() => setPaused(!paused)} disabled={positionActual === totalItems - 1}>
                      {paused ? <PlayArrowRounded /> : <PauseRounded />}
                    </IconButton>
                    <IconButton onClick={nextPosition} disabled={positionActual === totalItems - 1}>
                      <FastForwardRounded />
                    </IconButton>
                  </div>
                  <div className="text-center">{restarCincoHoras(filteredRows[positionActual]?.devicetime) || ''}</div>
                </div>
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
              <BaseLayer checked name="Carto">
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              </BaseLayer>
              <BaseLayer name="OpenStreetMap">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </BaseLayer>
              <BaseLayer name="Google">
                <TileLayer url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" subdomains={['mt0', 'mt1', 'mt2', 'mt3']} maxZoom={20} />
              </BaseLayer>
              <BaseLayer name="Google Satélite">
                <TileLayer url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" subdomains={['mt0', 'mt1', 'mt2', 'mt3']} maxZoom={20} />
              </BaseLayer>
              <BaseLayer name="Google Híbrido">
                <TileLayer
                  url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                  subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                  maxZoom={20}
                />
              </BaseLayer>
              <BaseLayer name="Google Relieve">
                <TileLayer url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" subdomains={['mt0', 'mt1', 'mt2', 'mt3']} maxZoom={20} />
              </BaseLayer>
            </LayersControl>
            {totalItems > 0 ? (
              <>
                {filteredRows.map((position, index) => {
                  const triangle = rotatePoints([position?.latitude, position?.longitude], position?.course);
                  const tieneAlerta = position?.type !== null && position?.alert !== null;
                  return (
                    <React.Fragment key={index}>
                      <Polygon
                        positions={triangle}
                        color="#39B2CF"
                        fillColor="#39B2CF"
                        fillOpacity={1}
                        eventHandlers={{ click: () => changePosition(position, index) }}
                      />
                      {tieneAlerta && <Marker position={[position?.latitude, position?.longitude]} icon={alertIcon} />}
                    </React.Fragment>
                  );
                })}
                <RotatedMarker
                  position={[filteredRows[positionActual]?.latitude, filteredRows[positionActual]?.longitude]}
                  icon={icono}
                  rotationOrigin={'center center'}
                  rotationAngle={filteredRows[positionActual]?.course + 180 || 180}
                >
                  <Tooltip permanent direction="top" offset={[0, -20]} opacity={0.6}>
                    {restarCincoHoras(filteredRows[positionActual]?.devicetime) || ''}
                  </Tooltip>
                </RotatedMarker>
                <Polyline positions={posiciones} color="#39B2CF" />
              </>
            ) : (
              <div className="alert alert-warning" role="alert">
                No se encontraron resultados.
              </div>
            )}
          </MapContainer>
        </div>
      </Paper>
    </div>
  );
}
