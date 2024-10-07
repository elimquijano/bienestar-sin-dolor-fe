import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Modal,
  Avatar,
  Select,
  MenuItem,
  Grid,
  Button,
  Paper,
  IconButton,
  InputLabel,
  FormControl
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Person as PersonIcon,
  PersonOutline as PersonOutlineIcon,
  Email as EmailIcon,
  DateRange as DateRangeIcon,
  Wc as WcIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Password as PasswordIcon
} from '@mui/icons-material';

import { API_HOST, API_URL_USER, createSession, getSession, notificationSwal, redirectToRelativePage } from 'common/common';
import AppContentHeader from 'layout/MainLayout/HeaderContent';

function AccountScreen() {
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({});

  useEffect(() => {
    cargaInicial();
  }, []);

  const cargaInicial = () => {
    setUserData(getSession('USER_SESSION'));
  };

  const handleEditUserData = () => {
    // Abre el modal y carga los datos actuales en el estado de edición
    setEditData({
      name: userData.name,
      dni: userData.dni,
      phone: userData.phone,
      birthdate: userData.birthdate,
      gender: userData.gender
    });

    handleOpenModal1();
  };

  async function handleUpdateUserData() {
    const userId = userData.id;
    try {
      const formdata = new FormData();
      formdata.append('name', editData.name);
      formdata.append('ape_p', editData.ape_p);
      formdata.append('ape_m', editData.ape_m);
      formdata.append('dni', editData.dni);
      formdata.append('phone', editData.phone);
      formdata.append('avatarFile', editData.avatarFile);
      formdata.append('birthDate', editData.birthDate);
      formdata.append('gender', editData.gender);
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
      redirectToRelativePage('/#/config');
    } catch (error) {
      notificationSwal('error', 'No se pudo actualizar.');
    }
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

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatarFile') {
      setEditData((prevEditedItem) => ({
        ...prevEditedItem,
        [name]: files[0]
      }));
    } else {
      setEditData((prevEditedItem) => ({
        ...prevEditedItem,
        [name]: value
      }));
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[200],
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <AppContentHeader isDark={false} />
      {userData && (
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
            <Box
              sx={{
                alignItems: 'center',
                padding: 2,
                width: '100%',
                backgroundColor: theme.palette.secondary.main
              }}
            >
              <Avatar
                src={API_HOST + userData.image || ''}
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto',
                  backgroundColor: theme.palette.secondary.main
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: 1,
                  color: theme.palette.background.default
                }}
              >
                {userData?.firstname} {userData?.lastname}
              </Typography>
            </Box>
            <Paper sx={{ margin: 2, padding: 2 }}>
              {/* Nombre */}
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <PersonIcon sx={{ color: 'secondary.main', marginRight: 1 }} />
                <TextField label="Nombre" value={userData.firstname || ''} variant="standard" InputProps={{ readOnly: true }} fullWidth />
              </Box>
              {/* Apellido */}
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <PersonOutlineIcon sx={{ color: 'secondary.main', marginRight: 1 }} />
                <TextField
                  label="Apellidos"
                  value={`${userData?.lastname || ''}`}
                  variant="standard"
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Box>
              {/* Email */}
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <EmailIcon sx={{ color: 'secondary.main', marginRight: 1 }} />
                <TextField label="Email" value={userData.email} variant="standard" InputProps={{ readOnly: true }} fullWidth />
              </Box>
              {/* Fecha de Nacimiento */}
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <DateRangeIcon sx={{ color: 'secondary.main', marginRight: 1 }} />
                <TextField
                  label="Fecha de Nacimiento"
                  value={userData.birthdate || ''}
                  variant="standard"
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Box>
              {/* Género */}
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <WcIcon sx={{ color: 'secondary.main', marginRight: 1 }} />
                <TextField label="Género" value={userData?.gender || ''} variant="standard" InputProps={{ readOnly: true }} fullWidth />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', paddingY: 3, gap: 2 }}>
                <Button color="secondary" variant="outlined" onClick={handleEditUserData} startIcon={<EditIcon />}>
                  Editar Datos
                </Button>
                <Button color="secondary" variant="outlined" onClick={handleOpenModal2} startIcon={<PasswordIcon />}>
                  Cambiar Contraseña
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}
      {!userData && <Typography align="center">Cargando datos del usuario...</Typography>}

      <Modal open={openModal1} onClose={handleCloseModal1} aria-labelledby="edit-modal-title">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
            width: '90%',
            maxWidth: 600
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Editar mis datos</Typography>
            <IconButton onClick={handleCloseModal1}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="DNI" name="dni" value={editData.dni || ''} onChange={handleEditChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre" name="name" value={editData.name || ''} onChange={handleEditChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Primer Apellido" name="ape_p" value={editData.ape_p || ''} onChange={handleEditChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Segundo Apellido" name="ape_m" value={editData.ape_m || ''} onChange={handleEditChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Nacimiento"
                name="birthDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={editData.birthDate || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Teléfono" name="phone" value={editData.phone || ''} onChange={handleEditChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Género</InputLabel>
                <Select labelId="gender-label" name="gender" value={editData.gender || ''} onChange={handleEditChange} label="Género">
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Perfil"
                name="avatarFile"
                type="file"
                InputLabelProps={{ shrink: true }}
                inputProps={{ accept: 'image/*' }}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="center" mt={4}>
            <Button variant="contained" color="primary" onClick={handleUpdateUserData} startIcon={<EditIcon />}>
              Actualizar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal open={openModal2} onClose={handleCloseModal2} aria-labelledby="pass-modal-title">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
            width: '90%',
            maxWidth: 600
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Cambiar Contraseña</Typography>
            <IconButton onClick={handleCloseModal2}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box component="form">
            <TextField
              label="Contraseña Actual"
              name="current_password"
              type="password"
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField label="Nueva Contraseña" name="new_password" type="password" onChange={handleChange} fullWidth margin="normal" />
            <TextField
              label="Confirmar Nueva Contraseña"
              name="new_password_confirmation"
              type="password"
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Box>
          <Box display="flex" justifyContent="center" mt={4}>
            <Button variant="contained" color="primary" onClick={handleConfirmPasswordChange} startIcon={<EditIcon />}>
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default AccountScreen;
