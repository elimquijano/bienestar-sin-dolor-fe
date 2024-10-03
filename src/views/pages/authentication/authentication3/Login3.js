import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';

const Login = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);

  return (
    <AuthWrapper1>
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
          <AuthCardWrapper>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item sx={{ mb: 3 }}>
                <Link to="#">
                  <Logo />
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction={'row'} alignItems="center" justifyContent="center">
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                      <Button
                        variant="outlined"
                        sx={{
                          cursor: 'unset',
                          m: 2,
                          py: 0.5,
                          px: 7,
                          borderColor: `${theme.palette.grey[100]} !important`,
                          color: `${theme.palette.grey[900]}!important`,
                          fontWeight: 500,
                          borderRadius: `${customization.borderRadius}px`
                        }}
                        disableRipple
                        disabled
                      >
                        <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                          Hola
                        </Typography>
                      </Button>

                      <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                      <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                        Introduce tus credenciales para continuar
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <AuthLogin />
              </Grid>
              <Grid item xs={12}>
                <Grid item container direction="column" alignItems="center" xs={12}>
                  <Typography component={Link} to="/register" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                    ¿Aún no tiene una cuenta?
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </AuthCardWrapper>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
