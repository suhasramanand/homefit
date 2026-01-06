/**
 * Empty State Component
 * Displays when broker has no listings
 */

import React from 'react';
import {
  Card,
  Typography,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

const EmptyState = ({ primaryColor, isDarkMode }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={2}
      sx={{
        p: 4,
        borderRadius: 2,
        textAlign: "center",
        backgroundColor: theme.palette.background.paper,
        border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
      }}
    >
      <Typography variant="h6" mb={2} color="text.primary">
        You don't have any listings yet
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Start by adding your first property listing
      </Typography>
      <Button
        component={Link}
        to="/broker/add-listing"
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          borderRadius: 2,
          px: 3,
          py: 1.2,
          bgcolor: primaryColor,
          "&:hover": {
            bgcolor: theme.palette.primary.dark,
          },
        }}
      >
        Add New Listing
      </Button>
    </Card>
  );
};

export default EmptyState;

