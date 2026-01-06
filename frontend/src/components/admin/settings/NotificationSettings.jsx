/**
 * Admin Notification Settings Component
 */

import React from 'react';
import {
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SaveIcon from '@mui/icons-material/Save';
import SettingsCard from './SettingsCard';

const NotificationSettings = ({ notifications, loading, onChange, onSave }) => {
  return (
    <SettingsCard
      title="Notification Preferences"
      icon={<NotificationsIcon sx={{ color: 'white' }} />}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={notifications.emailNotifications}
                onChange={onChange}
                name="emailNotifications"
                color="primary"
              />
            }
            label="Email Notifications"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5, mb: 2 }}>
            Receive essential notifications via email
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={notifications.newUserAlerts}
                onChange={onChange}
                name="newUserAlerts"
                color="primary"
              />
            }
            label="New User Registrations"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5, mb: 2 }}>
            Get notified when new users register
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={notifications.brokerApprovalAlerts}
                onChange={onChange}
                name="brokerApprovalAlerts"
                color="primary"
              />
            }
            label="Broker Approval Requests"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5, mb: 2 }}>
            Alerts for new broker approval requests
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={notifications.systemUpdates}
                onChange={onChange}
                name="systemUpdates"
                color="primary"
              />
            }
            label="System Updates"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5, mb: 2 }}>
            Notifications about system maintenance and updates
          </Typography>
        </Grid>
        
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onSave}
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Preferences'}
          </Button>
        </Grid>
      </Grid>
    </SettingsCard>
  );
};

export default NotificationSettings;

