import axios from 'axios';
import Swal from 'sweetalert2';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { OpenAI } from 'openai';

//------------ CONEXIONES AL SERVER DE PRUEBA --------------------
// export const URL = process.env.REACT_APP_URL;
//export const API_HOST = process.env.REACT_APP_URL_API; // REAL URL
//------------ CONEXIONES AL SERVER LOCAL --------------------
export const URL = 'https://elimpruebasapi.nwperu.com/';
export const API_HOST = 'https://elimpruebasapi.nwperu.com/';

export const URL_API_COHERE = process.env.REACT_APP_API_COHERE_URL;
export const API_KEY_COHERE_AI = process.env.REACT_APP_COHERE_TOKEN;

export const URL_API_HF = process.env.REACT_APP_API_HF_URL;
export const API_KEY_HF = process.env.REACT_APP_HF_TOKEN;

export const URL_API_CLASSIFIER = 'http://127.0.0.1:5010/predict';

export const API_URL = API_HOST + 'api/';
export const API_URL_LOGIN = API_URL + 'login';
export const API_URL_USER = API_URL + 'user';
export const API_URL_ROL = API_URL + 'rol';
export const API_URL_USER_ROL = API_URL + 'roluser';
export const API_URL_MODULO = API_URL + 'modulo';
export const API_URL_PRIVILEGIO = API_URL + 'privilegio';
export const API_URL_ROL_PRIVILEGIO = API_URL + 'rolprivilegio';
export const API_URL_CONVERSATION = API_URL + 'conversation';
export const API_URL_INTERACCION = API_URL + 'interaccion';
export const API_URL_ESPECIALISTAS = API_URL + 'especialista';
export const API_URL_ENFERMEDAD = API_URL + 'enfermedad';
export const API_URL_RADIOGRAFIA = API_URL + 'radiografia';

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
  window.location.href = URL + '#/' + url;
}

// Función para formatear la fecha
export function formatearFecha(fechaISO) {
  // Convertir la cadena a un objeto Date
  const fecha = new Date(fechaISO);

  // Restar 5 horas (5 * 60 * 60 * 1000 milisegundos)
  fecha.setHours(fecha.getHours() - 5);

  // Obtener la fecha actual sin la hora
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const mesActual = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
  const diaActual = String(fechaActual.getDate()).padStart(2, '0');
  const fechaHoy = `${anioActual}-${mesActual}-${diaActual}`;

  // Formatear la fecha en el formato deseado para mensajes
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');

  // Crear la cadena en el formato deseado
  const fechaComparar = `${anio}-${mes}-${dia}`;

  // Retornar solo la hora si la fecha es igual a la fecha actual
  if (fechaComparar === fechaHoy) {
    return `${horas}:${minutos}`;
  } else {
    return fechaComparar;
  }
}

// para android
export const SpeakTextNative = async (text, setIsSpeaking, language = 'es-ES') => {
  if (text) {
    try {
      setIsSpeaking(true);
      await TextToSpeech.speak({
        text: text,
        lang: language,
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient'
      });
    } catch (error) {
      console.error('Error al hablar:', error);
    } finally {
      setIsSpeaking(false);
    }
  }
};

// para la web
export const SpeakTextWeb = (text, setIsSpeaking, language = 'es-ES') => {
  if (text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }
};

export const ResponseAI = async (
  userMessage,
  context = 'Eres un asistente de fisioterapia y médico experto. Tu tarea es evaluar las dolencias descritas por el usuario y responde de manera breve y concisa. Haz preguntas detalladas para obtener la mayor cantidad de información posible sobre el malestar del usuario. No darás recomendaciones específicas hasta haber recopilado suficiente información. Solo responderás preguntas relacionadas con dolencias de la pierna o la parte inferior del cuerpo. Una vez que el usuario haya proporcionado suficiente información, realiza un pre-descarte de lesiones simples, desgarros o fracturas, basándote en los síntomas descritos. Si los síntomas coinciden con alguna de las siguientes condiciones, indica al usuario que busque el nombre del diagnóstico en la ventana principal de la aplicación:Desgarro muscular del vasto lateral del cuadríceps: Punción y dolor en forma de quemazón al moverse, hinchazón, coloración morado-rosácea, y dolor al pisar.Gonartrosis: Crujido en la rodilla, debilitamiento al caminar, inflamación en las zonas laterales de la rodilla.Contractura muscular en la pantorrilla: Calambres, dureza muscular anormal, y dolor tras actividad física prolongada.Punto Gatillo Profundo o Superficial: Dolor momentáneo en pantorrilla o cuadríceps.Si identificas síntomas que coinciden, sugiere al usuario buscar tratamiento en la aplicación usando el botón "¿ya tienes tu descarte?". Si no se identifican síntomas claros, recomienda ver a un especialista.Además, reconoce insultos o malas palabras y no responderás a preguntas que no estén relacionadas con dolencias de la pierna o la parte inferior del cuerpo.'
) => {
  const client = new OpenAI({
    baseURL: URL_API_HF,
    apiKey: API_KEY_HF,
    dangerouslyAllowBrowser: true
  });

  let out = '';

  const stream = await client.chat.completions.create({
    model: '01-ai/Yi-1.5-34B-Chat',
    messages: [
      {
        role: 'system',
        content: context
      },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.5,
    max_tokens: 2048,
    top_p: 0.7,
    stream: true
  });

  for await (const chunk of stream) {
    if (chunk.choices && chunk.choices.length > 0) {
      const newContent = chunk.choices[0].delta.content;
      out += newContent;
    }
  }

  return out;
};

export const ResponseAIAux = async (
  userMessage,
  context = 'Eres un fisioterapeuta y médico experto. Tu tarea es evaluar las dolencias descritas por el usuario y proporcionar orientación inicial. Debes hacer preguntas detalladas para obtener la mayor cantidad de información posible sobre el malestar del usuario. No debes dar recomendaciones específicas hasta haber recopilado suficiente información. No debes realizar más de una pregunta en una sola respuesta, sino una sola pregunta. Pregunta al usuario sobre su malestar: "¿Dónde sientes dolor y cuándo comenzó?" Indaga sobre la naturaleza de la lesión: "¿Cómo ocurrió la lesión? ¿Fue un movimiento brusco, una caída, o algo más?" Pregunta sobre síntomas adicionales: "¿Has notado hinchazón, moretones o limitación en el movimiento?" Indaga sobre tratamientos previos: "¿Has recibido algún tratamiento para este malestar? ¿Qué has probado hasta ahora?" Pregunta sobre actividades: "¿Hay alguna actividad que empeore o mejore el dolor?" Una vez que el usuario haya proporcionado suficiente información, realiza un pre-descarte de lesiones simples, desgarros o fracturas, basándote en los síntomas descritos. Ofrece consejos de rehabilitación básicos y sugiere cuándo es necesario buscar atención médica profesional solo cuando ya no haya más respuestas a sus preguntas del usuario. Si el usuario pregunta por tu creador, solo si pregunta, sino no, responde que fuiste creado por los estudiantes de ingeniería de sistemas de la UNHEVAL: Elim, Johan y Jordan.'
) => {
  const url = URL_API_COHERE;
  const token = API_KEY_COHERE_AI;

  const data = {
    message: userMessage,
    model: 'command-r-plus',
    preamble: context
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    return response.data.text;
  } catch (error) {
    console.error('Error al enviar mensaje a Cohere AI:', error);
    if (error.response && error.response.status === 429) {
      const response = 'Lo siento, hemos alcanzado nuestro límite de uso de la API. Por favor, intenta de nuevo más tarde.';
      return response;
    } else {
      const response = 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.';
      return response;
    }
  }
};
