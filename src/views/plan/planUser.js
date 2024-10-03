import * as React from 'react';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import TableRow from '@mui/material/TableRow';
import Modal from '@mui/material/Modal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { fetchAPIAsync, notificationSwal, API_URL_PLAN, editarSwal, eliminarSwal } from 'common/common';
import { exportToExcel } from 'common/MaterialExportToExel';
import { columnsPlanList } from 'common/ExportColums';
import TitleFormCommon from 'common/TitleForm';
import MaterialButton from 'common/MaterialButton';

const columns = [
  { id: 'id', label: 'ID', minWidth: 10, key: 1 },
  { id: 'nombre', label: 'Nombre', minWidth: 10, key: 2 },
  { id: 'detalle', label: 'Detalle', minWidth: 50, key: 3 },
  { id: 'costo', label: 'Costo', minWidth: 10, key: 4 }
];
export default function PlanUserPage() {
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
  }, []);

  async function SearchFilter(numPage) {
    let filter = searchFilter;
    filter.page = numPage + 1;
    filter.paginate = rowsPerPage;
    if (numPage === undefined || numPage === null) {
      filter.page = page + 1;
    }
    try {
      const result = await fetchAPIAsync(API_URL_PLAN, filter, 'GET');
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
      const result = await fetchAPIAsync(API_URL_PLAN, filter, 'GET');
      console.log(result.data); // Verificar los datos recibidos en la consola
      if (result && result.data.length > 0) {
        exportToExcel(result.data, columnsPlanList, 'Plan');
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
    try {
      const result = await fetchAPIAsync(API_URL_PLAN, itemSave, 'POST');
      notificationSwal('success', '¡Se registró  de forma exitosa!');
      handleCloseModal1();
      SearchFilter(page);
      console.log(result);
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
      if (!itemSave.form_name_plan) {
        msgResponse += '* Debe agregar un NOMBRE.<br>';
        response = false;
      }
      if (!itemSave.form_detail_plan) {
        msgResponse += '* Debe agregar DETALLLE.<br>';
        response = false;
      }
      if (!itemSave.form_costo_plan) {
        msgResponse += '* Debe agregar COLOR .<br>';
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

  const handleEditChange = (name, value) => {
    setEditedItem((prevEditedItem) => ({
      ...prevEditedItem,
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
      form_name_plan: row.nombre,
      form_detail_plan: row.detalle,
      form_costo_plan: row.costo
    });
  }

  //METODO PUT
  async function UpdateItem() {
    const elementoId = editedItem.id;
    const updatedData = {
      form_name_plan: editedItem.form_name_plan,
      form_detail_plan: editedItem.form_detail_plan,
      form_costo_plan: editedItem.form_costo_plan
    };
    if (ValidacionItemSave(updatedData) === false) {
      return false;
    }
    editarSwal(API_URL_PLAN, elementoId, updatedData, SearchFilter);
    handleCloseModal2();
  }

  function handleEliminar(row) {
    const elementoId = row.id;
    eliminarSwal(elementoId, API_URL_PLAN, SearchFilter);
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
        <MaterialButton
          title="Registrar Usuario"
          colorbutton="btn-info mb-3"
          onClick={handleOpenModal1}
          icon="save"
          privilegeName={'PRIV_BTN_PLAN_SAVE'}
        />
        <div className="row content">
          <TitleFormCommon titleText={'Plan'} />
          <div className="col-sm-9">
            <form className="form row mb-4">
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_name_plan">NOMBRE:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_name_plan"
                  id="form_name_plan"
                  onChange={handleSearchChange}
                  value={searchFilter.form_name_plan || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_detail_plan">DETALLE:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_detail_plan"
                  id="form_detail_plan"
                  onChange={handleSearchChange}
                  value={searchFilter.form_detail_plan || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_costo_plan">COSTO:</label>
                <input
                  type="number"
                  className="form-control"
                  name="form_costo_plan"
                  id="form_costo_plan"
                  onChange={handleSearchChange}
                  value={searchFilter.form_costo_plan || ''}
                />
              </div>
            </form>
          </div>
          <div className="col-sm-3">
            <MaterialButton
              title="BUSCAR"
              colorbutton="btn-success  w-100 mb-1"
              onClick={() => SearchFilter()}
              icon="search"
              privilegeName={'PRIV_BTN_PLAN_SEARCH'}
            />
            <MaterialButton
              title="EXPORTAR"
              colorbutton="btn-success  w-100 mb-1"
              onClick={() => ExportFilter()}
              icon="export"
              privilegeName={'PRIV_BTN_PLAN_EXPORT'}
            />
            <MaterialButton title="limpiar" colorbutton="btn-danger w-100 mb-1" onClick={CleanFilter} icon="clean" />
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
                      {/* <MaterialButton
                          colorbutton="btn-info"
                          onClick={() => {
                            handleInfo(row);
                          }}
                          icon="eye"
                          privilegeName={'PRIV_BTN_ROL_VER'}
                        /> */}
                        <MaterialButton
                          colorbutton="btn-warning"
                          onClick={() => {
                            handleOpenModal2();
                            handleEditar(row);
                          }}
                          icon="edit"
                          privilegeName={'PRIV_BTN_PLAN_EDIT'}
                        />
                        <MaterialButton
                          colorbutton="btn-danger"
                          onClick={() => {
                            () => handleEliminar(row);
                          }}
                          icon="delete"
                          privilegeName={'PRIV_BTN_PLAN_DELETE'}
                        />
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
                      <label htmlFor="form_name_plan">NOMBRE:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="form_name_plan"
                        id="form_name_plan"
                        onChange={handleSaveChange}
                        value={itemSave.form_name_plan || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="form_detail_plan">DETALLE:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="form_detail_plan"
                      id="form_detail_plan"
                      onChange={handleSaveChange}
                      value={itemSave.form_detail_plan || ''}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="form_costo_plan">COSTO:</label>
                      <input
                        type="number"
                        className="form-control"
                        name="form_costo_plan"
                        id="form_costo_plan"
                        onChange={handleSaveChange}
                        value={itemSave.form_costo_plan || ''}
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
                    <div className="form-group">
                      <label htmlFor="form_name_plan">Nombre(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="form_name_plan"
                        id="form_name_plan"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.form_name_plan || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="form_detail_plan">Detalle(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="form_detail_plan"
                        id="form_detail_plan"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.form_detail_plan || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="form_costo_plan">COSTO:(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="form_costo_plan"
                        id="form_costo_plan"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.form_costo_plan || ''}
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
