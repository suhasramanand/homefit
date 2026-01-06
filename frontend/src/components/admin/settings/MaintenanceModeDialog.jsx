/**
 * Maintenance Mode Confirmation Dialog
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  TextField,
} from '@mui/material';

const MaintenanceModeDialog = ({
  open,
  onClose,
  onConfirm,
  maintenanceMessage,
  maintenanceTime,
  onChange,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle id="confirm-dialog-title">
        <Typography variant="h6" color="error.main" fontWeight="bold">
          Enable Maintenance Mode?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This will make the site inaccessible to all non-admin users!
        </Alert>
        <Typography variant="body1">
          Enabling maintenance mode will log out all current users and display a maintenance message.
          Only administrators will be able to access the site until maintenance mode is disabled.
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Maintenance Message"
            name="maintenanceMessage"
            value={maintenanceMessage}
            onChange={onChange}
            variant="outlined"
            margin="normal"
            multiline
            rows={2}
            placeholder="We are currently performing scheduled maintenance. Please check back soon."
          />
          
          <TextField
            fullWidth
            label="Estimated Completion Time"
            name="maintenanceTime"
            value={maintenanceTime}
            onChange={onChange}
            variant="outlined"
            margin="normal"
            placeholder="April 14, 2025 at 3:00 PM EST"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Enable Maintenance Mode
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaintenanceModeDialog;

