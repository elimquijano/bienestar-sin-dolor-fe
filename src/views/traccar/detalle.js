import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Swal from 'sweetalert2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Modal from '@mui/material/Modal';
import InfoSharpIcon from '@mui/icons-material/InfoSharp';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import {
  fetchAPIAsync,
  notificationSwal,
  API_URL_DETALLE,
  editarSwal,
  eliminarSwal,
  API_URL_CHIPDETALLE,
  API_URL_GPSDETALLE,
  API_URL_ICONODETALLE,
  API_URL_PLANDETALLE,
  API_HOST
} from 'common/common';
import { exportToExcel } from 'common/MaterialExportToExel';
import { columnsDetalleList } from 'common/ExportColums';

const columns = [
  { id: 'nombre', label: 'NOMBRE_PLACA', minWidth: 20 },
  { id: 'icono_name', label: 'Icono_ID', minWidth: 20 },
  { id: 'fecha_inicio', label: 'Fecha_Inicio', width: 30 },
  { id: 'fecha_fin', label: 'Fecha_Fin', width: 30 },
  { id: 'fecha_recarga', label: 'Fecha_Recarga', minWidth: 30 },
  { id: 'plan_name', label: 'Plan_ID', minWidth: 20 },
  { id: 'año', label: 'Año', minWidth: 20 },
  { id: 'color', label: 'Color', minWidth: 20 },
  { id: 'model', label: 'Model', minWidth: 20 },
  { id: 'chip', label: 'Chip', minWidth: 20 },
  { id: 'monto', label: 'monto', minWidth: 20 }
];

export default function PlanUser() {
  const [page, setPage] = useState(0);
  const [Chip, setChip] = useState([]);
  const [Model, setModel] = useState([]);
  const [Icono_ID, setIcono_ID] = useState([]);
  const [Plan_ID, setPlan_ID] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchFilter, setSearchFilter] = useState({ icono_name: '', plan_name: '' });
  const [filteredRows, setFilteredRows] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [itemSave, setItemSave] = useState({});
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [editedItem, setEditedItem] = useState({});

  useEffect(() => {
    SearchFilter(page);
    fetch(API_URL_CHIPDETALLE)
      .then((response) => response.json())
      .then((data) => setChip(data))
      .catch((error) => console.error('Error en la solicitud :', error));
    fetch(API_URL_GPSDETALLE)
      .then((response) => response.json())
      .then((data) => setModel(data))
      .catch((error) => console.error('Error en la solicitud :', error));
    fetch(API_URL_ICONODETALLE)
      .then((response) => response.json())
      .then((data) => {
        if (data.iconos && Array.isArray(data.iconos)) {
          setIcono_ID(data.iconos);
        } else {
          console.error('Los datos obtenidos no son un array:', data);
        }
      })
      .catch((error) => console.error('Error en la solicitud:', error));
    fetch(API_URL_PLANDETALLE)
      .then((response) => response.json())
      .then((data) => {
        if (data.planes && Array.isArray(data.planes)) {
          setPlan_ID(data.planes);
        } else {
          console.error('Los datos obtenidos no son un array:', data);
        }
      })
      .catch((error) => console.error('Error en la solicitud:', error));
  }, []);

  async function SearchFilter(numPage) {
    let filter = searchFilter;
    filter.page = numPage + 1;
    filter.paginate = rowsPerPage;
    if (numPage === undefined || numPage === null) {
      filter.page = page + 1;
    }
    try {
      const result = await fetchAPIAsync(API_URL_DETALLE, filter, 'GET');
      setFilteredRows(result?.data);
      setTotalItems(result?.total);
    } catch (error) {
      notificationSwal('error', error);
    }
  }

  // async function handleRecarga(row)
  // {
  //   try {
  //     const response = await fetch(API_URL_ + '/' + row.id);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const tcDetail = await response.json();

  //     let detailHtml = formatDetail(tcDetail);

  //     Swal.fire({
  //       title: 'Detalles',
  //       html: detailHtml, // Usar la propiedad 'html' en lugar de 'text'
  //       icon: 'info',
  //       confirmButtonText: 'OK'
  //     });
  //   } catch (error) {
  //     console.log('Hubo un problema con la operación fetch: ' +  error.message);
  //   }
  // }

  const icono_url = 'icono_url'; // Define esto como el nombre del parámetro que contiene la URL de la imagen

  async function handleVer(row) {
    try {
      const response = await fetch(`${API_URL_DETALLE}/${row.id}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const tcDetail = await response.json();
  
      let detailHtml = formatDetail(tcDetail);
  
      Swal.fire({
        title: 'Detalles',
        html: detailHtml, // Usar la propiedad 'html' en lugar de 'text'
        icon: 'info',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.log('Hubo un problema con la operación fetch: ' + error.message);
    }
  }
  
  function formatDetail(detail, indent = 0) {
    let html = `
      <table style="width: 100%; border-collapse: collapse;">
        <style>
          .key-cell {
            font-weight: bold;
            background-color: skyblue;
            cursor: pointer;
            transition: background-color 0.3s;
            padding: 8px;
          }
          .key-cell:hover {   
            background-color: #e0e0e0;
          }
          .detail-row {
            border-bottom: 2px solid #ddd;
          }
          .image-cell {
            padding: 8px;
          }
          .image-cell img {
            max-width: 100px;
            max-height: 100px;
            display: block;
          }
        </style>
    `;
  
    for (const [key, value] of Object.entries(detail)) {
      html += '<tr class="detail-row">';
      html += `<td class="key-cell">${key}</td>`;
      if (typeof value === 'object' && value !== null) {
        html += `<td>${formatDetail(value, indent + 1)}</td>`;
      } else {
        if (key === icono_url && /\.(jpg|jpeg|png|gif)$/i.test(value)) {
          html += `<td class="image-cell"><img src="${API_HOST}${value}" alt="Imagen"></td>`;
        } else {
          html += `<td>${value}</td>`;
        }
      }
      html += '</tr>';
    }
  
    html += '</table>';
    return html;
  }
  

  async function ExportFilter() {
    let filter = searchFilter;
    filter.page = 1;
    filter.paginate = 10000;
    try {
      const result = await fetchAPIAsync(API_URL_DETALLE, filter, 'GET');
      console.log(result.data);
      if (result && result.data.length > 0) {
        exportToExcel(result.data, columnsDetalleList, 'Detalle');
      } else {
        notificationSwal('info', 'No hay datos para exportar.');
      }
    } catch (error) {
      notificationSwal('error', error);
    }
  }

  function CleanFilter() {
    setFilteredRows({});
    setSearchFilter({});
    setPage(0);
    setRowsPerPage(50);
    setTotalItems(0);
  }

  async function SaveItem() {
    if (ValidacionItemSave(itemSave) === false) {
      return;
    }
    try {
      console.log(itemSave);
      const result = await fetchAPIAsync(API_URL_DETALLE, itemSave, 'POST');
      notificationSwal('success', '¡Se registró  de forma exitosa!');
      handleCloseModal1();
      SearchFilter(page);
      console.log(result);
    } catch (_) {
      notificationSwal('error', 'No se pudo registrar Ingresa correctamente los ID y Placa requerida.');
      handleCloseModal1();
    }
  }

  function ValidacionItemSave(itemSave) {
    let response = true;
    let msgResponse = '';

    if (!itemSave || Object.keys(itemSave).length === 0) {
      msgResponse += '* Debe completar los campos obligatorios.<br>';
      response = false;
    } else {
      if (!itemSave.icono_name) {
        msgResponse += '* Debe agregar un Icono-nombre<br>';
        response = false;
      }
      if (!itemSave.plan_name) {
        msgResponse += '* Debe agregar un Plan-nombre<br>';
        response = false;
      }
      if (!itemSave.placa) {
        msgResponse += '* Debe agregar un PLACA.<br>';
        response = false;
      }
      if (!itemSave.año) {
        msgResponse += '* Debe agregar AÑO.<br>';
        response = false;
      }
      if (!itemSave.fecha_inicio) {
        msgResponse += '* Debe agregar FECHA INICIO .<br>';
        response = false;
      }
      if (!itemSave.fecha_fin) {
        msgResponse += '* Debe agregar FECHA FIN.<br>';
        response = false;
      }
      if (!itemSave.color) {
        msgResponse += '* Debe agregar COLOR.<br>';
        response = false;
      }
      if (!itemSave.monto) {
        msgResponse += '* Debe agregar MONTO.<br>';
        response = false;
      }
    }

    if (response === false) {
      notificationSwal('error', msgResponse);
    }
    return response;
  }

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchFilter((prevSearch) => ({
      ...prevSearch,
      [name]: value
    }));
  };
  const handleEditChange = (name, value) => {
    setEditedItem((prevEditedItem) => ({
      ...prevEditedItem,
      [name]: value
    }));
  };
  const handleSaveChange = (event) => {
    const { name, value } = event.target;
    setItemSave((prevSearch) => ({
      ...prevSearch,
      [name]: value
    }));
  };

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    await SearchFilter(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function handleEditar(row) {
    setEditedItem({
      id: row.id,
      deviceid: row.deviceid,
      icono_name: row.icono_name,
      plan_name: row.plan_name,
      model: row.model,
      chip: row.chip,
      año: row.año,
      color: row.color,
      fecha_inicio: row.fecha_inicio,
      fecha_fin: row.fecha_fin,
      fecha_recarga: row.fecha_recarga,
      monto: row.monto
    });
  }

  async function UpdateItem() {
    const elementoId = editedItem.id;
    const updatedData = {
      icono_name: editedItem.icono_name,
      plan_name: editedItem.plan_name,
      model: editedItem.model,
      chip: editedItem.chip,
      fecha_recarga: editedItem.fecha_recarga,
      fecha_inicio: editedItem.fecha_inicio,
      fecha_fin: editedItem.fecha_fin,
      color: editedItem.color,
      monto: editedItem.monto
    };
    editarSwal(API_URL_DETALLE, elementoId, updatedData, SearchFilter);
    handleCloseModal2();
  }

  function handleEliminar(row) {
    const elementoId = row.id;
    eliminarSwal(elementoId, API_URL_DETALLE, SearchFilter);
  }

  const handleOpenModal1 = () => {
    setOpenModal1(true);
  };

  const handleCloseModal1 = () => {
    setOpenModal1(false);
    setItemSave({
      placa: '',
      color: '',
      monto: '',
      año: '',
      fecha_recarga: '',
      fecha_inicio: '',
      fecha_fin: ''
    });
  };

  const handleOpenModal2 = () => {
    setOpenModal2(true);
  };

  const handleCloseModal2 = () => {
    setOpenModal2(false);
  };

  return (
    <div>
      <div className="form">
        <Button onClick={handleOpenModal1} className="btn btn-info mb-3">
          Registrar PLAN-PLACA
        </Button>
        <div className="row content">
          <div className="col-sm-9">
            <form className="form row mb-4">
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_device_id">DEVICE_ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_device_id"
                  id="form_device_id"
                  onChange={handleSearchChange}
                  value={searchFilter.form_device_id || ''}
                />
              </div>
              <div className="col-md-8 col-xl-4">
                <label htmlFor="icono_name">ICONO_ID:</label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Icono_ID}
                  getOptionLabel={(option) => option.nombre} // Cambia 'nombre' si la propiedad a mostrar es diferente
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, icono_name: newValue ? newValue.nombre : '' }); // Cambia 'nombre' si la propiedad a guardar es diferente
                  }}
                  renderInput={(params) => <TextField {...params} label="REGISTRO" />}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="plan_name">Plan_ID:</label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Plan_ID}
                  getOptionLabel={(option) => option.nombre} // Cambia 'nombre' si la propiedad a mostrar es diferente
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, plan_name: newValue ? newValue : '' }); // Cambia 'nombre' si la propiedad a guardar es diferente
                  }}
                  renderInput={(params) => <TextField {...params} label="REGISTRO" />}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="model">MODELO-GPS:</label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Model}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, model: newValue ? newValue : '' });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="chip">CHIP:</label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Chip}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, chip: newValue ? newValue : '' });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
              <div className="col-md col-xl-4">
                <label htmlFor="form_icon_id">ICONO_ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_icon_id"
                  id="form_icon_id"
                  onChange={handleSearchChange}
                  value={searchFilter.form_icon_id || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_plan_id">PLAN_ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_plan_id"
                  id="form_plan_id"
                  onChange={handleSearchChange}
                  value={searchFilter.form_plan_id || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_año">AÑO:</label>
                <input
                  type="date"
                  className="form-control"
                  name="form_año"
                  id="form_año"
                  onChange={handleSearchChange}
                  value={searchFilter.form_año || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_color">COLOR:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_color"
                  id="form_color"
                  onChange={handleSearchChange}
                  value={searchFilter.form_color || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_fecha_inicio">FECHA_INICIO:</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="form_fecha_inicio"
                  id="form_fecha_inicio"
                  onChange={handleSearchChange}
                  value={searchFilter.form_fecha_inicio || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_fecha_fin">FECHA_FIN:</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="form_fecha_fin"
                  id="form_fecha_fin"
                  onChange={handleSearchChange}
                  value={searchFilter.form_fecha_fin || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_fecha_recarga">FECHA_RECARGA:</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="form_fecha_recarga"
                  id="form_fecha_recarga"
                  onChange={handleSearchChange}
                  value={searchFilter.form_fecha_recarga || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_name">NOMBRE_PLACA:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_name"
                  id="form_name"
                  onChange={handleSearchChange}
                  value={searchFilter.form_name || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_monto">MONTO:</label>
                <input
                  type="number"
                  className="form-control"
                  name="form_monto"
                  id="form_monto"
                  onChange={handleSearchChange}
                  value={searchFilter.form_monto || ''}
                />
              </div>
            </form>
          </div>
          <div className="col-sm-3">
            <button className="btn btn-success w-100 mb-1" onClick={() => SearchFilter()}>
              <SearchIcon /> BUSCAR
            </button>
            <button className="btn btn-warning w-100 mb-1" onClick={() => ExportFilter()}>
              <FileDownloadIcon />
              EXPORTAR
            </button>
            <button className="btn btn-danger w-100 mb-1" onClick={CleanFilter}>
              <CleaningServicesIcon />
              LIMPIAR
            </button>
          </div>
        </div>
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {totalItems > 0 ? (
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.key} align={column.align} style={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => (
                        <TableCell key={column.id} align={column.align}>
                          {row[column.id]}
                        </TableCell>
                      ))}
                      {/* Columna de botones de acción */}
                      <TableCell>
                        <Button
                          onClick={() => {
                            handleVer(row);
                          }}
                          className="btn btn-info"
                        >
                          <InfoSharpIcon />
                        </Button>
                        {/* <Button
                          onClick={() => {
                            handleRecarga(row);
                          }}
                          className="btn btn-dark"
                        >
                          <ShoppingCartSharpIcon />
                        </Button> */}

                        <Button
                          onClick={() => {
                            handleOpenModal2();
                            handleEditar(row);
                          }}
                          className="btn btn-warning"
                        >
                          <EditIcon />
                        </Button>
                        <button className="btn btn-danger" onClick={() => handleEliminar(row)}>
                          <DeleteIcon />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className="alert alert-warning" role="alert">
            No se encontraron resultados.
          </div>
        )}

        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Modal
        open={openModal1}
        onClose={handleCloseModal1}
        aria-labelledby="registration-modal-title"
        aria-describedby="registration-modal-description"
      >
        <div className="modal-dialog modal-dialog-centered d-flex justify-content-center align-items-center">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Registre un nuevo USUARIO</h2>
              <button onClick={handleCloseModal1} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="placa">PLACA:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="placa"
                        id="placa"
                        onChange={handleSaveChange}
                        value={itemSave.placa || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="icono_name">ICONO_ID:</label>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Icono_ID}
                        getOptionLabel={(option) => option.nombre} // Asegúrate de que 'nombre' es la propiedad correcta
                        onChange={(event, newValue) => {
                          setItemSave({ ...itemSave, icono_name: newValue ? newValue.nombre : '' });
                        }}
                        renderInput={(params) => <TextField {...params} label="REGISTRO" />}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="plan_name">Plan_ID:</label>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Plan_ID}
                        getOptionLabel={(option) => option.nombre} // Asegúrate de que 'nombre' es la propiedad correcta
                        onChange={(event, newValue) => {
                          setItemSave({ ...itemSave, plan_name: newValue ? newValue.nombre : '' });
                        }}
                        renderInput={(params) => <TextField {...params} label="REGISTRO" />}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="model">MODELO-GPS:</label>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Model}
                        onChange={(event, newValue) => {
                          setItemSave({ ...itemSave, model: newValue ? newValue : '' });
                        }}
                        renderInput={(params) => <TextField {...params} label="Modelo-GPS" />}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="chip">CHIP-PLAN:</label>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Chip}
                        onChange={(event, newValue) => {
                          setItemSave({ ...itemSave, chip: newValue ? newValue : '' });
                        }}
                        renderInput={(params) => <TextField {...params} label="Chip-Plan" />}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="monto">MONTO:</label>
                      <input
                        type="number"
                        className="form-control"
                        name="monto"
                        id="monto"
                        onChange={handleSaveChange}
                        value={itemSave.monto || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="color">COLOR:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="color"
                        id="color"
                        onChange={handleSaveChange}
                        value={itemSave.color || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="año">AÑO:</label>
                      <input
                        type="date"
                        className="form-control"
                        name="año"
                        id="año"
                        onChange={handleSaveChange}
                        value={itemSave.año || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="fecha_recarga">FECHA RECARGA:</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="fecha_recarga"
                        id="fecha_recarga"
                        onChange={handleSaveChange}
                        value={itemSave.fecha_recarga || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="fecha_inicio">FECHA INICIO:</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="fecha_inicio"
                        id="fecha_inicio"
                        onChange={handleSaveChange}
                        value={itemSave.fecha_inicio || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="fecha_fin">FECHA FIN:</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="fecha_fin"
                        id="fecha_fin"
                        onChange={handleSaveChange}
                        value={itemSave.fecha_fin || ''}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button className="btn btn-info" onClick={SaveItem}>
                <AddCircleOutlineIcon /> REGISTRAR
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={openModal2}
        onClose={handleCloseModal2}
        aria-labelledby="edition-modal-title"
        aria-describedby="edition-modal-description"
      >
        <div className="modal-dialog modal-dialog-centered d-flex justify-content-center align-items-center">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">EDITAR PLAN USUARIO</h2>
              <button onClick={handleCloseModal2} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group"></div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="icono_name">ICONO_ID(*)</label>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Icono_ID}
                        getOptionLabel={(option) => option.nombre}
                        onChange={(event, newValue) => {
                          handleEditChange('icono_name', newValue ? newValue.nombre : '');
                        }}
                        renderInput={(params) => <TextField {...params} label="Registro" />}
                        value={Icono_ID.find((item) => item.nombre === editedItem.icono_name) || null}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="plan_name">PLAN_ID(*)</label>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Plan_ID}
                        getOptionLabel={(option) => option.nombre}
                        onChange={(event, newValue) => {
                          handleEditChange('plan_name', newValue ? newValue.nombre : '');
                        }}
                        renderInput={(params) => <TextField {...params} label="Registro" />}
                        value={Plan_ID.find((item) => item.nombre === editedItem.plan_name) || null}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="model">MODELO-GPS(*)</label>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Model}
                        onChange={(event, newValue) => {
                          handleEditChange('model', newValue ? newValue : '');
                        }}
                        renderInput={(params) => <TextField {...params} label="Modelo-Gps" />}
                        value={editedItem.model || null}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="chip">CHIP(*)</label>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Chip}
                        onChange={(event, newValue) => {
                          handleEditChange('chip', newValue ? newValue : '');
                        }}
                        renderInput={(params) => <TextField {...params} label="Chip Plan" />}
                        value={editedItem.chip || null}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="monto">MONTO:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="monto"
                        id="monto"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.monto || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="fecha_recarga">FECHA_RECARGA:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="fecha_recarga"
                        id="fecha_recarga"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.fecha_recarga || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="fecha_inicio">FECHA_INICIO:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="fecha_inicio"
                        id="fecha_inicio"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.fecha_inicio || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="fecha_fin">FECHA_FIN:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="fecha_fin"
                        id="fecha_fin"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.fecha_fin || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="color">COLOR:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="color"
                        id="color"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.color || ''}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button className="btn btn-warning" onClick={UpdateItem}>
                <EditIcon /> ACTUALIZAR
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
