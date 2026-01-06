/**
 * Delete Listing Dialog Component
 * Confirmation dialog for deleting a listing
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
} from '@mui/material';

const DeleteListingDialog = ({
  open,
  onClose,
  onConfirm,
  isDarkMode,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          width: "100%",
          maxWidth: 360,
          backgroundColor: theme.palette.background.paper,
          border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
        },
      }}
    >
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to delete this listing? This action cannot be
          undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: isDarkMode
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(0, 0, 0, 0.2)",
            color: "text.secondary",
            "&:hover": {
              borderColor: isDarkMode
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(0, 0, 0, 0.3)",
              backgroundColor: "transparent",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disableElevation
          sx={{
            backgroundColor: theme.palette.error.main,
            "&:hover": {
              backgroundColor: theme.palette.error.dark,
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteListingDialog;

