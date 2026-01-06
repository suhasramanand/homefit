/**
 * Profile Image Upload Component
 * Handles profile image display and upload
 */

import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ProfileImageUpload = ({
  previewImage,
  fullName,
  email,
  onImageChange,
  isDarkMode,
}) => {
  const theme = useTheme();

  return (
    <Card 
      elevation={1}
      sx={{
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
        <Avatar
          src={previewImage}
          alt={fullName}
          sx={{ 
            width: 120, 
            height: 120, 
            mb: 2,
            bgcolor: theme.palette.primary.main
          }}
        >
          {!previewImage && fullName ? fullName.charAt(0).toUpperCase() : <PersonIcon fontSize="large" />}
        </Avatar>
        
        <Typography variant="h6" gutterBottom textAlign="center">
          {fullName || 'Your Name'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
          {email || 'broker@example.com'}
        </Typography>
        
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2 }}
        >
          Change Photo
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={onImageChange}
          />
        </Button>
        
        <Typography variant="caption" color="text.secondary" textAlign="center">
          Recommended: Square image, at least 300x300 pixels
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProfileImageUpload;

