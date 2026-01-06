/**
 * Admin Security Settings Component
 */

import React from 'react';
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Switch,
  Divider,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Save';
import SettingsCard from './SettingsCard';

const SecuritySettings = ({
  security,
  loading,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  onChange,
  onSave,
  onTogglePasswordVisibility,
}) => {
  return (
    <>
      <SettingsCard
        title="Change Password"
        icon={<LockIcon sx={{ color: 'white' }} />}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={security.currentPassword}
              onChange={onChange}
              variant="outlined"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => onTogglePasswordVisibility('current')}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={security.newPassword}
              onChange={onChange}
              variant="outlined"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => onTogglePasswordVisibility('new')}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={security.confirmPassword}
              onChange={onChange}
              variant="outlined"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => onTogglePasswordVisibility('confirm')}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={security.newPassword !== security.confirmPassword && security.confirmPassword !== ''}
              helperText={
                security.newPassword !== security.confirmPassword && security.confirmPassword !== ''
                  ? 'Passwords do not match'
                  : ''
              }
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onSave}
              startIcon={<SaveIcon />}
              disabled={loading || security.currentPassword === '' || security.newPassword === '' || security.confirmPassword === ''}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Password'}
            </Button>
          </Grid>
        </Grid>
      </SettingsCard>

      <SettingsCard
        title="Security Settings"
        icon={<SecurityIcon sx={{ color: 'white' }} />}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={true}
                  disabled
                  color="primary"
                />
              }
              label="Two-Factor Authentication"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
              Enhanced security is required for admin accounts
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Last login: {new Date().toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </SettingsCard>
    </>
  );
};

export default SecuritySettings;

