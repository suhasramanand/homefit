/**
 * Mobile Filter Drawer Component
 */

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterComponent from '../../common/filter/FilterComponent';

const MobileFilterDrawer = ({
  open,
  onClose,
  onApplyFilters,
  initialFilters,
  onResetFilters,
  loading,
  isDarkMode,
}) => {
  const theme = useTheme();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "85%",
          maxWidth: 350,
          p: 2,
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          Filters
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <FilterComponent
        onApplyFilters={onApplyFilters}
        initialFilters={initialFilters}
        onResetFilters={onResetFilters}
        showFilterDrawer={true}
        loading={loading}
      />
    </Drawer>
  );
};

export default MobileFilterDrawer;

