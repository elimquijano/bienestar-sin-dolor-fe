import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { API_URL_LOCAL, fetchAPIAsync, notificationSwal, eliminarSwal, editarSwal } from 'common/common';

const columns = [
    { id: 'code', label: 'Código', minWidth: 20, key: 0 },
    { id: 'name', label: 'Nombre', minWidth: 170, key: 1 },
    { id: 'address', label: 'Dirección', minWidth: 100, key: 2 },
    { id: 'contact', label: 'Contacto', minWidth: 100, key: 3 },
];

export default function LocalPage() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchFilter, setSearchFilter] = React.useState({});
    const [filteredRows, setFilteredRows] = React.useState({});
    const [totalItems, setTotalItems] = React.useState(0);
    const [itemSave, setItemSave] = React.useState(0);
    const [editedItem, setEditedItem] = useState(0);
    const [openModal1, setOpenModal1] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);

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
            const result = await fetchAPIAsync(API_URL_LOCAL, filter, 'GET');
            setFilteredRows(result?.data);
            setTotalItems(result?.total);
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
            const result = await fetchAPIAsync(API_URL_LOCAL, itemSave, 'POST');
            notificationSwal('success', '¡Se registró ' + result.name + ' de forma exitosa!');
            handleCloseModal1();
            SearchFilter(page);
        } catch (e) {
            notificationSwal('error', e);
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
            address: editedItem.address,
            contact: editedItem.contact,
        };

        editarSwal(API_URL_LOCAL, elementoId, updatedData, SearchFilter);
        handleCloseModal2();
    }

    function handleEditar(row) {
        setEditedItem({
            id: row.id,
            code: row.code,
            name: row.name,
            address: row.address,
            contact: row.contact,
        });
    }

    function handleEliminar(row) {
        const elementoId = row.id;
        eliminarSwal(elementoId, API_URL_LOCAL, SearchFilter);
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
                <Button onClick={handleOpenModal1} className='btn btn-info mb-3'>Registrar local</Button>

                <div className="row content">
                    <div className="col-sm-9">
                        <form className="form row mb-4">
                            <div className="col-sm-4">
                                <label htmlFor="form_name">Nombre:</label>
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
                                <label htmlFor="form_address">Dirección:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="form_address"
                                    id="form_address"
                                    onChange={handleSearchChange}
                                    value={searchFilter.form_address || ''}
                                />
                            </div>
                            <div className="col-sm-4">
                                <label htmlFor="form_contact">Contacto:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="form_contact"
                                    id="form_contact"
                                    onChange={handleSearchChange}
                                    value={searchFilter.form_contact || ''}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="col-sm-3">
                        <button className="btn btn-success w-100 mb-1" onClick={() => SearchFilter()}>
                            <SearchIcon /> BUSCAR
                        </button>
                        <button className="btn btn-warning w-100 mb-1">
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
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </TableCell>
                                                );
                                            })}
                                            {/* Columna de botones de acción */}
                                            <TableCell>
                                                <Button onClick={() => {
                                                    handleOpenModal2();
                                                    handleEditar(row);
                                                }} className='btn btn-warning'>
                                                    <EditIcon />
                                                </Button>
                                                <Button className="btn btn-danger" onClick={() => handleEliminar(row)}>
                                                    <DeleteIcon />
                                                </Button>
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
                            <h2 className="modal-title">Registre un nuevo local</h2>
                            <button onClick={handleCloseModal1} className="btn btn-link">
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="name">Nombre:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        id="name"
                                        onChange={handleSaveChange}
                                        value={itemSave.name || ''}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Dirección:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address"
                                        id="address"
                                        onChange={handleSaveChange}
                                        value={itemSave.address || ''}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact">Contacto:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="contact"
                                        id="contact"
                                        onChange={handleSaveChange}
                                        value={itemSave.contact || ''}
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
                            <h2 className="modal-title">Editar Negocio</h2>
                            <button onClick={handleCloseModal2} className="btn btn-link">
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form >
                                <div className="form-group">
                                    <label htmlFor="code">Código:</label>
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
                                <div className="form-group">
                                    <label htmlFor="name">Nombre:</label>
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
                                <div className="form-group">
                                    <label htmlFor="address">Dirección:</label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        name="address"
                                        id="address"
                                        onChange={(event) => {
                                            const { name, value } = event.target;
                                            handleEditChange(name, value);
                                        }}
                                        value={editedItem.address || ''}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact">Contacto:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="contact"
                                        id="contact"
                                        onChange={(event) => {
                                            const { name, value } = event.target;
                                            handleEditChange(name, value);
                                        }}
                                        value={editedItem.contact || ''}
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
