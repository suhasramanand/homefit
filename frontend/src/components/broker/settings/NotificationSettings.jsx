/**
 * Notification Settings Component
 * Form for managing broker notification preferences
 */

import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  CircularProgress,
  Box,
  useTheme,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const NotificationSettings = ({
  notificationSettings,
  loading,
  primaryColor,
  isDarkMode,
  onChange,
  onSubmit,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        maxWidth: 600,
        mx: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Notification Preferences
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box component="form" onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onChange={onChange}
                  name="emailNotifications"
                  color="primary"
                />
              }
              label="Email Notifications"
            />
            <Typography variant="body2" color="text.secondary" ml={4}>
              Receive all notifications via email
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.newInquiryAlerts}
                  onChange={onChange}
                  name="newInquiryAlerts"
                  color="primary"
                />
              }
              label="New Inquiry Alerts"
            />
            <Typography variant="body2" color="text.secondary" ml={4}>
              Get notified when you receive new inquiries about your listings
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.marketingUpdates}
                  onChange={onChange}
                  name="marketingUpdates"
                  color="primary"
                />
              }
              label="Marketing Updates"
            />
            <Typography variant="body2" color="text.secondary" ml={4}>
              Receive marketing tips and platform updates
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.accountAlerts}
                  onChange={onChange}
                  name="accountAlerts"
                  color="primary"
                />
              }
              label="Account Alerts"
            />
            <Typography variant="body2" color="text.secondary" ml={4}>
              Important notifications about your account
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.2,
              bgcolor: primaryColor,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default NotificationSettings;

