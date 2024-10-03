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
import {
  API_URL_EXISTENCIA,
  API_URL,
  API_URL_PRODUCTO,
  API_URL_LOCAL,
  fetchAPIAsync,
  notificationSwal,
  eliminarSwal,
  editarSwal,
  API_URL_PRODUCTOSPDF,
  descargarDocumento
} from 'common/common';

const columns = [
  { id: 'id', label: 'ID', minWidth: 20, key: 0 },
  { id: 'id_producto', label: 'Producto', minWidth: 100, key: 1 },
  { id: 'amount', label: 'Cantidad', minWidth: 100, key: 2 },
  { id: 'price', label: 'Precio', minWidth: 100, key: 3 },
  { id: 'id_negocio', label: 'Local', minWidth: 100, key: 4 }
];

export default function ExistenciaPage() {
  const [productos, setProductos] = React.useState([]);
  const [locales, setLocales] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchFilter, setSearchFilter] = React.useState({});
  const [filteredRows, setFilteredRows] = React.useState({});
  const [totalItems, setTotalItems] = React.useState(0);
  const [itemSave, setItemSave] = React.useState({
    id_negocio_origen: 1
  });
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [editedItem, setEditedItem] = useState(0);

  useEffect(() => {
    SearchFilter(page);
  }, []);

  async function SearchFilter(numPage) {
    let filter = searchFilter;
    filter.page = numPage + 1;
    filter.paginate = rowsPerPage;
    if (numPage === undefined || numPage === null) {
      filter.page = page + 1;
    }
    try {
      const result = await fetchAPIAsync(API_URL_EXISTENCIA, filter, 'GET');
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
      await descargarDocumento(API_URL_PRODUCTOSPDF, 'products');
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
    try {
      const result = await fetchAPIAsync(API_URL + 'reassignStock', itemSave, 'POST');
      notificationSwal('success', '¡Se registró ' + result.name + ' de forma exitosa!');
      handleCloseModal1();
      SearchFilter(page);
    } catch (_) {
      notificationSwal('error', 'No se pudo registrar.');
      handleCloseModal1();
    }
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

  const handleEditChange = (name, value) => {
    setEditedItem((prevEditedItem) => ({
      ...prevEditedItem,
      [name]: value
    }));
  };

  async function updateItem() {
    const elementoId = editedItem.id;
    const updatedData = {
      id_producto: editedItem.id_producto,
      amount: editedItem.amount,
      id_negocio: editedItem.id_negocio
    };

    editarSwal(API_URL_EXISTENCIA, elementoId, updatedData, SearchFilter);
    handleCloseModal2();
  }

  function handleEditar(row) {
    setEditedItem({
      id: row.id,
      edit_name: row.name,
      edit_description: row.description,
      edit_price: row.price,
      edit_barcode: row.barcode,
      edit_id_categoria: row.id_categoria
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
    eliminarSwal(elementoId, API_URL_EXISTENCIA, SearchFilter);
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

  useEffect(() => {
    fetch(API_URL_PRODUCTO + 'data')
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error('Error:', error));

    fetch(API_URL_LOCAL + 'data')
      .then((response) => response.json())
      .then((data) => setLocales(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div>
      <div className="form">
        <Button onClick={handleOpenModal1} className="btn btn-info mb-3">
          Reasignar existencia
        </Button>
        <div className="row content">
          <div className="col-sm-9">
            <form className="form row mb-4">
              <div className="col-sm-4">
                <label htmlFor="form_id_producto">Producto:</label>
                <Autocomplete
                  options={productos}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_id_producto: newValue ? newValue.id : '' });
                  }}
                  renderInput={(params) => <TextField {...params} label="Producto" />}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="form_amount">Cantidad:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_amount"
                  id="form_amount"
                  onChange={handleSearchChange}
                  value={searchFilter.form_amount || ''}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="form_id_negocio">Negocio:</label>
                <Autocomplete
                  options={locales}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_id_negocio: newValue ? newValue.id : '' });
                  }}
                  renderInput={(params) => <TextField {...params} label="Local" />}
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
                          {column.id == 'id_producto'
                            ? productos.find((prod) => prod.id == row.id_producto)?.name || ''
                            : column.id == 'id_negocio'
                            ? locales.find((loc) => loc.id == row.id_negocio)?.name || ''
                            : row[column.id]}
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
              <h2 className="modal-title">Registre un nuevo existencia</h2>
              <button onClick={handleCloseModal1} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="id_negocio_origen">Negocio origen:</label>
                  <Autocomplete
                    options={locales}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setItemSave({ ...itemSave, id_negocio_origen: newValue ? newValue.id : '' });
                    }}
                    value={locales.find((neg) => neg.id === itemSave.id_negocio_origen) || locales.find((neg) => neg.id === 1) || null}
                    renderInput={(params) => <TextField {...params} label="Local" />}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="id_producto">Producto:</label>
                  <Autocomplete
                    options={productos}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setItemSave({ ...itemSave, id_producto: newValue ? newValue.id : '' });
                    }}
                    value={productos.find((prod) => prod.id === itemSave.id_producto) || null}
                    renderInput={(params) => <TextField {...params} label="Producto" />}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Cantidad:</label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    id="amount"
                    onChange={handleSaveChange}
                    value={itemSave.amount || ''}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Precio:</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    id="price"
                    onChange={handleSaveChange}
                    value={itemSave.price || ''}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="id_negocio_destino">Negocio destino</label>
                  <Autocomplete
                    options={locales}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setItemSave({ ...itemSave, id_negocio_destino: newValue ? newValue.id : '' });
                    }}
                    value={locales.find((cat) => cat.id === itemSave.id_negocio_destino) || null}
                    renderInput={(params) => <TextField {...params} label="Local" />}
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
                <div className="form-group">
                  <label htmlFor="id_producto">Producto:</label>
                  <Autocomplete
                    options={productos}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      handleEditChange({ ...itemSave, id_producto: newValue ? newValue.id : '' });
                    }}
                    value={productos.find((prod) => prod.id === itemSave.id_producto) || null}
                    renderInput={(params) => <TextField {...params} label="Categoría" />}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit_price">Precio:</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    name="edit_price"
                    id="edit_price"
                    onChange={(event) => {
                      const { name, value } = event.target;
                      handleEditChange(name, value);
                    }}
                    value={editedItem.edit_price || ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="id_negocio">Categoría:</label>
                  <Autocomplete
                    options={locales}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      handleEditChange({ ...itemSave, id_negocio: newValue ? newValue.id : '' });
                    }}
                    value={locales.find((cat) => cat.id === itemSave.id_negocio) || null}
                    renderInput={(params) => <TextField {...params} label="Categoría" />}
                  />
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
