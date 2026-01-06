/**
 * Reusable Stat Card Component
 */

import React from 'react';
import { Card, Box, Typography, useTheme } from '@mui/material';

const StatCard = ({ icon, count, label, backgroundColor }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: isDarkMode 
            ? '0 8px 24px rgba(0, 0, 0, 0.3)'
            : '0 8px 24px rgba(35, 206, 163, 0.15)',
        },
      }}
    >
      <Box
        sx={{
          backgroundColor,
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" fontWeight="bold" mb={0.5}>
        {count}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Card>
  );
};

export default StatCard;

