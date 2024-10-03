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
import SearchIcon from '@mui/icons-material/Search';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { fetchAPIAsync, notificationSwal, API_URL_TDISPOSITIVOS } from 'common/common';

const columns = [
  { id: 'id', label: 'ID', minWidth: 10, key: 1 },
  { id: 'name', label: 'Placa', minWidth: 10, key: 2 },
  { id: 'Host_name', label: 'Municipalidad', minWidth: 50, key: 3 },
  { id: 'distance', label: 'Km. Recorridos', minWidth: 10, key: 4 },
  { id: 'status', label: 'Estado', minWidth: 10, key: 5 }
];

export default function TDispositivos() {
  const [page, setPage] = React.useState(0);
  const [host, setHost] = useState([]);
  const [status, setStatus] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchFilter, setSearchFilter] = React.useState({});
  const [filteredRows, setFilteredRows] = React.useState({});
  const [totalItems, setTotalItems] = React.useState(0);

  useEffect(() => {
    SearchFilter(page);
    fetch(API_URL_TDISPOSITIVOS + 'datahost')
      .then((response) => response.json())
      .then((data) => setHost(data))
      .catch((error) => console.error('Error en la solicitud de host:', error));
    fetch(API_URL_TDISPOSITIVOS + 'datastatus')
      .then((response) => response.json())
      .then((data) => setStatus(data))
      .catch((error) => console.error('Error en la solicitud de estados:', error));
  }, []);

  async function SearchFilter(numPage) {
    let filter = searchFilter;
    filter.page = numPage + 1;
    filter.paginate = rowsPerPage;
    if (numPage === undefined || numPage === null) {
      filter.page = page + 1;
    }
    try {
      const result = await fetchAPIAsync(API_URL_TDISPOSITIVOS, filter, 'GET');
      setFilteredRows(result?.data);
      setTotalItems(result?.total);
    } catch (error) {
      notificationSwal('error', error);
    }
  }
  async function ExportFilter() {
    console.log('Exportar no disponible');
  }

  function CleanFilter() {
    setFilteredRows({});
    setSearchFilter({});
    setPage(0);
    setRowsPerPage(10);
    setTotalItems(0);
  }

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchFilter((prevSearch) => ({
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

  return (
    <div>
      <div className="form">
        <div className="row content">
          <div className="col-sm-9">
            <form className="form row mb-4">
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_id_device">ID Dispositivo:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_id_device"
                  id="form_id_device"
                  onChange={handleSearchChange}
                  value={searchFilter.form_id_device || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_name">Placa:</label>
                <input
                  type="text"
                  className="form-control"
                  name="form_name"
                  id="form_name"
                  onChange={handleSearchChange}
                  value={searchFilter.form_name || ''}
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_host_name">Municipalidad:</label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={host}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_host_name: newValue ? newValue : '' });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  value={searchFilter.form_host_name || null}
                  size="small"
                />
              </div>
              <div className="col-md-6 col-xl-4">
                <label htmlFor="form_status">Estado:</label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={status}
                  onChange={(event, newValue) => {
                    setSearchFilter({ ...searchFilter, form_status: newValue ? newValue : '' });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  value={searchFilter.form_status || null}
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
                        <div></div>
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
    </div>
  );
}
