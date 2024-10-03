import * as React from 'react';
import { useState } from 'react';
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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { API_URL_GHOSTRETRANSMISSION, fetchAPIAsync, notificationSwal, eliminarSwal, editarSwal } from 'common/common';
import { exportToExcel } from 'common/MaterialExportToExel';
import { columnsGHostRetransmissionsList } from 'common/ExportColums';

const columns = [
  { id: 'Id', label: 'ID', minWidth: 10, key: 0 },
  { id: 'Host', label: 'Host', minWidth: 20, key: 2 },
  { id: 'Token', label: 'Token', minWidth: 50, key: 3 },
  { id: 'Host_name', label: 'Host Name', minWidth: 10, key: 4 },
  { id: 'Bypass', label: 'Bypass', minWidth: 10, key: 5 },
];

export default function GHostRetransmission() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchFilter, setSearchFilter] = React.useState({});
  const [filteredRows, setFilteredRows] = React.useState({});
  const [totalItems, setTotalItems] = React.useState(0);
  const [itemSave, setItemSave] = React.useState(0);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [editedItem, setEditedItem] = useState(0);

  async function SearchFilter(numPage) {
    let filter = searchFilter;
    filter.page = numPage + 1;
    filter.paginate = rowsPerPage;
    if (numPage === undefined || numPage === null) {
      filter.page = page + 1;
    }
    try {
      const result = await fetchAPIAsync(API_URL_GHOSTRETRANSMISSION, filter, 'GET');
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
      const result = await fetchAPIAsync(API_URL_GHOSTRETRANSMISSION, filter, 'GET');
      if (result && result.data.length > 0) {
        exportToExcel(result.data, columnsGHostRetransmissionsList, "Host");
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
      const result = await fetchAPIAsync(API_URL_GHOSTRETRANSMISSION, itemToSave, 'POST');
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
      if (!itemSave.Host_name) {
        msgResponse += '* Debe agregar un Host Name.<br>';
        response = false;
      }
      if (!itemSave.Host) {
        msgResponse += '* Debe agregar un Host.<br>';
        response = false;
      }
      if (!itemSave.Token) {
        msgResponse += '* Debe agregar un Token.<br>';
        response = false;
      }
      if (!itemSave.Bypass) {
        msgResponse += '* Debe agregar un Bypass.<br>';
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
      [name]: value,
    }));
  };

  async function updateItem() {

    const elementoId = editedItem.Id;
    const updatedData = {
      Host: editedItem.Host,
      Token: editedItem.Token,
      Bypass: editedItem.Bypass,
      Host_name: editedItem.Host_name,
    };

    if (ValidacionItemSave(updatedData) === false) {
      return;
    }
    editarSwal(API_URL_GHOSTRETRANSMISSION, elementoId, updatedData, SearchFilter);
    handleCloseModal2();
  }

  function handleEditar(row) {
    setEditedItem({
      Id: row.Id,
      Host: row.Host,
      Host_name: row.Host_name,
      Token: row.Token,
      Bypass: row.Bypass,
    });

  }

  function handleEliminar(row) {
    const elementoId = row.Id;
    eliminarSwal(elementoId, API_URL_GHOSTRETRANSMISSION, SearchFilter);
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
        <Button onClick={handleOpenModal1} className='btn btn-info mb-3'>Registrar Host</Button>

        <div className="row content">
          <div className="col-sm-9">
            <form className="form row mb-4">
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_Host">Host:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_Host"
                  id="form_Host"
                  onChange={handleSearchChange}
                  value={searchFilter.form_Host || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_Token">Token:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_Token"
                  id="form_Token"
                  onChange={handleSearchChange}
                  value={searchFilter.form_Token || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_Bypass">Bypass:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_Bypass"
                  id="form_Bypass"
                  onChange={handleSearchChange}
                  value={searchFilter.form_Bypass || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_Host_name">Host Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_Host_name"
                  id="form_Host_name"
                  onChange={handleSearchChange}
                  value={searchFilter.form_Host_name || ''}
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
                        <Button onClick={() => {
                          handleOpenModal2();
                          handleEditar(row);
                        }} className='btn btn-warning'>
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
              <h2 className="modal-title">Registre un nuevo Host</h2>
              <button onClick={handleCloseModal1} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Host">Host:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Host"
                        id="Host"
                        onChange={handleSaveChange}
                        value={itemSave.Host || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Token">Token:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Token"
                        id="Token"
                        onChange={handleSaveChange}
                        value={itemSave.Token || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Bypass">Bypass:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Bypass"
                        id="Bypass"
                        onChange={handleSaveChange}
                        value={itemSave.Bypass || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Host_name">Host Name:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Host_name"
                        id="Host_name"
                        onChange={handleSaveChange}
                        value={itemSave.Host_name || ''}
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
                      <label htmlFor="Host">Host:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Host"
                        id="Host"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.Host || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Token">Token:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Token"
                        id="Token"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.Token || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Bypass">Bypass:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Bypass"
                        id="Bypass"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.Bypass || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Host_name">Host Name:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Host_name"
                        id="Host_name"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.Host_name || ''}
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
        </div >
      </Modal >
    </div >
  );
}
