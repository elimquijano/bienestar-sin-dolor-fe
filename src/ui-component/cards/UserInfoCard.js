import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActions } from '@mui/material';

export default function UserInfoCard({ title, subtitle, content, buttons, imagepath }) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        backgroundColor: theme.palette.background.default,
        borderRadius: 2
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        <CardMedia
          component="img"
          alt={title}
          image={imagepath || ''}
          sx={{
            width: 50,
            height: 50,
            borderRadius: 2
          }}
        />
        <Box sx={{ marginLeft: 1 }}>
          <Typography variant="h5">{title || ''}</Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle || ''}
          </Typography>
        </Box>
      </CardContent>
      <CardContent sx={{ paddingY: 0 }}>{content || null}</CardContent>
      <CardActions>{buttons || null}</CardActions>
    </Card>
  );
}
