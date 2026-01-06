/**
 * Reusable Settings Card Component
 */

import React from 'react';
import { Card, CardContent, Box, Typography, useTheme } from '@mui/material';

const SettingsCard = ({ title, icon, children }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        mb: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

export default SettingsCard;

