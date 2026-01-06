/**
 * Profile Settings Component
 * Combines profile image upload and profile form
 */

import React from 'react';
import { Grid } from '@mui/material';
import ProfileImageUpload from './ProfileImageUpload';
import ProfileForm from './ProfileForm';

const ProfileSettings = ({
  profileData,
  previewImage,
  errors,
  loading,
  primaryColor,
  isDarkMode,
  userEmail,
  onImageChange,
  onProfileChange,
  onProfileSubmit,
}) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <ProfileImageUpload
          previewImage={previewImage}
          fullName={profileData.fullName}
          email={userEmail}
          onImageChange={onImageChange}
          isDarkMode={isDarkMode}
        />
      </Grid>
      
      <Grid item xs={12} md={8}>
        <ProfileForm
          profileData={profileData}
          errors={errors}
          loading={loading}
          primaryColor={primaryColor}
          isDarkMode={isDarkMode}
          userEmail={userEmail}
          onChange={onProfileChange}
          onSubmit={onProfileSubmit}
        />
      </Grid>
    </Grid>
  );
};

export default ProfileSettings;

