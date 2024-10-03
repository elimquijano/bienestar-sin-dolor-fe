import { AppBar, Box, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LogoSection from 'layout/MainLayout/LogoSection';
import NotificationSection from './NotificationSection';
import ProfileSection from './ProfileSection';
import SearchSection from './SearchSection';

const AppHeader = () => {
  const theme = useTheme();
  return (
    <AppBar
      enableColorOnDark
      color="inherit"
      position="relative"
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.default,
        paddingBottom: 1
      }}
    >
      <Toolbar>
        {/* logo */}
        <LogoSection />

        {/* header search */}
        <SearchSection />
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ flexGrow: 1 }} />

        {/* notification & profile */}
        <NotificationSection />
        <ProfileSection />
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
