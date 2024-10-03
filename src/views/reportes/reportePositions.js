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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  fetchAPIAsync,
  notificationSwal,
  eliminarSwal,
  editarSwal, 
  descargarDocumento,
  API_URL_POSICIONES
} from 'common/common';

const columns = [
  { id: 'protoc', label: 'Protocolo', minWidth: 20, key: 0 },
  { id: 'nr_placa', label: 'Placa', minWidth: 100, key: 1 },
  { id: 'date_start', label: 'Fecha_Desde', minWidth: 100, key: 2 },
  { id: 'date_finish', label: 'Fecha_Hasta', minWidth: 100, key: 3 },
];

export default function ReportePositionsPage() {
 //NEW SETVARIABLES 


  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchFilter, setSearchFilter] = React.useState({});
  const [filteredRows, setFilteredRows] = React.useState({});
  const [totalItems, setTotalItems] = React.useState(0);
  const [itemSave, setItemSave] = React.useState({});
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [editedItem, setEditedItem] = useState(0);

  useEffect(() => {
    SearchFilter(page);
    fetch(API_URL_POSICIONES)
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
      const result = await fetchAPIAsync(API_URL_POSICIONES, filter, 'GET');
      setFilteredRows(result?.data);
      setTotalItems(result?.total);
    } catch (error) {
      notificationSwal('error', error);
    }
  }
  async function ExportarFilter(numPage) {
    let filter = searchFilter;
    filter.page = 1;
    filter.paginate = 10000000;
    if (numPage === undefined || numPage === null) {
      filter.page = page + 1;
    }
    try {
      await descargarDocumento(API_URL_POSICIONES,);
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
      const result = await fetchAPIAsync(API_URL_POSICIONES, itemSave, 'POST');
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
      if (!itemSave.protoc) {
        msgResponse += '* Debe agregar un Server Name.<br>';
        response = false;
      }
      if (!itemSave.nr_placa) {
        msgResponse += '* Debe agregar un ID Cliente.<br>';
        response = false;
      }
      if (!itemSave.date_start) {
        msgResponse += '* Debe agregar un ID Dispositivo.<br>';
        response = false;
      }
      if (!itemSave.date_finish) {
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
    const cleanedValue = value.trim();
    setSearchFilter((prevSearch) => ({
      ...prevSearch,
      [name]: cleanedValue
    }));
  };

  const handleSaveChange = (event) => {
    const { name, value } = event.target;
    setItemSave((prevSearch) => ({
      ...prevSearch,
      [name]: value
    }));
  };

 

  async function updateItem() {
    const elementoId = editedItem.id;
    const updatedData = {
      protoc: editedItem.protoc,
      nr_placa: editedItem.nr_placa,
      date_start: editedItem.date_start,
      date_finish: editedItem.date_finish
    };
      if (ValidacionItemSave(updatedData) === false) {
        return;
      }
    editarSwal(API_URL_POSICIONES, elementoId, updatedData, SearchFilter);
    handleCloseModal2();
  }

  function handleEditar(row) {
    setEditedItem({
      id: row.id,
      protoc: row.protoc,
      nr_placa: editedItem.nr_placa,
      date_start: editedItem.date_start,
      date_finish: editedItem.date_finish
    });
  }

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    await SearchFilter(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function handleEliminar(row) {
    const elementoId = row.id;
    eliminarSwal(elementoId, API_URL_POSICIONES, SearchFilter);
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
          Registrar Posicion
        </Button>
        <div className="row content">
          <div className="col-sm-9">
            <form className="form row mb-4">
              <div className="col-sm-4">
                <label htmlFor="form_id">PROTOCOLO:</label>
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
                <label htmlFor="form_nr_placa">PLACA:</label>
                <input
                    type="text"
                    className="form-control"
                    name="form_nr_placa"
                    id="form_nr_placa"
                    onChange={handleSearchChange}
                    value={searchFilter.form_nr_placa || ''}
                    />
                </div>
                  <div className="col-sm-4">
                  <label htmlFor="form_Fecha_Desde">DESDE:</label>
                  <input
                      type="datetime-local"
                      className="form-control"
                      name="form_Fecha_Desde"
                      id="form_Fecha_Desde"
                      onChange={handleSearchChange}
                      value={searchFilter.form_Fecha_Desde || ''}
                      />
                  </div>
                  <div className="col-sm-4">
                  <label htmlFor="form_nr_placa">HASTA:</label>
                  <input
                      type="datetime-local"
                      className="form-control"
                      name="form_nr_placa"
                      id="form_nr_placa"
                      onChange={handleSearchChange}
                      value={searchFilter.form_Fecha_Hasta || ''}
                      />
                </div>
            </form>
          </div>
          <div className="col-sm-3">
            <button className="btn btn-success w-100 mb-1" onClick={() => SearchFilter()}>
              <SearchIcon /> BUSCAR
            </button>
            <button className="btn btn-warning w-100 mb-1" onClick={() => ExportarFilter()}>
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
              <h2 className="modal-title">Registro Posiciones</h2>
              <button onClick={handleCloseModal1} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="form_protocol">PROTOCOLO: </label>
                  <input
                    type="text"
                    className="form-control"
                    name="form_protocol"
                    id="form_protocol"
                    onChange={handleSearchChange}
                    value={searchFilter.form_protocol || ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="form_nr_placa">PLACA: </label>
                    <input
                    type="text"
                    className="form-control"
                    name="form_nr_placa"
                    id="form_nr_placa"
                    onChange={handleSearchChange}
                    value={searchFilter.form_nr_placa || ''}
                />
                </div>
                <div className="form-group">
                  <label htmlFor="form_Fecha_Desde">DESDE :</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="form_Fecha_Desde"
                    id="form_Fecha_Desde"
                    onChange={handleSaveChange}
                    value={itemSave.form_Fecha_Desde || ''}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="form_Fecha_Hasta">HASTA:</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="form_Fecha_Hasta"
                    id="form_Fecha_Hasta"
                    onChange={handleSaveChange}
                    value={itemSave.form_Fecha_Hasta || ''}
                    required
                  />
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
              <h2 className="modal-title">Editar Producto</h2>
              <button onClick={handleCloseModal2} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form>
                
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
