import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PublicIcon from '@mui/icons-material/Public';

import {
  API_URL_GEOCERCAS,
  fetchAPIAsync,
  notificationSwal,
  eliminarSwal,
  editarSwal,
  API_URL_GEOCOMPANIAS,
  API_URL_GEOCERCASTYPE,
  navigateTo
} from 'common/common';
import { exportToExcel } from 'common/MaterialExportToExel';
import { columnsGeocercasList } from 'common/ExportColums';

const columns = [
  { id: 'id', label: 'ID', minWidth: 20, key: 2 },
  { id: 'tipo', label: 'tipo', minWidth: 20, key: 2 },
  { id: 'nombre', label: 'nombre', minWidth: 50, key: 3 },
  { id: 'descripcion', label: 'descripcion', minWidth: 50, key: 3 },
  { id: 'usuario_responsable', label: 'usuario_responsable', minWidth: 50, key: 3 }
];

export default function DataManagmentTable() {
  const [page, setPage] = useState(0);
  const [nombre, setNombre] = useState([]);
  const [tipo, setTipo] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchFilter, setSearchFilter] = useState({});
  const [filteredRows, setFilteredRows] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [itemSave, setItemSave] = useState({});
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [editedItem, setEditedItem] = useState({});

  useEffect(() => {
    SearchFilter(page);
    fetch(API_URL_GEOCOMPANIAS)
      .then((response) => response.json())
      .then((data) => setNombre(data))
      .catch((error) => console.error('Error en la solicitud de proveedores:', error));
  }, []);

  useEffect(() => {
    SearchFilter(page);
    fetch(API_URL_GEOCERCASTYPE)
      .then((response) => response.json())
      .then((data) => setTipo(data))
      .catch((error) => console.error('Error en la solicitud de proveedores:', error));
  }, []);

  async function SearchFilter(numPage) {
    let filter = searchFilter;
    filter.page = numPage + 1;
    filter.paginate = rowsPerPage;
    if (numPage === undefined || numPage === null) {
      filter.page = page + 1;
    }
    try {
      const result = await fetchAPIAsync(API_URL_GEOCERCAS, filter, 'GET');
      setFilteredRows(result?.data);
      setTotalItems(result?.total);
    } catch (error) {
      notificationSwal('error', error);
    }
  }
  async function ExportFilter() {
    let filter = searchFilter;
    filter.page = 1;
    filter.paginate = 10000;
    try {
      const result = await fetchAPIAsync(API_URL_GEOCERCAS, filter, 'GET');
      if (result && result.data.length > 0) {
        exportToExcel(result.data, columnsGeocercasList, 'Id');
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
    setRowsPerPage(10);
    setTotalItems(0);
  }

  async function SaveItem() {
    if (ValidacionItemSave(itemSave) === false) {
      return;
    }

    try {
      let itemsPost = {
        nombre: itemSave.form_nombre,
        tipo: itemSave.form_tipo,
        descripcion: itemSave.descripcion,
        usuario_responsable: itemSave.usuario_responsable,
        color:'black'
      };
      const result = await fetchAPIAsync(API_URL_GEOCERCAS, itemsPost, 'POST');
      notificationSwal('success', '¡Se registró' + result.nombre + 'de forma exitosa!');
      handleCloseModal1();
      navigateTo('mapas/' + result.id + '/' + result.nombre);
    } catch (_) {
      notificationSwal('error', 'No se pudo registrar.');
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
      if (!itemSave.form_tipo) {
        msgResponse += '* Debe agregar un TIPO.<br>';
        response = false;
      }
      if (!itemSave.form_nombre) {
        msgResponse += '* Debe agregar nombre de MUNICIPALIDAD.<br>';
        response = false;
        console.log(itemSave);
      }
      if (!itemSave.descripcion) {
        msgResponse += '* Debe agregar Descripcion de Geocerca .<br>';
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

  const handleEditChange = (name, value) => {
    setEditedItem((prevEditedItem) => ({
      ...prevEditedItem,
      [name]: value
    }));
  };

  async function updateItem() {
    const elementoId = editedItem.Id;
    const updatedData = {
      tipo: editedItem.tipo,
      nombre: editedItem.nombre,
      descripcion: editedItem.descripcion,
      usuario_responsable: editedItem.usuario_responsable
    };

    if (ValidacionItemSave(updatedData) === false) {
      return;
    }
    editarSwal(API_URL_GEOCERCAS, elementoId, updatedData, SearchFilter);
    handleCloseModal2();
  }

  function handleEditar(row) {
    setEditedItem({
      id: row.ID,
      tipo: row.tipo,
      nombre: row.nombre,
      descripcion: row.descripcion,
      usuario_responsable: row.usuario_responsable
    });
  }

  function handleVer(row) {
      console.log(row);{
          navigateTo('mapas/' + row.id + '/' + row.nombre);
      }
  }
  

  function handleEliminar(row) {
    const elementoId = row.id;
    eliminarSwal(elementoId, API_URL_GEOCERCAS, SearchFilter);
  }

  const handleOpenModal1 = () => {
    setOpenModal1(true);
  };

  const handleCloseModal1 = () => {
    setOpenModal1(false);
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
          Registrar Geocerca
        </Button>

        <div className="row content">
          <div className="col-sm-9">
            <form className="form row mb-4">
              <div className="col-sm-4">
                <label htmlFor="form_id">CODIGO:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_id"
                  id="form_id"
                  onChange={handleSearchChange}
                  value={searchFilter.form_id || ''}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="form_tipo">Tipo:</label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={tipo}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_tipo: newValue ? newValue : '' });
                  }}
                  renderInput={(params) => <TextField {...params} label="tipo" />}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="form_nombre">Compañia:</label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={nombre}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_nombre: newValue ? newValue : '' });
                  }}
                  renderInput={(params) => <TextField {...params} label="nombre" />}
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
                  {/* Columna adicional para botones de acción */}
                  <TableCell>Acciones</TableCell>
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
                            handleOpenModal2();
                            handleVer(row);
                          }}
                          className="btn btn-info"
                        >
                         <PublicIcon/> 
                        </Button> 
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
              <h2 className="modal-title">Registre un nuevo Geocerca</h2>
              <button onClick={handleCloseModal1} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="form_tipo">Tipo(*)</label>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={tipo}
                        onChange={(event, newValue) => {
                          setItemSave({ ...itemSave, form_tipo: newValue ? newValue : '' });
                        }}
                        renderInput={(params) => <TextField {...params} label="Tipo" />}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="form_nombre">Nombre_Municipalidad(*)</label>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={nombre}
                        onChange={(event, newValue) => {
                          setItemSave({ ...itemSave, form_nombre: newValue ? newValue : '' });
                        }}
                        renderInput={(params) => <TextField {...params} label="Nombre_Municipalidad" />}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="descripcion">Descripcion(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="descripcion"
                        id="descripcion"
                        onChange={handleSaveChange}
                        value={itemSave.descripcion || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="usuario_responsable">Usuario_responsable(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="usuario_responsable"
                        id="usuario_responsable"
                        onChange={handleSaveChange}
                        value={itemSave.usuario_responsable || ''}
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
              <h2 className="modal-title">Editar Geocerca</h2>
              <button onClick={handleCloseModal2} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="form_tipo">Tipo(*)</label>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={tipo}
                        onChange={(event, newValue) => {
                          handleEditChange({ ...itemSave, form_tipo: newValue ? newValue : '' });
                        }}
                        renderInput={(params) => <TextField {...params} label="Tipo" />}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="form_nombre">Nombre_Municipalidad(*)</label>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={nombre}
                        onChange={(event, newValue) => {
                          handleEditChange({ ...itemSave, form_nombre: newValue ? newValue : '' });
                        }}
                        renderInput={(params) => <TextField {...params} label="Nombre_Muncipalidad" />}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="descripcion">Descripcion(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="descripcion"
                        id="descripcion"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.descripcion || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="usuario_responsable">Usuario_Respon(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="usuario_responsable"
                        id="usuario_responsable"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.usuario_responsable || ''}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button className="btn btn-warning" onClick={updateItem}>
                <EditIcon /> ACTUALIZAR
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
