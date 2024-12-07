import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const HomeCard = ({ onPress, imageSource, name }) => {
  const theme = useTheme();

  return (
    <Card sx={{ display: 'flex', bgcolor: theme.palette.secondary.main }} onClick={onPress}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1 0 auto' }}>
          <Typography component="div" variant="h5" color={'white'} textAlign="center">
            {name}
          </Typography>
        </CardContent>
      </Box>
      <CardMedia component="img" sx={{ width: 151 }} image={imageSource} alt={name} />
    </Card>
  );
};

export default HomeCard;
