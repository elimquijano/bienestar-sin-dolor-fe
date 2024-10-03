import React from 'react';
import { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import { API_URL_USER, notificationSwal,API_HOST,getSession ,createSession ,redirectToRelativePage } from 'common/common';

export default function PerfilPage() {
  const [userData, setUserData] = React.useState(null);
  const [openModal1, setOpenModal1] = React.useState(false);
  const [openModal2, setOpenModal2] = React.useState(false);
  const [editData, setEditData] = React.useState({});
  const [passwordData, setPasswordData] = React.useState({});

  useEffect(() => {
    cargaInicial();
  }, []);

  const cargaInicial = () => {
    const storedUserMail = localStorage.getItem('USER_MAIL');
    const userEmailWithoutQuotes = storedUserMail.replace(/^"(.*)"$/, '$1');

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(API_URL_USER + '?form_email=' + userEmailWithoutQuotes, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUserData(result.data[0]);
      })
      .catch((error) => console.log('error', error));
  };

  const handleEditUserData = () => {
    // Abre el modal y carga los datos actuales en el estado de edición
    setEditData({
      name: userData.name,
      ape_p: userData.ape_p,
      ape_m: userData.ape_m,
      dni: userData.dni,
      phone: userData.phone,
      avatarFile: userData.avatarFile
    });

    handleOpenModal1();
  };

  async function handleUpdateUserData() {
    const userId = userData.id;
    try {
      console.log(editData);
      const formdata = new FormData();
      formdata.append('name', editData.name);
      formdata.append('ape_p', editData.ape_p);
      formdata.append('ape_m', editData.ape_m);
      formdata.append('dni', editData.dni);
      formdata.append('phone', editData.phone);
      formdata.append('avatarFile', editData.avatarFile);
      formdata.append('userId', userId);

      const requestOptions = {
        method: 'POST',
        body: formdata
      };

      const response = await fetch(API_URL_USER + 'Update/' + userId, requestOptions);

      const result = await response.json();
      createSession('USER_AVATAR', result.data.avatar);

      notificationSwal('success', result.message);

      handleCloseModal1();
      
    } catch (error) {
      notificationSwal('error', 'No se pudo actualizar.');
    }
    redirectToRelativePage('/#/admin/perfil');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleConfirmPasswordChange = () => {
    const userId = userData.id;

    fetch(API_URL_USER + '/' + userId + '/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation
      })
    })
      .then((response) => response.json())
      .then((data) => {
        notificationSwal('success', data.message);
        handleCloseModal2();
      })
      .catch((error) => {
        notificationSwal('error', error);
      });
  };

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

  const handleEditChange = (value) => {
    setEditData((prevEditedItem) => ({
      ...prevEditedItem,
      avatarFile: value
    }));
  };

  const handleFileChange = (event) => {
    const { files } = event.target;
    const file = files[0]; // Obtener el primer archivo seleccionado

    if (file) {
      handleEditChange(file);
    } else {
      handleEditChange('');
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center">
      {userData && (
        <div className="card w-75">
          <div>
            <h1 className="card-header text-center bg-primary text-white">Mi Perfil</h1>
            <div className='profile-container'>
              <img src={API_HOST + getSession('USER_AVATAR')} id="AvatarAdminPerfil" alt="logo admin"></img>
            </div>
          </div>

          <div className="card-body text-center">
            <h5 className="card-title">Bienvenido(a)</h5>
            <h4 className="card-title">
              {userData.name} {userData.ape_p} {userData.ape_m}
            </h4>
            <h5 className="card-title mt-2">Tu información</h5>
            <div className="row">
              <div className="col">
                <p className="card-text font-weight-bold">DNI:</p>
                <p className="card-text">{userData.dni}</p>
              </div>
              <div className="col">
                <p className="card-text font-weight-bold">Teléfono:</p>
                <p className="card-text">{userData.phone}</p>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <p className="card-text font-weight-bold">Correo Electrónico:</p>
                <p className="card-text">{userData.email}</p>
              </div>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-center">
            <button className="btn btn-success mx-2" onClick={handleEditUserData}>
              Editar Datos
            </button>
            <button className="btn btn-primary mx-2" onClick={handleOpenModal2}>
              Cambiar Contraseña
            </button>
          </div>
        </div>
      )}

      {/* Si userData es null o aún no se ha cargado, puedes mostrar un mensaje de carga */}
      {!userData && <p className="text-center">Cargando datos del usuario...</p>}

      <Modal open={openModal1} onClose={handleCloseModal1} aria-labelledby="edit-modal-title" aria-describedby="edit-modal-description">
        <div className="modal-dialog modal-dialog-centered d-flex justify-content-center align-items-center">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title" id="edit-modal-title">
                Editar mis datos
              </h2>
              <button onClick={handleCloseModal1} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                {/* Campos de edición */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ape_p" className="form-label">
                    Primer Apellido:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ape_p"
                    value={editData.ape_p || ''}
                    onChange={(e) => setEditData({ ...editData, ape_p: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ape_m" className="form-label">
                    Segundo Apellido:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ape_m"
                    value={editData.ape_m || ''}
                    onChange={(e) => setEditData({ ...editData, ape_m: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="dni" className="form-label">
                    DNI:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="dni"
                    value={editData.dni || ''}
                    onChange={(e) => setEditData({ ...editData, dni: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Teléfono:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="avatarFile" className="form-label">
                    Avatar:
                  </label>
                  <input type="file" className="form-control" id="avatarFile" onChange={handleFileChange} />
                </div>
                {/* Agrega más campos según tus necesidades */}
              </form>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button className="btn btn-warning" onClick={handleUpdateUserData}>
                <EditIcon /> ACTUALIZAR
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={openModal2} onClose={handleCloseModal2} aria-labelledby="pass-modal-title" aria-describedby="pass-modal-description">
        <div className="modal-dialog modal-dialog-centered d-flex justify-content-center align-items-center">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Cambiar Contraseña</h2>
              <button onClick={handleCloseModal2} className="btn btn-link">
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="current_password">Contraseña Actual:</label>
                <input type="password" id="current_password" name="current_password" className="form-control" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="new_password">Nueva Contraseña:</label>
                <input type="password" id="new_password" name="new_password" className="form-control" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="new_password_confirmation">Confirmar Nueva Contraseña:</label>
                <input
                  type="password"
                  id="new_password_confirmation"
                  name="new_password_confirmation"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button className="btn btn-warning" onClick={handleConfirmPasswordChange}>
                <EditIcon /> Confirmar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
