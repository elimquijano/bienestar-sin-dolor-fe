import { Outlet } from 'react-router-dom';

// Project imports
import Customization from '../Customization';
import { Box } from '@mui/material';

const BackgroundSvg = () => {
  return (
    <Box sx={{ position: 'absolute', height: '100%', width: '100%', zIndex: -1 }}>
      {/* First SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={{ position: 'absolute', width: '100%', top: 0 }}>
        <path
          fill="#5E35B1"
          d="M0,160L34.3,149.3C68.6,139,137,117,206,101.3C274.3,85,343,75,411,96C480,117,549,171,617,176C685.7,181,754,139,823,144C891.4,149,960,203,1029,192C1097.1,181,1166,107,1234,117.3C1302.9,128,1371,224,1406,272L1440,320L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
        />
      </svg>
      {/* Second SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={{ position: 'absolute', width: '100%', bottom: 0 }}>
        <path
          fill="#5E35B1"
          d="M0,0L60,48C120,96,240,192,360,208C480,224,600,160,720,117.3C840,75,960,53,1080,74.7C1200,96,1320,160,1380,192L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </svg>
    </Box>
  );
};

// ==============================|| AUTH LAYOUT ||============================== //

const AuthLayout = () => (
  <>
    <BackgroundSvg />
    <Outlet />
    <Customization />
  </>
);

export default AuthLayout;
