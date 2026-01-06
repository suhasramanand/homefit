/**
 * Delete Listing Confirmation Dialog
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

const DeleteListingDialog = ({
  open,
  onClose,
  onConfirm,
  listing,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold" color="error.main">
          Confirm Deletion
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete this listing? This action cannot be undone.
        </Typography>
        {listing && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)', borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {listing.type || 'Property'} - {listing.neighborhood || 'Unknown location'}
            </Typography>
            <Typography variant="body2">
              ${typeof listing.price === 'number' ? listing.price.toLocaleString() : 'N/A'} • {listing.bedrooms || 'N/A'} Bed
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteListingDialog;

