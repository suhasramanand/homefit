/**
 * Broker Details Dialog Component
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';

const BrokerDetailsDialog = ({
  open,
  onClose,
  broker,
  onApprove,
  onRevoke,
  primaryColor,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  if (!broker) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
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
        Broker Details
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
            <Typography variant="body1" gutterBottom>{broker.fullName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Email</Typography>
            <Typography variant="body1" gutterBottom>{broker.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
            <Typography variant="body1" gutterBottom>{broker.phone || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">License Number</Typography>
            <Typography variant="body1" gutterBottom>{broker.licenseNumber || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Company</Typography>
            <Typography variant="body1" gutterBottom>{broker.companyName || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
            <Typography variant="body1" gutterBottom>
              <Chip
                label={broker.isApproved ? "Approved" : "Pending"}
                size="small"
                sx={{
                  backgroundColor: broker.isApproved
                    ? (isDarkMode ? 'rgba(46, 204, 113, 0.2)' : 'rgba(46, 204, 113, 0.1)')
                    : (isDarkMode ? 'rgba(249, 199, 79, 0.2)' : 'rgba(249, 199, 79, 0.1)'),
                  color: broker.isApproved
                    ? theme.palette.success.main
                    : theme.palette.warning.main,
                  fontWeight: 600,
                }}
              />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Registration Date</Typography>
            <Typography variant="body1" gutterBottom>
              {broker.createdAt ? dayjs(broker.createdAt).format('MMMM D, YYYY') : 'Unknown'}
            </Typography>
          </Grid>
          {broker.bio && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">Bio</Typography>
              <Typography variant="body1" gutterBottom>{broker.bio}</Typography>
            </Grid>
          )}
          {broker.licenseDocumentUrl && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>License Document</Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<VisibilityIcon />}
                href={broker.licenseDocumentUrl}
                target="_blank"
                sx={{ mt: 1 }}
              >
                View Document
              </Button>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            color: 'text.secondary',
          }}
        >
          Close
        </Button>
        {!broker.isApproved && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => onApprove(broker._id)}
          >
            Approve Broker
          </Button>
        )}
        {broker.isApproved && (
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onRevoke(broker._id);
              onClose();
            }}
          >
            Revoke Approval
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BrokerDetailsDialog;

