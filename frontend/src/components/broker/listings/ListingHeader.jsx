/**
 * Listing Header Component
 * Header with title and "Add New Listing" button
 */

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

const ListingHeader = ({ primaryColor }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        fontWeight="bold"
        color="text.primary"
      >
        My Listings
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
    </Box>
  );
};

export default ListingHeader;

