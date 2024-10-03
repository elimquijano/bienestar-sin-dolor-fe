import React, { useRef, useState, useEffect } from 'react';
import InteractiveMap from './InteractiveMap'; //FUNCTION IMPLEMENT
import SetViewOnClick from './InteractiveMap'; //FUNCTION IMPLEMENT
import DataManagmentTable from './DataManagmentTable';
import { MapContainer, TileLayer, FeatureGroup,Polygon } from 'react-leaflet';
import { API_URL_GEOCERCAS } from 'common/common';
//import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css'; //IMPLEMENNT TOOLS
import './mapa.css';

const Mapa = () => {
  const [mapLayers] = useState([]);
  const [geocercas, setGeocerca] = useState([]);

  useEffect(() => {
    obtenerPosition();
    console.log(mapLayers);
  }, []);
  function obtenerPosition() {
    const requestOptions = {
      method: 'GET'
    };
    fetch(API_URL_GEOCERCAS + 'Position', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setGeocerca(result);
        console.log(result);
      })
      .catch((error) => {
        console.error('Error JOVENN no se encontro:', error);
      });
  }


  const animateRef = useRef(false);

  return (
    <div>
      <DataManagmentTable />
      <br />
      <br />
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} className="mapa">
        <InteractiveMap />
        <SetViewOnClick animateRef={animateRef} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup>
        
          {geocercas.map((geocerca) => (
            <Polygon key={geocerca.nombre} positions={geocerca.positions.map((pos) => [pos.latitud, pos.longitud])} color={geocerca.color} />
          ))}
        </FeatureGroup>
      </MapContainer>
      <pre className="text-left">{JSON.stringify(mapLayers, null, 2)}</pre>
    </div>
  );
};
export default Mapa;
