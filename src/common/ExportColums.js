
export const columnsProductosList = [
  { header: 'CÓDIGO', key: 'id', width: 15 },
  { header: 'NOMBRE', key: 'name', width: 25 },
  { header: 'CODIGO', key: 'code', width: 25 },
  { header: 'NUM PARTE', key: 'num_part', width: 25 }
];

export const columnsCategoriasList = [
  { header: 'CÓDIGO', key: 'id', width: 15 },
  { header: 'NOMBRE', key: 'name', width: 25 },
  { header: 'DESCRIPCIÓN', key: 'description', width: 30 }
];

export const columnsProveedoresList = [
  { header: 'CÓDIGO', key: 'id', width: 15 },
  { header: 'NOMBRE', key: 'name', width: 25 },
  { header: 'DIRECCIÓN', key: 'address', width: 30 },
  { header: 'CONTACTO', key: 'contact', width: 20 },
  { header: 'EMAIL', key: 'email', width: 20 },
  { header: 'RUC', key: 'ruc', width: 11 },
  { header: 'TELÉFONO', key: 'phone', width: 10 },
  { header: 'ANEXO', key: 'attachment', width: 20 },
  { header: 'MÉTODO DE PAGO', key: 'payment_method', width: 20 }
];

export const columnsClientesList = [
  { header: 'CÓDIGO', key: 'id', width: 15 },
  { header: 'NOMBRE', key: 'name', width: 25 },
  { header: 'DIRECCIÓN', key: 'address', width: 30 },
  { header: 'CONTACTO', key: 'contact', width: 20 },
  { header: 'EMAIL', key: 'email', width: 20 },
  { header: 'RUC', key: 'ruc', width: 11 },
  { header: 'TELÉFONO', key: 'phone', width: 10 },
  { header: 'ANEXO', key: 'attachment', width: 20 },
  { header: 'MÉTODO DE PAGO', key: 'payment_method', width: 20 }
];

export const columnsDetRepuesto = [
  { header: 'CÓDIGO', key: 'id', width: 15 },
  { header: 'CANTIDAD', key: 'amount', width: 20 },
  { header: 'MONEDA', key: 'moneda', width: 30 },
  { header: 'PRECIO', key: 'price', width: 25 },
  { header: 'REPUESTO', key: 'id_replacement', width: 50 },
  { header: 'DESCRIPCIÓN', key: 'description', width: 100 }
];

export const columnsModeloEquipo = [
  { header: 'CÓDIGO', key: 'code', width: 15 },
  { header: 'NRO PARTE', key: 'num_part', width: 30 },
  { header: 'CANTIDAD', key: 'amount', width: 20 },
  { header: 'MONEDA', key: 'moneda', width: 30 },
  { header: 'DESCRIPCIÓN', key: 'description', width: 100 }
];

export const columnsServicioTecnico = [
  { header: 'CÓDIGO', key: 'id', width: 10 },
  { header: 'FECHA ENTRADA', key: 'entry_date', width: 25 },
  { header: 'CLIETE', key: 'id_cliente', width: 30 },
  { header: 'TÉCNICO', key: 'id_technician', width: 30 },
  { header: 'ENCARGADO', key: 'id_manager', width: 30 },
  { header: 'ESTADO', key: 'state', width: 20 },
  { header: 'FECHA ENTREGA', key: 'departure_date', width: 25 },
  { header: 'DESCRIPCIÓN', key: 'description', width: 100 }
];

export const columnsComprasList = [
  { header: 'CÓDIGO', key: 'id', width: 15 },
  { header: 'RAZÓN', key: 'reason', width: 50 },
  { header: 'PROVEEDOR', key: 'name_proveedor', width: 40 },
  { header: 'NEGOCIO', key: 'name_negocio', width: 40 }
];

export const columnsDetComprasList = [
  { header: 'CÓDIGO', key: 'id', width: 15 },
  { header: 'CANTIDAD', key: 'amount', width: 20 },
  { header: 'MONEDA', key: 'moneda', width: 20 },
  { header: 'PRECIO', key: 'price', width: 20 },
  { header: 'PRODUCTO', key: 'name_producto', width: 40 }
];

export const columnsVentasList = [
  { header: 'CÓDIGO', key: 'id', width: 15 },
  { header: 'RAZÓN', key: 'reason', width: 50 },
  { header: 'CLIENTE', key: 'name_cliente', width: 40 },
  { header: 'NEGOCIO', key: 'name_negocio', width: 40 }
];

export const columnsDetVentasList = [
  { header: 'CÓDIGO', key: 'id', width: 15 },
  { header: 'CANTIDAD', key: 'amount', width: 20 },
  { header: 'MONEDA', key: 'moneda', width: 20 },
  { header: 'PRECIO', key: 'price', width: 20 },
  { header: 'PRODUCTO', key: 'name_producto', width: 40 }
];

export const columnsTransaccionesList = [
  { header: 'CÓDIGO', key: 'id', width: 15 },
  { header: 'PRODUCTO', key: 'name_pro', width: 50 },
  { header: 'TIPO', key: 'tipo', width: 20 },
  { header: 'CANTIDAD', key: 'cantidad', width: 20 },
  { header: 'MONEDA', key: 'moneda', width: 30 },
  { header: 'PRECIO', key: 'price', width: 20 },
  { header: 'PUSUARIOO', key: 'user_id', width: 50 },
  { header: 'NEGOCIO', key: 'id_negocio', width: 50 }
];

export const columnsInforme = [
  { header: 'CÓDIGO', key: 'id', width: 15 },
  { header: 'DETALLE SERVICIO TECNICO', key: 'id_det_ser_tec', width: 30 },
  { header: 'OBSERVACIÓN', key: 'observation', width: 100 },
  { header: 'CONCLUSIÓN', key: 'conclusion', width: 100 }
];

export const columnsGRetransmissionsList = [
  { header: 'ID', key: 'id', width: 10 },
  { header: 'Server Name', key: 'Server_name', width: 35 },
  { header: 'ID Device', key: 'Id_device', width: 15 },
  { header: 'Imei', key: 'imei', width: 15 },
  { header: 'Host', key: 'host_name', width: 15 }
];

export const columnsGHostRetransmissionsList = [
  { header: 'ID', key: 'Id', width: 10 },
  { header: 'Host', key: 'Host', width: 80 },
  { header: 'Host_name', key: 'Host_name', width: 35 },
  { header: 'Token', key: 'Token', width: 60 },
  { header: 'Bypass', key: 'Bypass', width: 30 }
];

export const columnsGRetransmissionLogsList = [
  { header: 'ID', key: 'id', width: 10 },
  { header: 'Placa', key: 'placa', width: 10 },
  { header: 'Nivel', key: 'nivel', width: 10 },
  { header: 'Registro', key: 'fecha_hora', width: 25 },
  { header: 'Respuesta', key: 'response', width: 35 },
  { header: 'Host', key: 'host', width: 70 },
  { header: 'Origen', key: 'origen', width: 25 },
  { header: 'Send', key: 'jsonSend', width: 100 }
];

export const columnsGcompaniasList = [
  { header: 'ID', key: 'Id', width: 10 },
  { header: 'RUC', key: 'RUC', width: 15 },
  { header: 'Nombre', key: 'Business_name', width: 70 },
  { header: 'Dirección', key: 'Address', width: 90 },
  { header: 'Fecha de Actividad', key: 'Activity_date', width: 20 }
];

export const columnsGDivisionesList = [
  { header: 'ID', key: 'Id_divition', width: 10 },
  { header: 'Nombre', key: 'Name', width: 30 },
  { header: 'Compañia', key: 'Business_name', width: 70 },
  { header: 'Estado', key: 'Activo', width: 10 }
];

export const columnsTPositionsList = [
  { header: 'ID', key: 'id', width: 10 },
  { header: 'Dispositivo', key: 'name', width: 30 },
  { header: 'Fecha y Hora', key: 'devicetime', width: 70 },
  { header: 'Latitud', key: 'latitude', width: 10 },
  { header: 'Longitud', key: 'longitude', width: 10 },
  { header: 'Altitud', key: 'altitude', width: 10 },
  { header: 'Velocidad', key: 'speed', width: 10 },
  { header: 'Curso', key: 'course', width: 10 },
  { header: 'Atributos', key: 'attributes', width: 10 }
];

export const columnsGeocercasList = [
  { header: 'tipo', label: 'tipo', minWidth: 20, key: 2 },
  { header: 'nombre', label: 'nombre', minWidth: 50, key: 3 },
  { header: 'descripcion', label: 'descripcion', minWidth: 50, key: 3 },
  { header: 'usuario_responsable', label: 'usuario_responsable', minWidth: 50, key: 3 }
];

export const columnsPosicionesList = [
  { header: 'protoc', label: 'Protocolo', minWidth: 20, key: 0 },
  { header: 'nr_placa', label: 'Placa', minWidth: 100, key: 1 },
  { header: 'date_start', label: 'Fecha_Desde', minWidth: 100, key: 2 },
  { header: 'date_finish', label: 'Fecha_Hasta', minWidth: 100, key: 3 }
];

export const columnsPlanList = [
  { header: 'ID', key: 'id', minWidth: 10 },
  { header: 'Nombre', key: 'nombre', minWidth: 10 },
  { header: 'Detalle', key: 'detalle', minWidth: 50 },
  { header: 'Costo', key: 'costo', minWidth: 10 }
];

export const columnsDetalleList = [
  { header: 'Device_ID  ', key: 'deviceid', minWidth: 20 },
  { header: 'NOMBRE_PLACA', key: 'nombre', minWidth: 20 },
  { header: 'Icono_ID', key: 'id_icono', minWidth: 20 },
  { header: 'Plan_ID', key: 'id_plan', minWidth: 20 },
  { header: 'Año', key: 'año', minWidth: 20 },
  { header: 'Color', key: 'color', minWidth: 20 },
  { header: 'Fecha_Inicio', key: 'fecha_inicio', width: 30 },
  { header: 'Fecha_Fin', key: 'fecha_fin', width: 30 },
  { header: 'Fecha_Recarga', key: 'fecha_recarga', width: 30 }
];

export const columnsIconosList = [
  { header: 'ID', key: 'id', minWidth: 10 },
  { header: 'Nombre', key: 'nombre', width: 30 },
  { header: 'Tipo', key: 'tipo', width: 30 },
  { header: 'Color', key: 'color', width: 30 }
];

export const columnsImagesList = [
  { header: 'ID', key: 'id', minWidth: 10 },
  { header: 'Nombre', key: 'nombre', width: 30 },
  { header: 'Descripcion', key: 'descripcion', width: 30 },
  { header: 'Tipo', key: 'tipo', width: 30 }
];
