import * as React from 'react';
import { useEffect } from 'react';
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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { API_URL_GLOGS, fetchAPIAsync, notificationSwal } from 'common/common';
import { exportToExcel } from 'common/MaterialExportToExel';
import { columnsGRetransmissionLogsList } from 'common/ExportColums';

const columns = [
  { id: 'id', label: 'ID', minWidth: 10, key: 0 },
  { id: 'fecha_hora', label: 'Registro', minWidth: 50, key: 1 },
  { id: 'nivel', label: 'Nivel', minWidth: 10, key: 2 },
  { id: 'placa', label: 'Placa', minWidth: 10, key: 3 },
  { id: 'host', label: 'Host', minWidth: 50, key: 4 },
  { id: 'jsonSend', label: 'Send', minWidth: 50, key: 5 },
  { id: 'response', label: 'Respuesta', minWidth: 80, key: 6 },
  { id: 'origen', label: 'Origen', minWidth: 10, key: 7 }
];

export default function GRetransmissionLogs() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchFilter, setSearchFilter] = React.useState({});
  const [filteredRows, setFilteredRows] = React.useState({});
  const [totalItems, setTotalItems] = React.useState(0);

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
      console.log(filter);
      const result = await fetchAPIAsync(API_URL_GLOGS, filter, 'GET');
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
      const result = await fetchAPIAsync(API_URL_GLOGS, filter, 'GET');
      if (result && result.data.length > 0) {
        exportToExcel(result.data, columnsGRetransmissionLogsList, 'Logs');
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
        <div className="content">
          <h1>Retransmision Logs</h1>
          <hr></hr>
          <div className="row">
            <div className="col-sm-9">
              <form className="form row mb-4">
                <div className="col-md-6 col-xl-4">
                  <label htmlFor="form_nivel">NIVEL:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="form_nivel"
                    id="form_nivel"
                    onChange={handleSearchChange}
                    value={searchFilter.form_nivel || ''}
                  />
                </div>
                <div className="col-md-6 col-xl-4">
                  <label htmlFor="form_placa">PLACA:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="form_placa"
                    id="form_placa"
                    onChange={handleSearchChange}
                    value={searchFilter.form_placa || ''}
                  />
                </div>
                <div className="col-md-6 col-xl-4">
                  <label htmlFor="form_host">Host:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="form_host"
                    id="form_host"
                    onChange={handleSearchChange}
                    value={searchFilter.form_host || ''}
                  />
                </div>
                <div className="col-md-6 col-xl-4">
                  <label htmlFor="form_origen">Origen:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="form_origen"
                    id="form_origen"
                    onChange={handleSearchChange}
                    value={searchFilter.form_origen || ''}
                  />
                </div>
                <div className="col-md-6 col-xl-4">
                  <label htmlFor="form_desde_fecha">Desde:</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="form_desde_fecha"
                    id="form_desde_fecha"
                    onChange={handleSearchChange}
                    value={searchFilter.form_desde_fecha || ''}
                  />
                </div>
                <div className="col-md-6 col-xl-4">
                  <label htmlFor="form_hasta_fecha">Hasta:</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="form_hasta_fecha"
                    id="form_hasta_fecha"
                    onChange={handleSearchChange}
                    value={searchFilter.form_hasta_fecha || ''}
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
