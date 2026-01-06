/**
 * Admin Profile Settings Component
 */

import React from 'react';
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import SettingsCard from './SettingsCard';

const ProfileSettings = ({ profile, loading, onChange, onSave }) => {
  return (
    <SettingsCard
      title="Profile Information"
      icon={<PersonIcon sx={{ color: 'white' }} />}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={profile.fullName}
            onChange={onChange}
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={profile.email}
            disabled
            variant="outlined"
            margin="normal"
            helperText="Email cannot be changed"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Bio"
            name="bio"
            value={profile.bio}
            onChange={onChange}
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            helperText="A brief description about yourself"
          />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onSave}
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Profile'}
          </Button>
        </Grid>
      </Grid>
    </SettingsCard>
  );
};

export default ProfileSettings;

