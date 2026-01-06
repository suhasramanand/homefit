/**
 * Admin Settings Page
 * Main component that aggregates all settings sub-components
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  Tabs,
  Tab,
  Alert,
  Snackbar,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';

// Import sub-components
import TabPanel from '../../components/admin/settings/TabPanel';
import ProfileSettings from '../../components/admin/settings/ProfileSettings';
import SecuritySettings from '../../components/admin/settings/SecuritySettings';
import NotificationSettings from '../../components/admin/settings/NotificationSettings';
import SystemSettings from '../../components/admin/settings/SystemSettings';
import MaintenanceModeDialog from '../../components/admin/settings/MaintenanceModeDialog';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [confirmDialog, setConfirmDialog] = useState(false);
  
  // Form states
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    bio: '',
  });
  
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newUserAlerts: true,
    brokerApprovalAlerts: true,
    systemUpdates: false,
  });
  
  const [systemSettings, setSystemSettings] = useState({
    autoApproveListings: false,
    darkModeDefault: false,
    maintenanceMode: false,
    maintenanceMessage: '',
    maintenanceTime: '',
    defaultCurrency: 'USD',
    defaultLanguage: 'en',
  });
  
  const [maintenanceStatus, setMaintenanceStatus] = useState({
    isActive: false,
    message: '',
    estimatedTime: '',
    lastUpdated: null
  });
  
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const isDarkMode = theme.palette.mode === 'dark';
  const primaryColor = theme.palette.primary.main;

  // Fetch maintenance status
  const fetchMaintenanceStatus = async () => {
    try {
      const response = await axios.get(`/api/system/maintenance-status?t=${new Date().getTime()}`, {
        withCredentials: true,
      });
      
      setMaintenanceStatus({
        isActive: response.data.isInMaintenanceMode || false,
        message: response.data.message || '',
        estimatedTime: response.data.estimatedTime || '',
        lastUpdated: response.data.lastUpdated || new Date()
      });
      
      setSystemSettings(prev => ({
        ...prev,
        maintenanceMode: response.data.isInMaintenanceMode || false,
        maintenanceMessage: response.data.message || '',
        maintenanceTime: response.data.estimatedTime || ''
      }));
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch maintenance status:', error);
      showSnackbarMessage('Failed to check system status', 'error');
      return null;
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user || user.type !== 'admin') {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Fetch user profile
        const userRes = await axios.get('/api/user/profile', {
          withCredentials: true,
        });
        
        if (userRes.data) {
          setProfile({
            fullName: userRes.data.fullName || '',
            email: userRes.data.email || '',
            bio: userRes.data.bio || '',
          });
        }
        
        // Try to fetch notification settings
        try {
          const notificationsRes = await axios.get('/api/user/notification-settings', {
            withCredentials: true,
          });
          
          if (notificationsRes.data?.notificationSettings) {
            setNotifications({
              ...notifications,
              ...notificationsRes.data.notificationSettings,
            });
          }
        } catch (err) {
          console.log('Notification settings API not available:', err);
        }
        
        // Fetch maintenance mode status
        await fetchMaintenanceStatus();
        
        // Set system settings
        setSystemSettings(prev => ({
          ...prev,
          darkModeDefault: isDarkMode,
        }));
        
      } catch (error) {
        console.error('Error fetching settings:', error);
        showSnackbarMessage('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, isDarkMode]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const showSnackbarMessage = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity({
      ...security,
      [name]: value,
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications({
      ...notifications,
      [name]: checked,
    });
  };

  const handleSystemSettingChange = (e) => {
    const { name, value, checked } = e.target;
    setSystemSettings({
      ...systemSettings,
      [name]: e.target.type === 'checkbox' ? checked : value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      await axios.put('/api/user/edit', {
        fullName: profile.fullName,
        bio: profile.bio,
      }, {
        withCredentials: true,
      });
      
      showSnackbarMessage('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbarMessage('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (security.newPassword !== security.confirmPassword) {
      showSnackbarMessage('New passwords do not match', 'error');
      return;
    }
    
    if (security.newPassword.length < 8) {
      showSnackbarMessage('Password must be at least 8 characters', 'error');
      return;
    }
    
    try {
      setLoading(true);
      
      await axios.put('/api/user/change-password', {
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
      }, {
        withCredentials: true,
      });
      
      setSecurity({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      showSnackbarMessage('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      showSnackbarMessage('Failed to update password. Check your current password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      
      await axios.put('/api/user/notification-settings', notifications, {
        withCredentials: true,
      });
      
      showSnackbarMessage('Notification settings updated successfully');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      showSnackbarMessage('Failed to update notification settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSystemSettings = async () => {
    // For safety, show confirmation dialog before enabling maintenance mode
    if (systemSettings.maintenanceMode) {
      setConfirmDialog(true);
      return;
    }
    
    saveSystemSettings();
  };
  
  const saveSystemSettings = async () => {
    try {
      setLoading(true);
      setConfirmDialog(false);
      
      // Update maintenance mode
      const maintenanceChanged = 
        systemSettings.maintenanceMode !== maintenanceStatus.isActive ||
        systemSettings.maintenanceMessage !== maintenanceStatus.message ||
        systemSettings.maintenanceTime !== maintenanceStatus.estimatedTime;
      
      if (maintenanceChanged) {
        const response = await axios.post('/api/admin/set-maintenance-mode', {
          enabled: systemSettings.maintenanceMode,
          message: systemSettings.maintenanceMessage || 'We are currently performing scheduled maintenance. Please check back soon.',
          estimatedTime: systemSettings.maintenanceTime || ''
        }, {
          withCredentials: true
        });
        
        if (response.data) {
          setMaintenanceStatus({
            isActive: response.data.isInMaintenanceMode,
            message: response.data.message,
            estimatedTime: response.data.estimatedTime,
            lastUpdated: new Date()
          });
        }
      }
      
      showSnackbarMessage('System settings updated successfully');
    } catch (error) {
      console.error('Error updating system settings:', error);
      showSnackbarMessage('Failed to update system settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = (field) => {
    if (field === 'current') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else if (field === 'confirm') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  if (loading && !profile.email) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: primaryColor }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      <Typography variant="h4" component="h1" fontWeight="bold" mb={4} color="text.primary">
        Settings
      </Typography>

      {/* Tabs for different settings categories */}
      <Card
        elevation={2}
        sx={{
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: primaryColor,
              },
              '& .MuiTab-root': {
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: primaryColor,
                },
              },
              borderBottom: '1px solid',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
            }}
          >
            <Tab 
              label="Profile" 
              icon={<PersonIcon />} 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab 
              label="Security" 
              icon={<LockIcon />} 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab 
              label="Notifications" 
              icon={<NotificationsIcon />} 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab 
              label="System" 
              icon={<SettingsIcon />} 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
          </Tabs>
        </CardContent>
      </Card>

      {/* Profile Tab */}
      <TabPanel value={tabValue} index={0}>
        <ProfileSettings
          profile={profile}
          loading={loading}
          onChange={handleProfileChange}
          onSave={handleSaveProfile}
        />
      </TabPanel>

      {/* Security Tab */}
      <TabPanel value={tabValue} index={1}>
        <SecuritySettings
          security={security}
          loading={loading}
          showCurrentPassword={showCurrentPassword}
          showNewPassword={showNewPassword}
          showConfirmPassword={showConfirmPassword}
          onChange={handleSecurityChange}
          onSave={handleSavePassword}
          onTogglePasswordVisibility={handleTogglePasswordVisibility}
        />
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={tabValue} index={2}>
        <NotificationSettings
          notifications={notifications}
          loading={loading}
          onChange={handleNotificationChange}
          onSave={handleSaveNotifications}
        />
      </TabPanel>

      {/* System Tab */}
      <TabPanel value={tabValue} index={3}>
        <SystemSettings
          systemSettings={systemSettings}
          maintenanceStatus={maintenanceStatus}
          loading={loading}
          onChange={handleSystemSettingChange}
          onSave={handleSaveSystemSettings}
          onFetchMaintenanceStatus={fetchMaintenanceStatus}
        />
      </TabPanel>

      {/* Confirm Dialog for Maintenance Mode */}
      <MaintenanceModeDialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        onConfirm={saveSystemSettings}
        maintenanceMessage={systemSettings.maintenanceMessage}
        maintenanceTime={systemSettings.maintenanceTime}
        onChange={handleSystemSettingChange}
      />
    </Box>
  );
};

export default AdminSettings;
