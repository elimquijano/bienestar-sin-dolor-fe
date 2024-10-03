import { ArrowBack } from '@mui/icons-material';
import { AppBar, Avatar, Box, ButtonBase, Toolbar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router';

const IconBar = ({ icon, onClick, isDark }) => {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          }
        }}
      >
        <ButtonBase>
          <Avatar
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: isDark ? theme.palette.secondary.main : theme.palette.background.default,
              color: isDark ? theme.palette.background.default : theme.palette.secondary.main
            }}
            onClick={onClick}
            color="inherit"
          >
            {icon}
          </Avatar>
        </ButtonBase>
      </Box>
    </>
  );
};

const AppContentHeader = ({ avatarImage = null, title = null, isDark = true }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <AppBar
      enableColorOnDark
      color="inherit"
      position="relative"
      elevation={0}
      sx={{
        bgcolor: isDark ? theme.palette.secondary.main : theme.palette.background.default
      }}
    >
      <Toolbar>
        <IconBar icon={<ArrowBack stroke={1.5} size="1.3rem" />} onClick={handleBackClick} isDark={isDark} />
        {avatarImage && <Avatar alt="" src={avatarImage} />}
        {title && (
          <Typography variant="h4" sx={{ marginLeft: 2, color: isDark ? theme.palette.background.default : theme.palette.text.primary }}>
            {title}
          </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
};

export default AppContentHeader;
