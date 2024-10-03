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
import { fetchAPIAsync, notificationSwal, eliminarSwal, API_URL_GCOMPANIAS, editarSwal, API_URL_UBICACION } from 'common/common';
import { exportToExcel } from 'common/MaterialExportToExel';
import { columnsGcompaniasList } from 'common/ExportColums';
import { MenuItem, Select } from '@mui/material';

const columns = [
  { id: 'Id', label: 'ID', minWidth: 10, key: 1 },
  { id: 'RUC', label: 'RUC', minWidth: 10, key: 2 },
  { id: 'Business_name', label: 'Nombre', minWidth: 10, key: 3 },
  { id: 'Address', label: 'Dirección', minWidth: 10, key: 4 },
  { id: 'Activity_date', label: 'Fecha de Actividad', minWidth: 10, key: 5 }
];

export default function GCompanies() {
  const [page, setPage] = React.useState(0);
  const [compañias, setCompañias] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchFilter, setSearchFilter] = React.useState({});
  const [filteredRows, setFilteredRows] = React.useState({});
  const [totalItems, setTotalItems] = React.useState(0);
  const [itemSave, setItemSave] = React.useState(0);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [editedItem, setEditedItem] = useState(0);

  const [pais, setPais] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [searchFilterUbicación, setSearchFilterUbicación] = React.useState({});

  useEffect(() => {
    SearchFilter(page);
    SearchFilterUbicación({});
    fetch(API_URL_GCOMPANIAS + 'name')
      .then((response) => response.json())
      .then((data) => setCompañias(data))
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
      const result = await fetchAPIAsync(API_URL_GCOMPANIAS, filter, 'GET');
      setFilteredRows(result?.data);
      setTotalItems(result?.total);
    } catch (error) {
      notificationSwal('error', error);
    }
  }
  async function SearchFilterUbicación(filters) {
    let filter = { ...searchFilterUbicación, ...filters };
    try {
      const result = await fetchAPIAsync(API_URL_UBICACION, filter, 'GET');
      setPais(result?.country);
      setDepartamentos(result?.city);
      setProvincias(result?.province);
      setDistritos(result?.district);
    } catch (error) {
      notificationSwal('error', error);
    }
  }
  async function ExportFilter() {
    let filter = searchFilter;
    filter.page = 1;
    filter.paginate = 10000;
    try {
      const result = await fetchAPIAsync(API_URL_GCOMPANIAS, filter, 'GET');
      if (result && result.data.length > 0) {
        exportToExcel(result.data, columnsGcompaniasList, 'Compañias');
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
      const result = await fetchAPIAsync(API_URL_GCOMPANIAS, itemSave, 'POST');
      notificationSwal('success', '¡Se registró ' + result.Business_name + ' de forma exitosa!');
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
      if (!itemSave.RUC) {
        msgResponse += '* Debe agregar un RUC.<br>';
        response = false;
      }
      if (!itemSave.Business_name) {
        msgResponse += '* Debe agregar un Nombre de la compañia.<br>';
        response = false;
      }
      if (!itemSave.Id_country) {
        msgResponse += '* Debe agregar un País.<br>';
        response = false;
      }
      if (!itemSave.Id_city) {
        msgResponse += '* Debe agregar un Departamento o Región.<br>';
        response = false;
      }
      if (!itemSave.Id_province) {
        msgResponse += '* Debe agregar una Provincia.<br>';
        response = false;
      }
      if (!itemSave.Id_district) {
        msgResponse += '* Debe agregar un Distrito.<br>';
        response = false;
      }
      if (!itemSave.Address) {
        msgResponse += '* Debe agregar una Dirección.<br>';
        response = false;
      }
      if (!itemSave.Activity_date) {
        msgResponse += '* Debe agregar una Fecha de Inicio de Actividades.<br>';
        response = false;
      }
      if (!itemSave.Date_creation) {
        msgResponse += '* Debe agregar una Fecha de Creación de la Compañia.<br>';
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
    editarSwal(API_URL_GCOMPANIAS, elementoId, editedItem, SearchFilter);
    handleCloseModal2();
  }

  function handleEditar(row) {
    SearchFilterUbicación({ Id_city: row.Id_city, Id_province: row.Id_province });
    setEditedItem({
      Id: row.Id,
      RUC: row.RUC,
      Business_name: row.Business_name,
      Address: row.Address,
      Activity_date: row.Activity_date,
      Id_country: row.Id_country,
      Id_city: row.Id_city,
      Id_province: row.Id_province,
      Id_district: row.Id_district,
      Electronic_issuance_since: row.Electronic_issuance_since,
      Date_creation: row.Date_creation
    });
  }

  function handleEliminar(row) {
    const elementoId = row.Id;
    eliminarSwal(elementoId, API_URL_GCOMPANIAS, SearchFilter);
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
          Registrar Nueva Compañia
        </Button>

        <div className="row content">
          <div className="col-sm-9">
            <form className="form row mb-4">
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_id">ID de Compañia:</label>
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
                <label htmlFor="form_ruc">RUC:</label>
                <input
                  type="number"
                  className="form-control"
                  name="form_ruc"
                  id="form_ruc"
                  onChange={handleSearchChange}
                  value={searchFilter.form_ruc || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_business_name">Nombre de Compañia:</label>
                <Autocomplete
                  disablePortal
                  id="form_business_name"
                  options={compañias}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_business_name: newValue ? newValue : '' });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  value={searchFilter.form_business_name || null}
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
              <h4 className="modal-title">Registre una Nueva Compañia</h4>
              <button onClick={handleCloseModal1} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="RUC">RUC:(*)</label>
                      <input
                        type="number"
                        minLength={11}
                        maxLength={11}
                        className="form-control"
                        name="RUC"
                        id="RUC"
                        onChange={handleSaveChange}
                        value={itemSave.RUC || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Business_name">Nombre de la Compañia:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Business_name"
                        id="Business_name"
                        onChange={handleSaveChange}
                        value={itemSave.Business_name || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_country">País(*):</label>
                      <Select
                        id="Id_country"
                        name="Id_country"
                        value={itemSave.Id_country || '0'}
                        onChange={handleSaveChange}
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="0">
                          <em>Seleccione un país</em>
                        </MenuItem>
                        {pais.map((p) => {
                          return (
                            <MenuItem key={p.Id_country} value={p.Id_country}>
                              {p.Name_country}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_city">Departamento(*):</label>
                      <Select
                        id="Id_city"
                        name="Id_city"
                        value={itemSave.Id_city || '0'}
                        onChange={(event) => {
                          const { name, value } = event.target;
                          setItemSave((prevSearch) => ({
                            ...prevSearch,
                            [name]: value
                          }));
                          setSearchFilterUbicación({ ...searchFilterUbicación, Id_city: value });
                          SearchFilterUbicación({ Id_city: value });
                        }}
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="0">
                          <em>Seleccione un departamento</em>
                        </MenuItem>
                        {departamentos.map((d) => {
                          return (
                            <MenuItem key={d.Id_city} value={d.Id_city}>
                              {d.Name_city}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_province">Provincia(*):</label>
                      <Select
                        id="Id_province"
                        name="Id_province"
                        value={itemSave.Id_province || '0'}
                        onChange={(event) => {
                          const { name, value } = event.target;
                          setItemSave((prevSearch) => ({
                            ...prevSearch,
                            [name]: value
                          }));
                          setSearchFilterUbicación({ ...searchFilterUbicación, Id_province: value });
                          SearchFilterUbicación({ Id_province: value });
                        }}
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="0">
                          <em>Seleccione una provincia</em>
                        </MenuItem>
                        {provincias.map((p) => {
                          return (
                            <MenuItem key={p.Id_province} value={p.Id_province_complete}>
                              {p.Name_province}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_district">Distrito(*):</label>
                      <Select
                        id="Id_district"
                        name="Id_district"
                        value={itemSave.Id_district || '0'}
                        onChange={handleSaveChange}
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="0">
                          <em>Seleccione un distrito</em>
                        </MenuItem>
                        {distritos.map((d) => {
                          return (
                            <MenuItem key={d.Id_district} value={d.Id_district_complete}>
                              {d.Name_district}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Address">Dirección:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Address"
                        id="Address"
                        onChange={handleSaveChange}
                        value={itemSave.Address || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Activity_date">Inicio de Actividades:(*)</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="Activity_date"
                        id="Activity_date"
                        onChange={handleSaveChange}
                        value={itemSave.Activity_date || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Electronic_issuance_since">Emisión Electrónica:(*)</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="Electronic_issuance_since"
                        id="Electronic_issuance_since"
                        onChange={handleSaveChange}
                        value={itemSave.Electronic_issuance_since || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Date_creation">Fecha de Creación:(*)</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="Date_creation"
                        id="Date_creation"
                        onChange={handleSaveChange}
                        value={itemSave.Date_creation || ''}
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
              <h2 className="modal-title">Editar G-compañia</h2>
              <button onClick={handleCloseModal2} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="RUC">RUC:(*)</label>
                      <input
                        type="number"
                        minLength={11}
                        maxLength={11}
                        className="form-control"
                        name="RUC"
                        id="RUC"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.RUC || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Business_name">Nombre de la Compañia:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Business_name"
                        id="Business_name"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.Business_name || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_country">País(*):</label>
                      <Select
                        id="Id_country"
                        name="Id_country"
                        value={editedItem.Id_country || ''}
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
                          <em>Seleccione un país</em>
                        </MenuItem>
                        {pais.map((p) => {
                          return (
                            <MenuItem key={p.Id_country} value={p.Id_country}>
                              {p.Name_country}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_city">Departamento(*):</label>
                      <Select
                        id="Id_city"
                        name="Id_city"
                        value={editedItem.Id_city || ''}
                        onChange={(event) => {
                          const { name, value } = event.target;
                          setEditedItem((prevSearch) => ({
                            ...prevSearch,
                            [name]: value
                          }));
                          setSearchFilterUbicación({ ...searchFilterUbicación, Id_city: value });
                          SearchFilterUbicación({ Id_city: value });
                        }}
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="">
                          <em>Seleccione un departamento</em>
                        </MenuItem>
                        {departamentos.map((d) => {
                          return (
                            <MenuItem key={d.Id_city} value={d.Id_city}>
                              {d.Name_city}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_province">Provincia(*):</label>
                      <Select
                        id="Id_province"
                        name="Id_province"
                        value={editedItem.Id_province || ''}
                        onChange={(event) => {
                          const { name, value } = event.target;
                          setEditedItem((prevSearch) => ({
                            ...prevSearch,
                            [name]: value
                          }));
                          setSearchFilterUbicación({ ...searchFilterUbicación, Id_province: value });
                          SearchFilterUbicación({ Id_province: value });
                        }}
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="">
                          <em>Seleccione una provincia</em>
                        </MenuItem>
                        {provincias.map((p) => {
                          return (
                            <MenuItem key={p.Id_province} value={p.Id_province_complete}>
                              {p.Name_province}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Id_district">Distrito(*):</label>
                      <Select
                        id="Id_district"
                        name="Id_district"
                        value={editedItem.Id_district || ''}
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
                          <em>Seleccione un distrito</em>
                        </MenuItem>
                        {distritos.map((d) => {
                          return (
                            <MenuItem key={d.Id_district} value={d.Id_district_complete}>
                              {d.Name_district}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Address">Dirección:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Address"
                        id="Address"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.Address || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Activity_date">Inicio de Actividades:(*)</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="Activity_date"
                        id="Activity_date"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.Activity_date || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Electronic_issuance_since">Emisión Electrónica:(*)</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="Electronic_issuance_since"
                        id="Electronic_issuance_since"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.Electronic_issuance_since || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Date_creation">Fecha de Creación:(*)</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="Date_creation"
                        id="Date_creation"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.Date_creation || ''}
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
