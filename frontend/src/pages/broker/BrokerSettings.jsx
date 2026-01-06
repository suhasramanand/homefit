/**
 * Broker Settings Page
 * Main component that aggregates all broker settings sub-components
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import { useSelector } from 'react-redux';

// Import sub-components
import TabPanel from '../../components/broker/settings/TabPanel';
import ProfileSettings from '../../components/broker/settings/ProfileSettings';
import PasswordSettings from '../../components/broker/settings/PasswordSettings';
import NotificationSettings from '../../components/broker/settings/NotificationSettings';

const BrokerSettings = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const primaryColor = theme.palette.primary.main;
  const user = useSelector((state) => state.user.user);
  
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // Profile settings state
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    companyName: '',
    bio: '',
    profileImage: null,
  });
  
  // Password settings state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newInquiryAlerts: true,
    marketingUpdates: false,
    accountAlerts: true,
  });
  
  // Error handling
  const [errors, setErrors] = useState({});
  
  // Preview image state
  const [previewImage, setPreviewImage] = useState(null);
  
  useEffect(() => {
    const fetchBrokerData = async () => {
      try {
        const response = await axios.get('/api/broker/me', { withCredentials: true });
        const brokerData = response.data;
        
        setProfileData({
          fullName: brokerData.fullName || '',
          phone: brokerData.phone || '',
          companyName: brokerData.companyName || '',
          bio: brokerData.bio || '',
        });
        
        if (brokerData.imagePath) {
          setPreviewImage(brokerData.imagePath);
        }
      } catch (error) {
        console.error('Error fetching broker data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load profile data',
          severity: 'error',
        });
      }
    };
    
    fetchBrokerData();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileData((prev) => ({ ...prev, profileImage: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profileData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!profileData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('fullName', profileData.fullName);
      formData.append('phone', profileData.phone);
      formData.append('companyName', profileData.companyName || '');
      formData.append('bio', profileData.bio || '');
      
      if (profileData.profileImage) {
        formData.append('profileImage', profileData.profileImage);
      }
      
      await axios.put('/api/broker/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.put('/api/broker/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, { withCredentials: true });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setSnackbar({
        open: true,
        message: 'Password updated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      
      if (error.response && error.response.status === 401) {
        setErrors({ currentPassword: 'Current password is incorrect' });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to update password',
          severity: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      await axios.put('/api/broker/notification-settings', notificationSettings, { 
        withCredentials: true 
      });
      
      setSnackbar({
        open: true,
        message: 'Notification settings updated',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update notification settings',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  
  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={4} color="text.primary">
        Settings
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="settings tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab 
            icon={<AccountCircleIcon />} 
            iconPosition="start" 
            label="Profile" 
            id="settings-tab-0"
            aria-controls="settings-tabpanel-0"
          />
          <Tab 
            icon={<SecurityIcon />} 
            iconPosition="start" 
            label="Password" 
            id="settings-tab-1"
            aria-controls="settings-tabpanel-1"
          />
          <Tab 
            icon={<NotificationsIcon />} 
            iconPosition="start" 
            label="Notifications" 
            id="settings-tab-2"
            aria-controls="settings-tabpanel-2"
          />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <ProfileSettings
          profileData={profileData}
          previewImage={previewImage}
          errors={errors}
          loading={loading}
          primaryColor={primaryColor}
          isDarkMode={isDarkMode}
          userEmail={user?.email}
          onImageChange={handleImageChange}
          onProfileChange={handleProfileChange}
          onProfileSubmit={handleProfileSubmit}
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <PasswordSettings
          passwordData={passwordData}
          errors={errors}
          loading={loading}
          primaryColor={primaryColor}
          isDarkMode={isDarkMode}
          showCurrentPassword={showCurrentPassword}
          showNewPassword={showNewPassword}
          showConfirmPassword={showConfirmPassword}
          onPasswordChange={handlePasswordChange}
          onToggleCurrentPassword={() => setShowCurrentPassword(!showCurrentPassword)}
          onToggleNewPassword={() => setShowNewPassword(!showNewPassword)}
          onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          onSubmit={handlePasswordSubmit}
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <NotificationSettings
          notificationSettings={notificationSettings}
          loading={loading}
          primaryColor={primaryColor}
          isDarkMode={isDarkMode}
          onChange={handleNotificationChange}
          onSubmit={handleNotificationSubmit}
        />
      </TabPanel>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BrokerSettings;
