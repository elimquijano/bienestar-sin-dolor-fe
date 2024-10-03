import React, { useRef, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import swalWithBootstrapButtons from 'sweetalert2';
import InteractiveMap from './InteractiveMap';
import SetViewOnClick from './InteractiveMap';
import { MapContainer, TileLayer, FeatureGroup, Polygon } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import './mapa.css';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Link, useParams } from 'react-router-dom';
import { API_URL_GEOCERCAS_UBICACIONES, API_URL_GEOCERCAS, notificationSwal } from 'common/common';
//import { Polygon } from 'react-leaflet';

export default function MapPage() {
  const { id, name } = useParams();
  const [mapLayers, setMaplayers] = useState([]);
  const [geocerca, setGeocerca] = useState([]);

  useEffect(() => {
    obtenerPosition();
    console.log(mapLayers);
  }, []);
  function obtenerPosition() {
    const requestOptions = {
      method: 'GET'
    };
    fetch(API_URL_GEOCERCAS + '/' + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setGeocerca(result);
        console.log(geocerca);
      })
      .catch((error) => {
        console.error('Error JOVENN no se encontro:', error);
      });
  }
  //POST
  async function SaveItem(positions) {
    let newPositions = await convertirDatos(positions);
    console.log(newPositions);
    let itemsPost = {
      id_geocercas: id,
      positions: newPositions
    };

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(itemsPost),
      redirect: 'follow'
    };

    fetch(API_URL_GEOCERCAS_UBICACIONES, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        notificationSwal('success', result.message);
      })
      .catch((error) => {
        notificationSwal('error', 'No se pudo registrar.');
        console.log(error);
      });
  }
  async function convertirDatos(inputs) {
    var resultado = [];
    inputs.forEach(function (input) {
      var lat = input.lat;
      var lng = input.lng;
      resultado.push({ lat: lat, lng: lng });
    });
    return resultado;
  }
  const _onCreate = (e) => {
    const { layerType, layer } = e;
    if (layerType === 'polygon') {
      const { _leaflet_id } = layer;
      SaveItem(layer.getLatLngs()[0]);

      obtenerPosition();
      setMaplayers((layers) => [...layers, { id: _leaflet_id, latLngs: layer.getLatLngs()[0] }]);
    }
  };
  const _onEdited = (e) => {
    const {
      layers: { _layers }
    } = e;

    Object.values(_layers).forEach(({ _leaflet_id, editing }) => {

      if (editing && editing.latlngs && editing.latlngs[0]) {
        UpdateItem(editing.latlngs[0]);
        console.log('Editando la figura con id:', _leaflet_id);
      }
    });
  };

  async function UpdateItem(positions) {
    console.log(positions[0]);
    let newPositions = await convertirDatos(positions[0]);
    console.log(newPositions);
    let itemsPut = {
      id_geocercas: id,
      positions: newPositions
    };
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(itemsPut),
      redirect: 'follow'
    };

    fetch(API_URL_GEOCERCAS_UBICACIONES + '/' + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        notificationSwal('success', result.message);
      })
      .catch((error) => {
        notificationSwal('error', 'No se pudo actualizar.');
        console.log(error);
      });
  }

  //DELETE
  const _onDelete = (e) => {
    console.log(e);
    DeleteItem(layer.getLatLngs()[0]);
    const {
      layers: { _layers }
    } = e;
    async function DeleteItem(id) {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const requestOptions = {
        method: 'DESTROY',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(API_URL_GEOCERCAS_UBICACIONES + '/' + id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          notificationSwal('success', result.message);
        })
        .catch((error) => {
          notificationSwal('error', 'No se pudo eliminar.');
          console.log(error);
        });
    }

    swalWithBootstrapButtons
      .fire({
        title: '¿Estás seguro crack?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Sí, bórralo!',
        cancelButtonText: '¡No, cancela!',
        reverseButtons: true
      })
      .then((result) => {
        if (result.isConfirmed) {
          Object.values(_layers).forEach(({ _leaflet_id }) => {
            setMaplayers((layers) => layers.filter((layer) => layer.id !== _leaflet_id));
          });

          swalWithBootstrapButtons.fire({
            title: '¡Eliminado!',
            text: 'Tu geocerca ha sido eliminada.',
            icon: 'success'
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelado',
            text: 'Tu geocerca está a salvo  :)',
            icon: 'error'
          });
        }
      });
  };

  const animateRef = useRef(false);

  return (
    <div>
      <Link to={'/mapas'} className="btn btn-light m-2">
        <KeyboardArrowLeftIcon /> Retornar
      </Link>{' '}
      <div className="row content">
        <h1>{name + ' =>sss ID: ' + id}</h1>
        <hr></hr>
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} className="mapa">
          <InteractiveMap />
          <SetViewOnClick animateRef={animateRef} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FeatureGroup>
            <EditControl
              position="topleft"
              onCreated={_onCreate}
              onEdited={_onEdited}
              onDeleted={_onDelete}
              draw={{
                rectangle: false,
                polyline: false,
                circle: false,
                circlemarker: false,
                marker: false
              }}
            />
            {geocerca && geocerca.positions && geocerca.positions.length > 0 && (
              <Polygon positions={geocerca.positions.map((pos) => [pos.latitud, pos.longitud])} color={geocerca.color} />
            )}
          </FeatureGroup>
        </MapContainer>
        <pre className="text-left">{JSON.stringify(mapLayers, null, 2)}</pre>
      </div>
    </div>
  );
}
