import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const HomeCard = ({ onPress, imageSource, name }) => {
  const theme = useTheme();

  return (
    <Card
      style={{
        backgroundColor: theme.palette.primary,
        cursor: 'pointer',
        minHeight: 240
      }}
      onClick={onPress}
      elevation={2}
    >
      <CardMedia
        component="img"
        image={imageSource}
        alt={name}
        style={{
          backgroundColor: theme.palette.primary,
          objectFit: 'cover'
        }}
      />
      <CardContent
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px'
        }}
      >
        <Typography
          variant="body2"
          style={{
            fontWeight: 700,
            textAlign: 'center',
            color: theme.palette.text.secondary
          }}
        >
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default HomeCard;
