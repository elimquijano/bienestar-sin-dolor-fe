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
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { API_HOST, API_URL_PRODUCTO, API_URL_CATEGORIA, fetchAPIAsync, notificationSwal, eliminarSwal, editarSwal } from 'common/common';
import { exportToExcel } from 'common/MaterialExportToExel';
import { columnsProductosList } from 'common/ExportColums';

const columns = [
  { id: 'code', label: 'Codigo', minWidth: 10, key: 0 },
  { id: 'name', label: 'Descripción', minWidth: 100, key: 2 },
  { id: 'num_part', label: 'Nro.Parte', minWidth: 50, key: 3 },
  { id: 'price', label: 'Precio', minWidth: 50, key: 4 },
  { id: 'observacion', label: 'OBS', minWidth: 100, key: 5 },
  { id: 'image', label: 'IMAGEN', minWidth: 60, key: 6 },
  { id: 'id_categoria', label: 'Categoría', minWidth: 60, key: 7 },
];

export default function ProductoPage() {
  const [categorias, setCategorias] = React.useState([]);
  const [monedas, setMonedas] = React.useState([]);
  const [page, setPage] = React.useState(0);
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
    fetch(API_URL_CATEGORIA + 'data')
      .then(response => response.json())
      .then(data => setCategorias(data))
      .catch(error => console.error('Error:', error));

    fetch(API_URL_PRODUCTO + 'moneda')
      .then(response => response.json())
      .then(data => setMonedas(data))
      .catch(error => console.error('Error:', error));
  }, []);

  async function SearchFilter(numPage) {
    let filter = searchFilter;
    filter.page = numPage + 1;
    filter.paginate = rowsPerPage;
    if (numPage === undefined || numPage === null) {
      filter.page = page + 1;
    }
    try {
      const result = await fetchAPIAsync(API_URL_PRODUCTO, filter, 'GET');
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
      const result = await fetchAPIAsync(API_URL_PRODUCTO, filter, 'GET');
      if (result && result.data.length > 0) {
        exportToExcel(result.data, columnsProductosList, "Productos");
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
      const result = await fetchAPIAsync(API_URL_PRODUCTO, itemToSave, 'POST');
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
      notificationSwal('error', 'Debe completar los campos obligatorios');
      response = false;
      return response;
    } else {
      if (!itemSave.code) {
        msgResponse += '* Debe agregar un código.<br>';
        response = false;
      }
      if (!itemSave.name) {
        msgResponse += '* Debe añadir una descripción.<br>';
        response = false;
      }
      if (!itemSave.moneda) {
        msgResponse += '* Debe seleccionar una moneda.<br>';
        response = false;
      }
      if (!itemSave.price) {
        msgResponse += '* Debe ingresar un precio.<br>';
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

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditedItem({ ...editedItem, image: file });
  };



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setItemSave({ ...itemSave, image: file });
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
    const elementoId = editedItem.id;
    const updatedData = {
      code: editedItem.code,
      name: editedItem.name,
      num_part: editedItem.num_part,
      moneda: editedItem.moneda,
      price: editedItem.price * 100,
      observacion: editedItem.observacion,
      id_categoria: editedItem.id_categoria,
      image: editedItem.image,
    };
    if (ValidacionItemSave(updatedData) === false) {
      return;
    }
    editarSwal(API_URL_PRODUCTO, elementoId, updatedData, SearchFilter);
    handleCloseModal2();
  }

  function handleEditar(row) {
    setEditedItem({
      id: row.id,
      code: row.code,
      name: row.name,
      num_part: row.num_part,
      moneda: row.moneda,
      price: row.price / 100,
      observacion: row.observacion,
      id_categoria: row.id_categoria,
    });
  }

  function handleEliminar(row) {
    const elementoId = row.id;
    eliminarSwal(elementoId, API_URL_PRODUCTO, SearchFilter);
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
        <Button onClick={handleOpenModal1} className='btn btn-info mb-3'>Registrar producto</Button>

        <div className="row content">
          <div className="col-sm-9">
            <form className="form row mb-4">
              <div className="col-sm-4">
                <label htmlFor="form_code">Código:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_code"
                  id="form_code"
                  onChange={handleSearchChange}
                  value={searchFilter.form_code || ''}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="form_name">Descripción:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_name"
                  id="form_name"
                  onChange={handleSearchChange}
                  value={searchFilter.form_name || ''}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="form_num_part">Nro Parte:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_num_part"
                  id="form_num_part"
                  onChange={handleSearchChange}
                  value={searchFilter.form_num_part || ''}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="form_moneda">Moneda:</label>
                <Autocomplete
                  options={monedas}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_moneda: newValue ? newValue.id : '' });
                  }}
                  renderInput={(params) => <TextField {...params} label="Moneda" />}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="form_price">Precio:</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  name="form_price"
                  id="form_price"
                  onChange={handleSearchChange}
                  value={searchFilter.form_price || ''}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="form_observacion">Observación:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_observacion"
                  id="form_observacion"
                  onChange={handleSearchChange}
                  value={searchFilter.form_observacion || ''}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="form_id_categoria">Categoría:</label>
                <Autocomplete
                  options={categorias}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_id_categoria: newValue ? newValue.id : '' });
                  }}
                  renderInput={(params) => <TextField {...params} label="Categoría" />}
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
                          {column.id === 'id_categoria' ? (
                            categorias.find((cat) => cat.id === row.id_categoria)?.name || ''
                          ) : column.id === 'image' ? (
                            <div>
                              {row.image ? (
                                <img
                                  src={API_HOST + row.image}
                                  alt={row.image}
                                  style={{
                                    maxWidth: '150px',
                                    maxHeight: '50px',
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                  }}
                                />

                              ) : 'Sin imagen'}
                            </div>
                          ) : column.id === 'price' ? (
                            `${row.moneda} ${row.price / 100}`
                          ) : (
                            row[column.id]
                          )}

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
              <h2 className="modal-title">Registre un nuevo producto</h2>
              <button onClick={handleCloseModal1} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="code">Código:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="code"
                        id="code"
                        onChange={handleSaveChange}
                        value={itemSave.code || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="name">Descripción:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        id="name"
                        onChange={handleSaveChange}
                        value={itemSave.name || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="observacion">Observación:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="observacion"
                        id="observacion"
                        onChange={handleSaveChange}
                        value={itemSave.observacion || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="num_part">Nro.Parte:</label>
                      <textarea
                        type="text"
                        className="form-control"
                        name="num_part"
                        id="num_part"
                        onChange={handleSaveChange}
                        value={itemSave.num_part || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="moneda">Moneda:(*)</label>
                      <Autocomplete
                        options={monedas}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                          setItemSave({ ...itemSave, moneda: newValue ? newValue.id : '' });
                        }}
                        value={monedas.find((cat) => cat.id === itemSave.moneda) || null}
                        renderInput={(params) => <TextField {...params} label="Moneda" />}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="price">Precio:(*)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        id="price"
                        onChange={handleSaveChange}
                        value={itemSave.price || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="id_categoria">Categoría:</label>
                      <Autocomplete
                        options={categorias}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                          setItemSave({ ...itemSave, id_categoria: newValue ? newValue.id : '' });
                        }}
                        value={categorias.find((cat) => cat.id === itemSave.id_categoria) || null}
                        renderInput={(params) => <TextField {...params} label="Categoría" />}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="image">Imagen:</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        name="image"
                        id="image"
                        onChange={handleImageChange}
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
              <h2 className="modal-title">Editar Producto</h2>
              <button onClick={handleCloseModal2} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="code">Código:(*)</label>
                      <textarea
                        type="text"
                        className="form-control"
                        name="code"
                        id="code"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.code || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="name">Descripción:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        id="name"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.name || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="num_part">Nro.Parte:</label>
                      <textarea
                        type="text"
                        className="form-control"
                        name="num_part"
                        id="num_part"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.num_part || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="observacion">Observación:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="observacion"
                        id="observacion"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.observacion || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="moneda">Moneda:(*)</label>
                      <Autocomplete
                        options={monedas}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                          handleEditChange("moneda", newValue ? newValue.id : '');
                        }}
                        value={monedas.find((cat) => cat.id === editedItem.moneda) || null}
                        renderInput={(params) => <TextField {...params} label="Moneda" />}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="price">Precio:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="price"
                        id="price"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.price || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="id_categoria">Categoría:</label>
                      <Autocomplete
                        options={categorias}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                          handleEditChange("id_categoria", newValue ? newValue.id : '');
                        }}
                        value={categorias.find((cat) => cat.id === editedItem.id_categoria) || null}
                        renderInput={(params) => <TextField {...params} label="Categoría" />}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="image">Imagen:</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        name="image"
                        id="image"
                        onChange={handleEditImageChange}
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
