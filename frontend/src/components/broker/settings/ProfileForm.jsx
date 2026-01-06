/**
 * Profile Form Component
 * Form for editing broker profile information
 */

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  InputAdornment,
  CircularProgress,
  useTheme,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';

const ProfileForm = ({
  profileData,
  errors,
  loading,
  primaryColor,
  isDarkMode,
  userEmail,
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
      }}
    >
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box component="form" onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              name="fullName"
              value={profileData.fullName}
              onChange={onChange}
              fullWidth
              required
              error={!!errors.fullName}
              helperText={errors.fullName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              name="phone"
              value={profileData.phone}
              onChange={onChange}
              fullWidth
              required
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Company Name"
              name="companyName"
              value={profileData.companyName}
              onChange={onChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Bio"
              name="bio"
              value={profileData.bio}
              onChange={onChange}
              fullWidth
              multiline
              rows={4}
              placeholder="Tell clients a bit about yourself and your expertise..."
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Your email address is used for login and cannot be changed.
            </Typography>
            <TextField
              label="Email Address"
              value={userEmail || ''}
              fullWidth
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
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
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileForm;

