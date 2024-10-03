import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TableRow from '@mui/material/TableRow';
import SearchIcon from '@mui/icons-material/Search';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ImageIcon from '@mui/icons-material/Image';
import { fetchAPIAsync, notificationSwal, API_URL_IMAGE, API_URL_IMAGETYPE, API_HOST } from 'common/common';
import { exportToExcel } from 'common/MaterialExportToExel';
import { columnsImagesList } from 'common/ExportColums';

const columns = [
  { id: 'id', label: 'ID', minWidth: 10, key: 1 },
  { id: 'nombre', label: 'Nombre', minWidth: 10, key: 2 },
  { id: 'descripcion', label: 'Descripcion', minWidth: 50, key: 3 },
  { id: 'tipo', label: 'Tipo', minWidth: 10, key: 4 }
];
export default function PhotosPersoPage() {
  const [page, setPage] = useState(0);
  const [Tipo, setTipo] = useState([]);

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
    fetch(API_URL_IMAGETYPE)
      .then((response) => response.json())
      .then((data) => setTipo(data))
      .catch((error) => console.error('Error en la solicitud :', error));
  }, []);

  async function SearchFilter(numPage) {
    let filter = searchFilter;
    filter.page = numPage + 1;
    filter.paginate = rowsPerPage;
    if (numPage === undefined || numPage === null) {
      filter.page = page + 1;
    }
    try {
      const result = await fetchAPIAsync(API_URL_IMAGE, filter, 'GET');
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
      const result = await fetchAPIAsync(API_URL_IMAGE, filter, 'GET');
      console.log(result.data);
      if (result && result.data.length > 0) {
        exportToExcel(result.data, columnsImagesList, 'Images');
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
  //METODO POST
  async function SaveItem() {
    if (ValidacionItemSave(itemSave) === false) {
      return;
    }
    try {
      console.log(itemSave);
      const formdata = new FormData();
      formdata.append('nombre', itemSave.nombre);
      formdata.append('descripcion', itemSave.descripcion);
      formdata.append('tipo', itemSave.tipo);
      formdata.append('url', itemSave.url);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      fetch(API_URL_IMAGE, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          notificationSwal('success', result.message);
          handleCloseModal2();
          SearchFilter(page);
        });
    } catch (error) {
      console.log(error);
      notificationSwal('error', 'No se pudo registrar.');
      console.log(notificationSwal);
      handleCloseModal2();
    }
  }

  function ValidacionItemSave(itemSave) {
    let response = true;
    let msgResponse = '';

    if (!itemSave || Object.keys(itemSave).length === 0) {
      msgResponse += '* Debe completar los campos obligatorios.<br>';
      response = false;
    } else {
      if (!itemSave.nombre) {
        msgResponse += '* Debe agregar un NOMBRE.<br>';
        response = false;
      }
      if (!itemSave.descripcion) {
        msgResponse += '* Debe agregar DESCRIPCION.<br>';
        response = false;
      }
      if (!itemSave.tipo) {
        msgResponse += '* Debe agregar TIPO .<br>';
        response = false;
      }
      if (!itemSave.url) {
        msgResponse += '* Debe agregar URL .<br>';
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
    const { name, files } = event.target;

    setItemSave((prevSearch) => ({
      ...prevSearch,
      [name]: files ? files[0] : event.target.value
    }));
  };

  const handleEditChange = (name, value) => {
    setEditedItem((prevEditedItem) => ({
      ...prevEditedItem,
      [name]: value
    }));
  };

  const handleFileChange = (event) => {
    const { files } = event.target;
    const file = files[0]; // Obtener el primer archivo seleccionado
    if (file) {
      handleEditChange('url', file);
    } else {
      handleEditChange('url', '');
    }
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
      nombre: row.nombre,
      descripcion: row.descripcion,
      tipo: row.tipo,
      url: row.url
    });
  }

  //METODO PUT
  async function UpdateItem() {
    const elementoId = editedItem.id;
    
    try {
      const formdata = new FormData();
        formdata.append('nombre', editedItem.nombre);
        formdata.append('tipo', editedItem.tipo);
        formdata.append('descripcion', editedItem.descripcion);
        formdata.append('url', editedItem.url);
  
        const requestOptions = {
          method: 'POST',
          body: formdata
      };

      const response = await fetch(API_URL_IMAGE + 'Update/' + elementoId, requestOptions);
      const result = await response.json();

      notificationSwal('success', result.message);

      handleCloseModal1();
      SearchFilter(page);
    } catch (error) {
      console.log(error);
      notificationSwal('error', 'No se pudo actualizar.');
      handleCloseModal1();
    }
  }

  async function handleEliminar(row) {
    try {
      const requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };

      const response = await fetch(API_URL_IMAGE + '/' + row.id, requestOptions);
      const result = await response.json();
      notificationSwal('success', result.message);
      handleCloseModal2();
      SearchFilter(page);
    } catch (error) {
      console.error(error);
      notificationSwal('error', 'No se pudo eliminar.');
      handleCloseModal2();
    }
  }

  function handleVer(row) {
    console.log(row);
    const imageUrl = API_HOST + row.url;
    Swal.fire({
        title: 'Icono Personalizado',
        text: 'Nombre: ' + row.nombre,
        imageUrl: imageUrl,
        imageHeight: 200
    });
}

  const handleOpenModal1 = () => {
    setOpenModal1(true);
    setItemSave({ 
      nombre: '',
      descripcion: ''
    });
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
          Registrar Img Personalizado
        </Button>
        <div className="row content">
          <div className="col-sm-9">
            <form className="form row mb-4">
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_name_photo">NOMBRE:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_name_photo"
                  id="form_name_photo"
                  onChange={handleSearchChange}
                  value={searchFilter.form_name_photo || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_describe_photo">DESCRIPCION:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_describe_photo"
                  id="form_describe_photo"
                  onChange={handleSearchChange}
                  value={searchFilter.form_describe_photo || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                {' '}
                <label htmlFor="form_tipo_photo">TIPO:</label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Tipo}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_tipo_photo: newValue ? newValue : '' });
                  }}
                  renderInput={(params) => <TextField {...params} />}
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
                            handleVer(row);
                          }}
                          className="btn btn-info"
                        >
                          <ImageIcon />
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
              <h2 className="modal-title">Registre una nueva IMG</h2>
              <button onClick={handleCloseModal1} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="nombre">NOMBRE:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        id="nombre"
                        onChange={handleSaveChange}
                        value={itemSave.nombre || ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="descripcion">DESCRIPCION:</label>
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="tipo">TIPO::</label>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Tipo}
                        onChange={(event, newValue) => {
                          setItemSave({ ...itemSave, tipo: newValue ? newValue : '' });
                        }}
                        renderInput={(params) => <TextField {...params} label="Tipo" />}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="url">URL:</label>
                      <input type="file" className="url" name="url" id="url" onChange={handleSaveChange} />
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
              <h2 className="modal-title">Editar ICONO</h2>
              <button onClick={handleCloseModal2} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="nombre ">NOMBRE(*)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        id="nombre"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          handleEditChange(name, value);
                        }}
                        value={editedItem.nombre || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="descripcion ">DESCRIPCION(*)</label>
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
                      <label htmlFor="tipo">TIPO:(*)</label>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Tipo}
                        onChange={(event, newValue) => {
                          handleEditChange('tipo', newValue ? newValue : '');
                        }}
                        renderInput={(params) => <TextField {...params} label="Tipo" />}
                        value={editedItem.tipo || null}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="url">URL(*)</label>
                      <input type="file" 
                      className="form-control" 
                      name="url" id="url" 
                     onChange={handleFileChange} />

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
