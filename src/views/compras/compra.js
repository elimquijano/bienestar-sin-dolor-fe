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
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { exportToExcel } from 'common/MaterialExportToExel';
import { columnsComprasList } from 'common/ExportColums';
import {
  URL,
  API_URL_COMPRA,
  API_URL_PROVEEDOR,
  fetchAPIAsync,
  notificationSwal,
  eliminarSwal,
  editarSwal,
  ListLocales,
  redirectToRelativePage,
} from 'common/common';

const columns = [
  { id: 'id', label: 'ID', minWidth: 20, key: 0 },
  { id: 'reason', label: 'Razón', minWidth: 100, key: 1 },
  { id: 'name_proveedor', label: 'Proveedor', minWidth: 100, key: 2 },
  { id: 'name_negocio', label: 'Negocio', minWidth: 100, key: 3 },
  { id: 'receipt', label: 'Comprobante', minWidth: 50, key: 4 }
];
export default function CompraPage() {
  const [proveedores, setProveedores] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchFilter, setSearchFilter] = React.useState({});
  const [filteredRows, setFilteredRows] = React.useState({});
  const [totalItems, setTotalItems] = React.useState(0);
  const [itemSave, setitemSave] = React.useState(0);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [editedItem, setEditedItem] = useState(0);

  const localesList = ListLocales();

  async function SearchFilter(numPage) {
    let filter = searchFilter;
    filter.page = numPage + 1;
    filter.paginate = rowsPerPage;
    if (numPage === undefined || numPage === null) {
      filter.page = page + 1;
    }
    try {
      const result = await fetchAPIAsync(API_URL_COMPRA, filter, 'GET');
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
      const result = await fetchAPIAsync(API_URL_COMPRA, filter, 'GET');
      if (result) {
        exportToExcel(result.data, columnsComprasList, "Compras");
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
      const result = await fetchAPIAsync(API_URL_COMPRA, itemSave, 'POST');
      notificationSwal('success', '¡Se registró ' + result.reason + ' de forma exitosa!');
      handleCloseModal1();
      redirectToRelativePage('/#/admin/detcompra/' + result.id);
    } catch (error) {
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
      if (!itemSave.reason) {
        msgResponse += '* Debe agregar una razón o detalle.<br>';
        response = false;
      }
      if (!itemSave.neg_code) {
        msgResponse += '* Debe seleccionar un Local o Negocio.<br>';
        response = false;
      }
      if (!itemSave.id_proveedor) {
        msgResponse += '* Debe seleccionar un proveedor.<br>';
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
    setitemSave((prevSearch) => ({
      ...prevSearch,
      [name]: value
    }));
  };

  const handleEditReceiptChange = (e) => {
    const file = e.target.files[0];
    setEditedItem({ ...editedItem, receipt: file });
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    setitemSave({ ...itemSave, receipt: file });
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
      reason: editedItem.reason,
      receipt: editedItem.receipt,
      id_proveedor: editedItem.id_proveedor,
      neg_code: editedItem.neg_code
    };
    editarSwal(API_URL_COMPRA, elementoId, updatedData, SearchFilter);
    handleCloseModal2();
  }

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
      reason: row.reason,
      receipt: row.receipt,
      id_proveedor: row.id_proveedor,
      neg_code: row.neg_code
    });
  }

  function handleEliminar(row) {
    const elementoId = row.id;
    eliminarSwal(elementoId, API_URL_COMPRA, SearchFilter);
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

  function viewReceipt(receiptUrl) {
    if (receiptUrl !== null) {
      window.open(URL + receiptUrl, '_blank');
    } else {
      notificationSwal('warning', 'Sin comprobante');
    }
  }

  useEffect(() => {
    SearchFilter(page);
    fetch(API_URL_PROVEEDOR + 'data')
      .then((response) => response.json())
      .then((data) => setProveedores(data))
      .catch((error) => console.error('Error en la solicitud de proveedores:', error));
  }, []);

  return (
    <div>
      <div className="form">
        <Button onClick={handleOpenModal1} className="btn btn-info mb-3">
          Registrar compra
        </Button>
        <div className="row content">
          <div className="col-sm-9">
            <form className="form row mb-4">
              <div className="col-sm-4">
                <label htmlFor="form_reason">Razón:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_reason"
                  id="form_reason"
                  onChange={handleSearchChange}
                  value={searchFilter.form_reason || ''}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="form_id_proveedor">Proveedor:</label>
                <Autocomplete
                  options={proveedores}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_id_proveedor: newValue ? newValue.id : '' });
                  }}
                  renderInput={(params) => <TextField {...params} label="Proveedores" />}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="form_code">Negocio:</label>
                <Autocomplete
                  options={localesList}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_code: newValue ? newValue.code : '' });
                  }}
                  renderInput={(params) => <TextField {...params} label="Negocios" />}
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
                  <TableCell>Detalles</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'receipt' ? (
                            <div>
                              <button className="btn btn-primary" onClick={() => viewReceipt(row[column.id])}>
                                <VisibilityIcon />
                              </button>
                            </div>
                          ) : (
                            row[column.id]
                          )}
                        </TableCell>
                      ))}
                      {/* Columna de botones de acción */}
                      <TableCell>
                        <a href={`#/admin/detcompra/${row.id}`} className="btn btn-secondary">
                          <PlaylistAddIcon />
                        </a>
                      </TableCell>
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
              <h2 className="modal-title">Registre una nueva compra</h2>
              <button onClick={handleCloseModal1} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="reason">Razón(*):</label>
                      <textarea
                        type="text"
                        className="form-control"
                        name="reason"
                        id="reason"
                        onChange={handleSaveChange}
                        value={itemSave.reason || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="receipt">Comprobante:</label>
                      <input
                        type="file"
                        accept=".pdf, .jpg, .jpeg, .png"
                        className="form-control"
                        name="receipt"
                        id="receipt"
                        onChange={handleReceiptChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="id_proveedor">Proveedor(*):</label>
                      <Autocomplete
                        options={proveedores}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                          setitemSave({ ...itemSave, id_proveedor: newValue ? newValue.id : '' });
                        }}
                        value={proveedores.find((prov) => prov.id === itemSave.id_proveedor) || null}
                        renderInput={(params) => <TextField {...params} label="Proveedor" />}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="neg_code">Negocio(*):</label>
                      <Autocomplete
                        options={localesList}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                          setitemSave({ ...itemSave, neg_code: newValue ? newValue.code : '' });
                        }}
                        value={localesList.find((loc) => loc.code === itemSave.neg_code) || null}
                        renderInput={(params) => <TextField {...params} label="Negocio" />}
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
              <h2 className="modal-title">Editar Compra</h2>
              <button onClick={handleCloseModal2} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="form-group">
                  <label htmlFor="reason">Razón:</label>
                  <textarea
                    type="text"
                    className="form-control"
                    name="reason"
                    id="reason"
                    onChange={(event) => {
                      const { name, value } = event.target;
                      handleEditChange(name, value);
                    }}
                    value={editedItem.reason || ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="id_proveedor">Proveedor:</label>
                  <Autocomplete
                    options={proveedores}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      handleEditChange('id_proveedor', newValue ? newValue.id : '');
                    }}
                    value={proveedores.find((cat) => cat.id === editedItem.id_proveedor) || null}
                    renderInput={(params) => <TextField {...params} label="Proveedor" />}
                  />
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="receipt">Comprovante:</label>
                    <input
                      type="file"
                      accept=".pdf, .jpg, .jpeg, .png"
                      className="form-control"
                      name="receipt"
                      id="receipt"
                      onChange={handleEditReceiptChange}
                    />
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
