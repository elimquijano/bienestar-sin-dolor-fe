import Swal from 'sweetalert2';
//------------ CONEXIONES AL SERVER DE PRODCCION --------------------
//export const URL = 'https://ibtel.tech/';
//export const API_HOST ='https://api.ibtel.tech/';
//------------ CONEXIONES AL SERVER DE PRUEBA --------------------
// export const URL = 'https://pruebas.ibtel.tech/';
// export const API_HOST = 'https://api2.ibtel.tech/';
//------------ CONEXIONES AL SERVER LOCAL --------------------

//  export const URL = 'https://admin.nwperu.com/'; // REAL URL
export const API_HOST = 'https://adminapi.nwperu.com/'; // REAL URL
export const URL = 'http://localhost:3000/';
//export const API_HOST = 'http://localhost:8000/';

//export const URL = process.env.REACT_APP_URL;
//export const API_HOST = process.env.REACT_APP_URL_API;
export const URL_API_COHERE = 'https://api.cohere.com/v1/chat';
export const API_KEY_COHERE_AI = 'WrsU1lPWyADMsyRUibCTQCtiEZmD9z22ebHvpWQj';

export const API_URL = API_HOST + 'api/';
export const API_URL_ROL = API_URL + 'rol';
export const API_URL_PRODUCTO = API_URL + 'producto';
export const API_URL_CATEGORIA = API_URL + 'categoria';
export const API_URL_PROVEEDOR = API_URL + 'proveedor';
export const API_URL_CLIENTE = API_URL + 'cliente';
export const API_URL_LOCAL = API_URL + 'negocio';
export const API_URL_EXISTENCIA = API_URL + 'stock';
export const API_URL_LOGIN = API_URL + 'login';
export const API_URL_COMPRA = API_URL + 'compra';
export const API_URL_DETCOMPRA = API_URL + 'detcompra';
export const API_URL_VENTA = API_URL + 'venta';
export const API_URL_DETVENTA = API_URL + 'detventa';
export const API_URL_MODULO = API_URL + 'modulo';
export const API_URL_PRIVILEGIO = API_URL + 'privilegio';
export const API_URL_ROL_PRIVILEGIO = API_URL + 'rolprivilegio';
export const API_URL_USER = API_URL + 'user';
export const API_URL_CONTACTO = API_URL + 'contacto';
export const API_URL_USER_ROL = API_URL + 'roluser';
export const API_URL_DETREPUESTO = API_URL + 'sertecdetrep';
export const API_URL_MODELOEQUIPO = API_URL + 'modeloequipo';
export const API_URL_SERVTECNICO = API_URL + 'serviciotecnico';
export const API_URL_DETSERVTECNICO = API_URL + 'detsertecnico';
export const API_URL_PRODUCTOSPDF = API_URL + 'productopdf';
export const API_URL_MODELOAUTOCOMPLETE = API_URL + 'modeloAutocomplete';
export const API_URL_TRANSACCIONES = API_URL + 'transacciones';
export const API_URL_INFORME = API_URL + 'informe';
export const API_URL_DES_INFORME = API_URL + 'informePdf';
export const API_URL_DES_INGRESO = API_URL + 'ingresoPdf';
export const API_URL_DES_ENTREGA = API_URL + 'entregaPdf';
export const API_URL_DES_COTIZACION = API_URL + 'cotizacionPdf';
export const API_URL_GRETRANSMISSION = API_URL + 'gretransmission';
export const API_URL_GHOSTRETRANSMISSION = API_URL + 'ghostretransmission';
export const API_URL_GCOMPANIAS = API_URL + 'gcompanias';
export const API_URL_GDIVISIONES = API_URL + 'gdivisiones';
export const API_URL_GLOGS = API_URL + 'log';
export const API_URL_TDISPOSITIVOS = API_URL + 'tdispositivo';
export const API_URL_TPOSICIONES = API_URL + 'tposiciones';
export const API_URL_UBICACION = API_URL + 'ubicacion';
export const API_URL_GEOCERCAS = API_URL + 'geocercas';
export const API_URL_GEOCERCASTYPE = API_URL + 'geocercasType';
export const API_URL_GEOMAPAS = API_URL + 'coordernasgeograficas';
export const API_URL_POSICIONES = API_URL + 'position';
export const API_URL_USERTRACCAR = API_URL + 'userstraccar';
export const API_URL_GEOCOMPANIAS = API_URL + 'geocompanias';
export const API_URL_GEOCERCAS_UBICACIONES = API_URL + 'geoubi';
export const API_URL_ICONOS = API_URL + 'icons';
export const API_URL_ICONOSUPDATE = API_URL + 'iconsUpdate';
export const API_URL_ICONOSTYPE = API_URL + 'iconsType';
export const API_URL_ICONOSCOLOR = API_URL + 'iconsColor';
export const API_URL_IMAGE = API_URL + 'images';
export const API_URL_IMAGETYPE = API_URL + 'imgType';
export const API_URL_PLAN = API_URL + 'plans';
export const API_URL_GPSDETALLE = API_URL + 'typeGps';
export const API_URL_CHIPDETALLE = API_URL + 'chiPlan';
export const API_URL_DETALLE = API_URL + 'detail';
export const API_URL_PLANDETALLE = API_URL + 'Plan';
export const API_URL_ICONODETALLE = API_URL + 'Iconos';

export function convertToQueryStringGET(jsonObject) {
  const queryString = Object.keys(jsonObject)
    .filter((key) => jsonObject[key] !== null && jsonObject[key] !== undefined)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(jsonObject[key])}`)
    .join('&');
  return `?${queryString}`;
}
export function jsonToFormData(datosEnviar) {
  const formdata = new FormData();

  for (const key in datosEnviar) {
    if (datosEnviar[key] !== null && datosEnviar[key] !== '') {
      if (key === 'images' && Array.isArray(datosEnviar[key])) {
        datosEnviar[key].forEach((file, index) => {
          // Agregar cada archivo con un nombre único
          formdata.append(`${key}[${index}]`, file);
        });
      } else {
        formdata.append(key, datosEnviar[key]);
      }
    }
  }

  return formdata;
}

export async function fetchAPIAsync(url, filter, method) {
  try {
    let urlApi = url;
    let requestOptions = {
      method: method,
      redirect: 'follow'
    };

    if (method === 'GET') {
      urlApi = urlApi + convertToQueryStringGET(filter);
    } else if (method === 'POST') {
      requestOptions.body = jsonToFormData(filter);
    }
    const response = await fetch(urlApi, requestOptions);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    notificationSwal('error', error);
    throw error;
  }
}

export function notificationSwal(icon, title) {
  Swal.fire({
    position: 'top-end',
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: 3000
  });
}
export async function postData(url, data) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
    redirect: 'follow'
  };

  try {
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      notificationSwal('error', response.statusText);
      throw response.statusText;
    }
  } catch (error) {
    notificationSwal('error', error);
    throw error;
  }
}
// Crear una sesión
export function createSession(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Obtener una sesión
export function getSession(key) {
  const sessionData = localStorage.getItem(key);
  if (sessionData) {
    return JSON.parse(sessionData);
  }
  return null;
}

// Actualizar una sesión
export function updateSession(key, value) {
  if (getSession(key)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// Eliminar una sesión
export function deleteSession(key) {
  localStorage.removeItem(key);
}
export function redirectToRelativePage(relativePath) {
  const currentPath = window.location.pathname;

  if (currentPath !== relativePath) {
    window.location.href = relativePath;
  }
}

export function eliminarSwal(id, api, onSuccessCallback) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Una vez eliminado no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const apiUrl = `${api}/${id}`;
      var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };
      fetch(apiUrl, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then((result) => {
          if (result && result.message) {
            notificationSwal('success', result.message);
            if (typeof onSuccessCallback === 'function') {
              onSuccessCallback();
            }
          } else {
            throw new Error('Respuesta inesperada del servidor');
          }
        })
        .catch((error) => {
          console.error('Error al eliminar:', error);
          notificationSwal('error', 'No se pudo eliminar');
        });
    }
  });
}

export function imageSwal(imageUrl) {
  const fullImageUrl = URL + imageUrl;

  const img = new Image();
  img.src = fullImageUrl;

  img.onload = function () {
    Swal.fire({
      imageUrl: fullImageUrl,
      imageWidth: 400,
      imageHeight: 400
    });
  };

  img.onerror = function () {
    Swal.fire({
      title: 'Sin imagen',
      icon: 'warning'
    });
  };
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export async function editarSwal(api, id, updatedData, onSuccessCallback) {
  if (!api || !id || !updatedData) {
    notificationSwal('error', 'Parámetros inválidos');
    return;
  }
  console.log('updatedData:', updatedData);

  // Verificar si hay una imagen antes de intentar convertirla a base64
  const imageBase64 = updatedData.image ? await readFileAsBase64(updatedData.image) : null;
  const receiptBase64 = updatedData.receipt ? await readFileAsBase64(updatedData.receipt) : null;

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...updatedData,
      // Incluir image solo si hay una imagen
      image: imageBase64 || null,
      receipt: receiptBase64 || null
    })
  };

  console.log('requestOptions:', requestOptions);

  try {
    const response = await fetch(api + '/' + id, requestOptions);

    if (response.ok) {
      notificationSwal('success', 'Actualizado con éxito');
      if (typeof onSuccessCallback === 'function') {
        onSuccessCallback();
      }
    } else {
      if (response.status === 404) {
        notificationSwal('error', 'Recurso no encontrado');
      } else {
        notificationSwal('error', 'Error al actualizar');
      }
    }
  } catch (error) {
    notificationSwal('error', 'Error en la solicitud: ' + error.message);
  }
}

export function FechaActualCompleta() {
  const fechaActual = new Date();
  const anio = fechaActual.getFullYear();
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
  const dia = fechaActual.getDate().toString().padStart(2, '0');
  const horas = fechaActual.getHours().toString().padStart(2, '0');
  const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
  const segundos = fechaActual.getSeconds().toString().padStart(2, '0');
  const fechaEnFormato = `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

  return fechaEnFormato;
}
export function ListLocales() {
  let LocalesList = [];
  let privilegios = JSON.parse(getSession('PRIVILEGIOS'));
  LocalesList = privilegios.filter((item) => item.type === 'LOC');
  return LocalesList;
}
export async function descargarDocumento(url, nombreArchivo) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const urlBlob = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = urlBlob;

    // Generar un nombre único basado en la fecha si no se proporciona un nombre de archivo
    const fechaActual = new Date();
    const nombreDescarga = nombreArchivo + `_${fechaActual.toISOString()}.pdf`;

    a.download = nombreDescarga;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(urlBlob);
  } catch (error) {
    console.error('Error al descargar el documento:', error);
  }
}
export function navigateTo(url) {
  window.location.href = URL + '#/admin/' + url;
}
