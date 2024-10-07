import { Link } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import { CameraAlt, Facebook, Google } from '@mui/icons-material';

const Login = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
          <AuthCardWrapper>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12}>
                <Grid container direction={'row'} alignItems="center" justifyContent="center">
                  <Stack alignItems="center" justifyContent="center">
                    <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                      Iniciar Sesión
                    </Typography>
                  </Stack>
                  <Grid item>
                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                      <Typography variant="caption" fontSize="14px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                        Ingresa tus credenciales para continuar
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
                  <Typography variant="subtitle1" sx={{ textDecoration: 'none' }}>
                    O continúa con
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container direction="row" justifyContent={'space-around'} alignItems={'center'} xs={12}>
                <Button variant="outlined" color={'secondary'}>
                  <Google />
                </Button>
                <Button variant="outlined" color={'secondary'}>
                  <Facebook />
                </Button>
                <Button variant="outlined" color={'secondary'}>
                  <CameraAlt />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Grid item container direction="column" alignItems="center" xs={12}>
                  <Typography
                    component={Link}
                    to="/register"
                    variant="subtitle1"
                    sx={{ textDecoration: 'none', color: theme.palette.secondary.main }}
                  >
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
