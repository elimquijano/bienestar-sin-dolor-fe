import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Autocomplete,
  CircularProgress
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { API_URL_USER, notificationSwal, postData, redirectToRelativePage } from 'common/common';

const FirebaseRegister = ({ ...others }) => {
  const scriptedRef = useScriptRef();
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('123456');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          firstname: '',
          lastname: '',
          gender: '',
          birthdate: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Debe ser un correo electrónico válido').max(255).required('El correo electrónico es obligatorio'),
          password: Yup.string().max(255).required('La contraseña es obligatoria'),
          firstname: Yup.string().max(255).required('El nombre es obligatorio'),
          lastname: Yup.string().max(255).required('El apellido es obligatorio'),
          gender: Yup.string().required('El género es obligatorio'),
          birthdate: Yup.date().required('La fecha de nacimiento es obligatoria').nullable()
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const result = await postData(API_URL_USER, values);
            if (result) {
              setStatus({ success: true });
              notificationSwal('info', `${result?.firstname}, su cuenta fue creada exitosamente, inicie sesión`);
              setTimeout(function () {
                redirectToRelativePage('/#/login');
              }, 3000);
            } else {
              setStatus({ success: false });
              setErrors({ submit: result });
              setSubmitting(false);
            }

            if (scriptedRef.current) {
              setSubmitting(false);
            }
          } catch (err) {
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(touched.firstname && errors.firstname)}>
                  <TextField
                    label="Nombres"
                    name="firstname"
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstname}
                    error={Boolean(touched.firstname && errors.firstname)}
                  />
                  {touched.firstname && errors.firstname && (
                    <FormHelperText error id="standard-weight-helper-text-firstname-register">
                      {errors.firstname}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(touched.lastname && errors.lastname)}>
                  <TextField
                    label="Apellidos"
                    name="lastname"
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastname}
                    error={Boolean(touched.lastname && errors.lastname)}
                  />
                  {touched.lastname && errors.lastname && (
                    <FormHelperText error id="standard-weight-helper-text-lastname-register">
                      {errors.lastname}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                  <TextField
                    fullWidth
                    label="Dirección de correo electrónico"
                    name="email"
                    type="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-register">
                      {errors.email}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(touched.gender && errors.gender)}>
                  <Autocomplete
                    options={[
                      { label: 'Masculino', value: 'Masculino' },
                      { label: 'Femenino', value: 'Femenino' },
                      { label: 'Otro', value: 'Otro' }
                    ]}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, newValue) => {
                      handleChange({
                        target: {
                          name: 'gender',
                          value: newValue ? newValue.value : ''
                        }
                      });
                    }}
                    onBlur={handleBlur}
                    renderInput={(params) => (
                      <TextField {...params} label="Género" error={Boolean(touched.gender && errors.gender)} helperText={errors.gender} />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(touched.birthdate && errors.birthdate)}>
                  <TextField
                    fullWidth
                    label="Fecha de nacimiento"
                    name="birthdate"
                    type="date"
                    onChange={handleChange}
                    value={values.birthdate}
                    InputLabelProps={{
                      shrink: true // Mantiene la etiqueta elevada
                    }}
                    error={Boolean(touched.birthdate && errors.birthdate)}
                  />
                  {touched.birthdate && errors.birthdate && (
                    <FormHelperText error id="standard-weight-helper-text-birthdate-register">
                      {errors.birthdate}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    value={values.password}
                    error={Boolean(touched.password && errors.password)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-register">
                      {errors.password}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Grid container>
              {strength !== 0 && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Box sx={{ mb: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle1" fontSize="0.75rem">
                            {level?.label}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                      }
                      label={
                        <Typography variant="subtitle1">
                          Aceptar &nbsp;
                          <Typography variant="subtitle1" component={Link} to="#">
                            Términos y condiciones.
                          </Typography>
                        </Typography>
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 3 }}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Box>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="secondary"
                    >
                      {isSubmitting ? <CircularProgress color="secondary" /> : 'Regístrate'}
                    </Button>
                  </AnimateButton>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseRegister;
