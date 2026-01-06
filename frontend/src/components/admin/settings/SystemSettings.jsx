/**
 * Admin System Settings Component
 */

import React from 'react';
import {
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import SettingsCard from './SettingsCard';
import StorageIcon from './StorageIcon';

const SystemSettings = ({
  systemSettings,
  maintenanceStatus,
  loading,
  onChange,
  onSave,
  onFetchMaintenanceStatus,
}) => {
  return (
    <>
      <SettingsCard
        title="System Settings"
        icon={<SettingsIcon sx={{ color: 'white' }} />}
      >
        <Alert severity="info" sx={{ mb: 3 }}>
          These settings affect the entire application. Please use caution when making changes.
        </Alert>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={systemSettings.autoApproveListings}
                  onChange={onChange}
                  name="autoApproveListings"
                  color="primary"
                />
              }
              label="Auto-Approve New Listings"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5, mb: 2 }}>
              Automatically approve all new property listings
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={systemSettings.darkModeDefault}
                  onChange={onChange}
                  name="darkModeDefault"
                  color="primary"
                />
              }
              label="Default to Dark Mode"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5, mb: 2 }}>
              Set dark mode as the default theme for all users
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={systemSettings.maintenanceMode}
                  onChange={onChange}
                  name="maintenanceMode"
                  color="error"
                />
              }
              label="Maintenance Mode"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5, mb: 2 }}>
              Put the site in maintenance mode (only admins can access)
            </Typography>
          </Grid>
          
          {/* Only show these fields if maintenance mode is being enabled */}
          {systemSettings.maintenanceMode && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Maintenance Message"
                  name="maintenanceMessage"
                  value={systemSettings.maintenanceMessage}
                  onChange={onChange}
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={2}
                  placeholder="We are currently performing scheduled maintenance. Please check back soon."
                  helperText="Message to display to users during maintenance"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Estimated Completion Time"
                  name="maintenanceTime"
                  value={systemSettings.maintenanceTime}
                  onChange={onChange}
                  variant="outlined"
                  margin="normal"
                  placeholder="April 14, 2025 at 3:00 PM EST"
                  helperText="When maintenance is expected to be completed (optional)"
                />
              </Grid>
            </>
          )}
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Default Currency</Typography>
              <Select
                value={systemSettings.defaultCurrency}
                onChange={onChange}
                name="defaultCurrency"
              >
                <MenuItem value="USD">US Dollar (USD)</MenuItem>
                <MenuItem value="EUR">Euro (EUR)</MenuItem>
                <MenuItem value="GBP">British Pound (GBP)</MenuItem>
                <MenuItem value="CAD">Canadian Dollar (CAD)</MenuItem>
                <MenuItem value="AUD">Australian Dollar (AUD)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Default Language</Typography>
              <Select
                value={systemSettings.defaultLanguage}
                onChange={onChange}
                name="defaultLanguage"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="zh">Chinese</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {maintenanceStatus.isActive && (
            <Grid item xs={12}>
              <Alert 
                severity="warning" 
                sx={{ my: 2 }}
                action={
                  <Button 
                    color="inherit" 
                    size="small"
                    onClick={onFetchMaintenanceStatus}
                  >
                    Refresh
                  </Button>
                }
              >
                <Typography variant="subtitle2">
                  Maintenance mode is currently active
                </Typography>
                <Typography variant="body2">
                  Only administrators can access the site.
                  {maintenanceStatus.lastUpdated && (
                    ` Last updated: ${new Date(maintenanceStatus.lastUpdated).toLocaleString()}`
                  )}
                </Typography>
              </Alert>
            </Grid>
          )}
          
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onSave}
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save System Settings'}
            </Button>
          </Grid>
        </Grid>
      </SettingsCard>

      <SettingsCard
        title="Database Management"
        icon={<StorageIcon sx={{ color: 'white' }} />}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ py: 1.5 }}
            >
              Backup Database
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="warning"
              fullWidth
              sx={{ py: 1.5 }}
            >
              Run Database Maintenance
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              sx={{ py: 1.5 }}
            >
              Clear Cached Data
            </Button>
          </Grid>
        </Grid>
      </SettingsCard>
    </>
  );
};

export default SystemSettings;

