import * as React from 'react';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { API_URL_GRETRANSMISSION, fetchAPIAsync, notificationSwal, eliminarSwal, editarSwal } from 'common/common';
import { exportToExcel } from 'common/MaterialExportToExel';
import { columnsGRetransmissionsList } from 'common/ExportColums';

const columns = [
  { id: 'id', label: 'ID', minWidth: 10, key: 0 },
  { id: 'Server_name', label: 'Nombre Servidor', minWidth: 50, key: 3 },
  //{ id: 'Id_client', label: 'Cliente', minWidth: 10, key: 4 },
  { id: 'Id_device', label: 'Id Device', minWidth: 10, key: 5 },
  { id: 'imei', label: 'Imei', minWidth: 10, key: 6 },
  //{ id: 'imei', label: 'imei', minWidth: 10, key: 7 },
  { id: 'host_name', label: 'Host', minWidth: 10, key: 8 }
  //{ id: 'Active', label: 'Activo', minWidth: 30, key: 9 },
  //{ id: 'Bypass', label: 'Bypass', minWidth: 30, key: 10 },
];

export default function GRetransmission() {
  const [page, setPage] = React.useState(0);
  const [host, setHost] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchFilter, setSearchFilter] = React.useState({});
  const [filteredRows, setFilteredRows] = React.useState({});
  const [totalItems, setTotalItems] = React.useState(0);
  const [itemSave, setItemSave] = React.useState(0);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [editedItem, setEditedItem] = useState(0);

  useEffect(() => {
    SearchFilter(page);
    fetch(API_URL_GRETRANSMISSION + 'data')
      .then((response) => response.json())
      .then((data) => setHost(data))
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
      const result = await fetchAPIAsync(API_URL_GRETRANSMISSION, filter, 'GET');
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
      const result = await fetchAPIAsync(API_URL_GRETRANSMISSION, filter, 'GET');
      if (result && result.data.length > 0) {
        exportToExcel(result.data, columnsGRetransmissionsList, 'Pines Devices');
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
      const itemToSave = { ...itemSave, price: itemSave.price * 100 };
      const result = await fetchAPIAsync(API_URL_GRETRANSMISSION, itemToSave, 'POST');
      notificationSwal('success', '¡Se registró ' + result.name + ' de forma exitosa!');
      handleCloseModal1();
      SearchFilter(page);
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
      if (!itemSave.Server_name) {
        msgResponse += '* Debe agregar un Server Name.<br>';
        response = false;
      }
      if (!itemSave.Id_client) {
        msgResponse += '* Debe agregar un ID Cliente.<br>';
        response = false;
      }
      if (!itemSave.Id_device) {
        msgResponse += '* Debe agregar un ID Dispositivo.<br>';
        response = false;
      }
      if (!itemSave.Id_host) {
        msgResponse += '* Debe agregar un ID Host.<br>';
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
    const elementoId = editedItem.id;
    const updatedData = {
      Server_name: editedItem.Server_name,
      Id_client: editedItem.Id_client,
      Id_device: editedItem.Id_device,
      nameb: editedItem.nameb,
      imei: editedItem.imei,
      Id_host: editedItem.Id_host
    };
    if (ValidacionItemSave(updatedData) === false) {
      return;
    }
    editarSwal(API_URL_GRETRANSMISSION, elementoId, updatedData, SearchFilter);
    handleCloseModal2();
  }

  function handleEditar(row) {
    setEditedItem({
      id: row.id,
      Server_name: row.Server_name,
      Id_client: row.Id_client,
      Id_device: row.Id_device,
      nameb: row.nameb,
      imei: row.imei,
      Id_host: row.Id_host
    });
  }

  function handleEliminar(row) {
    const elementoId = row.id;
    eliminarSwal(elementoId, API_URL_GRETRANSMISSION, SearchFilter);
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
          Registrar Pines Devices
        </Button>

        <div className="row content">
          <div className="col-sm-9">
            <form className="form row mb-4">
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_Server_name">Server Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_Server_name"
                  id="form_Server_name"
                  onChange={handleSearchChange}
                  value={searchFilter.form_Server_name || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_Id_client">ID Cliente:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_Id_client"
                  id="form_Id_client"
                  onChange={handleSearchChange}
                  value={searchFilter.form_Id_client || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_Id_device">ID Dispositivo:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_Id_device"
                  id="form_Id_device"
                  onChange={handleSearchChange}
                  value={searchFilter.form_Id_device || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_imei">Imei:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_imei"
                  id="form_imei"
                  onChange={handleSearchChange}
                  value={searchFilter.form_imei || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_Host">Host:</label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={host}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_Host: newValue ? newValue : '' });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  value={searchFilter.form_Host || null}
                  size="small"
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
              <h2 className="modal-title">Registre un nuevo Pines Devices</h2>
              <button onClick={handleCloseModal1} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Server_name">Server Name:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Server_name"
                        id="Server_name"
                        onChange={handleSaveChange}
                        value={itemSave.Server_name || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_client">ID Cliente:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Id_client"
                        id="Id_client"
                        onChange={handleSaveChange}
                        value={itemSave.Id_client || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_device">ID Dispositivo:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Id_device"
                        id="Id_device"
                        onChange={handleSaveChange}
                        value={itemSave.Id_device || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="imei">Imei:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="imei"
                        id="imei"
                        onChange={handleSaveChange}
                        value={itemSave.imei || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_host">ID Host:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Id_host"
                        id="Id_host"
                        onChange={handleSaveChange}
                        value={itemSave.Id_host || ''}
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
              <h2 className="modal-title">Editar G-retransmission</h2>
              <button onClick={handleCloseModal2} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Server_name">Server Name:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Server_name"
                        id="Server_name"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.Server_name || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_client">ID Cliente:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Id_client"
                        id="Id_client"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.Id_client || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_device">ID Dispositivo:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Id_device"
                        id="Id_device"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.Id_device || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="imei">Imei:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="imei"
                        id="imei"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.imei || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_host">ID Host:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Id_host"
                        id="Id_host"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.Id_host || ''}
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
