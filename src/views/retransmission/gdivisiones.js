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
import { fetchAPIAsync, notificationSwal, eliminarSwal, API_URL_GCOMPANIAS, editarSwal, API_URL_GDIVISIONES } from 'common/common';
import { exportToExcel } from 'common/MaterialExportToExel';
import { columnsGDivisionesList } from 'common/ExportColums';
import { MenuItem, Select } from '@mui/material';

const columns = [
  { id: 'Id', label: 'ID', minWidth: 10, key: 1 },
  { id: 'Name', label: 'Nombre', minWidth: 10, key: 2 },
  { id: 'Business_name', label: 'Compañia', minWidth: 10, key: 3 },
  { id: 'Activo', label: 'Estado', minWidth: 10, key: 4 }
];

export default function GDivisiones() {
  const [page, setPage] = React.useState(0);
  const [compañias, setCompañias] = useState([]);
  const [compañiasName, setCompañiasName] = useState([]);
  const [divisiones, setDivisiones] = useState([]);
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
    fetch(API_URL_GCOMPANIAS + 'name')
      .then((response) => response.json())
      .then((data) => setCompañiasName(data))
      .catch((error) => console.error('Error en la solicitud de compañias:', error));
    fetch(API_URL_GDIVISIONES + 'name')
      .then((response) => response.json())
      .then((data) => setDivisiones(data))
      .catch((error) => console.error('Error en la solicitud de divisiones:', error));
  }, []);

  async function SearchFilter(numPage) {
    let filter = searchFilter;
    filter.page = numPage + 1;
    filter.paginate = rowsPerPage;
    if (numPage === undefined || numPage === null) {
      filter.page = page + 1;
    }
    try {
      const result = await fetchAPIAsync(API_URL_GDIVISIONES, filter, 'GET');
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
      const result = await fetchAPIAsync(API_URL_GDIVISIONES, filter, 'GET');
      if (result && result.data.length > 0) {
        exportToExcel(result.data, columnsGDivisionesList, 'Divisiones');
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
    handleCloseModal1();
    if (ValidacionItemSave(itemSave) === false) {
      return;
    }

    try {
      const result = await fetchAPIAsync(API_URL_GDIVISIONES, itemSave, 'POST');
      notificationSwal('success', '¡Se registró ' + result.Name + ' de forma exitosa!');
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
      if (!itemSave.Id_compani) {
        msgResponse += '* Debe seleccionar una Compañia.<br>';
        response = false;
      }
      if (!itemSave.Name) {
        msgResponse += '* Debe agregar un Nombre de la Division.<br>';
        response = false;
      }
      if (!itemSave.Activo) {
        msgResponse += '* Debe agregar un Estado.<br>';
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
    if (ValidacionItemSave(editedItem) === false) {
      return;
    }
    editarSwal(API_URL_GDIVISIONES, elementoId, editedItem, SearchFilter);
    handleCloseModal2();
  }

  function handleEditar(row) {
    fetch(API_URL_GCOMPANIAS + 'data')
      .then((response) => response.json())
      .then((data) => setCompañias(data))
      .catch((error) => console.error('Error en la solicitud de compañias:', error));
    setEditedItem({
      Id: row.Id,
      Name: row.Name,
      Id_compani: row.Id_compani,
      Activo: row.Activo
    });
  }

  function handleEliminar(row) {
    const elementoId = row.Id;
    eliminarSwal(elementoId, API_URL_GDIVISIONES, SearchFilter);
  }

  const handleOpenModal1 = () => {
    fetch(API_URL_GCOMPANIAS + 'data')
      .then((response) => response.json())
      .then((data) => setCompañias(data))
      .catch((error) => console.error('Error en la solicitud de compañias:', error));
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
          Registrar Nueva División
        </Button>

        <div className="row content">
          <div className="col-sm-9">
            <form className="form row mb-4">
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_business_name">Compañia:</label>
                <Autocomplete
                  disablePortal
                  id="form_business_name"
                  options={compañiasName}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_business_name: newValue ? newValue : '' });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  value={searchFilter.form_business_name || null}
                  size="small"
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_id">ID de División:</label>
                <input
                  type="number"
                  className="form-control"
                  name="form_id"
                  id="form_id"
                  onChange={handleSearchChange}
                  value={searchFilter.form_id || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_name">Nombre de División:</label>
                <Autocomplete
                  disablePortal
                  id="form_name"
                  options={divisiones}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_name: newValue ? newValue : '' });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  value={searchFilter.form_name || null}
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
              <h4 className="modal-title">Registre una Nueva Division</h4>
              <button onClick={handleCloseModal1} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_compani">Compañia(*):</label>
                      <Autocomplete
                        size="small"
                        disablePortal
                        id="Id_compani"
                        options={compañias}
                        getOptionLabel={(option) => option.Business_name}
                        onChange={(event, newValue) => {
                          setItemSave((prevSearch) => ({
                            ...prevSearch,
                            Id_compani: newValue ? newValue.Id : ''
                          }));
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Name">Nombre de la División:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Name"
                        id="Name"
                        onChange={handleSaveChange}
                        value={itemSave.Name || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Activo">Estado(*):</label>
                      <Select id="Activo" name="Activo" value={itemSave.Activo || '2'} onChange={handleSaveChange} fullWidth size="small">
                        <MenuItem value="2">
                          <em>Seleccione un estado</em>
                        </MenuItem>
                        <MenuItem value="1">
                          <em>ACTIVO</em>
                        </MenuItem>
                        <MenuItem value="0">
                          <em>INACTIVO</em>
                        </MenuItem>
                      </Select>
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
              <h2 className="modal-title">Editar G-division</h2>
              <button onClick={handleCloseModal2} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Name">Nombre de la División:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Name"
                        id="Name"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.Name || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_compani">Compañia(*):</label>
                      <Select
                        id="Id_compani"
                        name="Id_compani"
                        value={editedItem.Id_compani || ''}
                        onChange={(event) => {
                          const { name, value } = event.target;
                          setEditedItem((prevSearch) => ({
                            ...prevSearch,
                            [name]: value
                          }));
                        }}
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="">
                          <em>Seleccione una compañia nueva</em>
                        </MenuItem>
                        {compañias.map((c) => {
                          return (
                            <MenuItem key={c.Id} value={c.Id}>
                              {c.Business_name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Activo">Estado(*):</label>
                      <Select
                        id="Activo"
                        name="Activo"
                        value={editedItem.Activo || '2'}
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="2">
                          <em>Seleccione un estado</em>
                        </MenuItem>
                        <MenuItem value="1">
                          <em>ACTIVO</em>
                        </MenuItem>
                        <MenuItem value="0">
                          <em>INACTIVO</em>
                        </MenuItem>
                      </Select>
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
