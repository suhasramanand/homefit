/**
 * Admin Dashboard Page
 * Main component that aggregates all dashboard sub-components
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
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
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';

// Import sub-components
import StatCard from '../../components/admin/common/StatCard';
import PendingBrokersTab from '../../components/admin/dashboard/PendingBrokersTab';
import AllBrokersTab from '../../components/admin/dashboard/AllBrokersTab';
import UsersTab from '../../components/admin/dashboard/UsersTab';
import ListingsTab from '../../components/admin/dashboard/ListingsTab';
import BrokerDetailsDialog from '../../components/admin/dashboard/BrokerDetailsDialog';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBrokers: 0,
    pendingBrokers: 0,
    totalListings: 0,
  });
  const [pendingBrokers, setPendingBrokers] = useState([]);
  const [allBrokers, setAllBrokers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchText, setSearchText] = useState('');
  
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const isDarkMode = theme.palette.mode === 'dark';
  const primaryColor = theme.palette.primary.main;

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user || user.type !== 'admin') {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Get pending broker requests
        const pendingBrokersRes = await axios.get('/api/admin/pending-brokers', {
          withCredentials: true,
        });
        setPendingBrokers(pendingBrokersRes.data || []);
        
        // Get all brokers
        const allBrokersRes = await axios.get('/api/admin/brokers', {
          withCredentials: true,
        });
        setAllBrokers(allBrokersRes.data || []);
        
        // Get all users
        const allUsersRes = await axios.get('/api/admin/users', {
          withCredentials: true,
        });
        setAllUsers(allUsersRes.data || []);
        
        // Get all listings
        const listingsRes = await axios.get('/api/apartments', {
          withCredentials: true,
        });
        setListings(listingsRes.data || []);
        
        // Update stats with real data
        setStats({
          totalUsers: allUsersRes.data.length,
          totalBrokers: allBrokersRes.data.filter(broker => broker.isApproved).length,
          pendingBrokers: pendingBrokersRes.data.length,
          totalListings: listingsRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        // Use empty data on error
        setPendingBrokers([]);
        setAllBrokers([]);
        setAllUsers([]);
        setListings([]);
        setStats({
          totalUsers: 0,
          totalBrokers: 0,
          pendingBrokers: 0,
          totalListings: 0,
        });
        
        showSnackbar('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, navigate]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewDetails = (broker) => {
    setSelectedBroker(broker);
    setDetailsOpen(true);
  };

  const handleApproveBroker = async (brokerId) => {
    try {
      await axios.post(`/api/admin/approve-broker/${brokerId}`, {}, {
        withCredentials: true,
      });
      
      // Update UI to show broker as approved
      setPendingBrokers(pendingBrokers.filter(broker => broker._id !== brokerId));
      
      // Update all brokers list
      setAllBrokers(prevBrokers => 
        prevBrokers.map(broker => 
          broker._id === brokerId 
            ? { ...broker, isApproved: true } 
            : broker
        )
      );
      
      setStats(prev => ({
        ...prev,
        pendingBrokers: prev.pendingBrokers - 1,
        totalBrokers: prev.totalBrokers + 1,
      }));
      
      showSnackbar('Broker approved successfully');
      
      // Close details dialog if open
      if (detailsOpen && selectedBroker?._id === brokerId) {
        setDetailsOpen(false);
      }
    } catch (error) {
      console.error('Error approving broker:', error);
      showSnackbar('Failed to approve broker', 'error');
    }
  };

  const handleRevokeBroker = async (brokerId) => {
    try {
      await axios.post(`/api/admin/revoke-broker/${brokerId}`, {}, {
        withCredentials: true,
      });
      
      // Update the brokers list to reflect the revocation
      setAllBrokers(prevBrokers => 
        prevBrokers.map(broker => 
          broker._id === brokerId 
            ? { ...broker, isApproved: false } 
            : broker
        )
      );
      
      setStats(prev => ({
        ...prev,
        totalBrokers: prev.totalBrokers - 1,
        pendingBrokers: prev.pendingBrokers + 1,
      }));
      
      // If we're in the pending brokers tab, refresh that list
      if (tabValue === 0) {
        const pendingBrokersRes = await axios.get('/api/admin/pending-brokers', {
          withCredentials: true,
        });
        setPendingBrokers(pendingBrokersRes.data || []);
      }
      
      showSnackbar('Broker approval revoked successfully');
    } catch (error) {
      console.error('Error revoking broker approval:', error);
      showSnackbar('Failed to revoke broker approval', 'error');
    }
  };

  if (loading) {
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
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PersonIcon sx={{ color: 'white', fontSize: 28 }} />}
            count={stats.totalUsers}
            label="Total Users"
            backgroundColor={primaryColor}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<SupervisorAccountIcon sx={{ color: 'white', fontSize: 28 }} />}
            count={stats.totalBrokers}
            label="Active Brokers"
            backgroundColor="#2ecc71"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PersonIcon sx={{ color: 'white', fontSize: 28 }} />}
            count={stats.pendingBrokers}
            label="Pending Approvals"
            backgroundColor="#f9c74f"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<HomeIcon sx={{ color: 'white', fontSize: 28 }} />}
            count={stats.totalListings}
            label="Total Listings"
            backgroundColor="#3498db"
          />
        </Grid>
      </Grid>

      {/* Tabs for different admin sections */}
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
            <Tab label="Pending Broker Approvals" />
            <Tab label="All Brokers" />
            <Tab label="Users" />
            <Tab label="Listings" />
          </Tabs>
        </CardContent>
      </Card>

      {/* Pending Broker Approvals Tab */}
      {tabValue === 0 && (
        <PendingBrokersTab
          brokers={pendingBrokers}
          searchText={searchText}
          onSearchChange={(value) => setSearchText(value)}
          onViewDetails={handleViewDetails}
          onApprove={handleApproveBroker}
          primaryColor={primaryColor}
        />
      )}

      {/* All Brokers Tab */}
      {tabValue === 1 && (
        <AllBrokersTab
          brokers={allBrokers}
          searchText={searchText}
          onSearchChange={(value) => setSearchText(value)}
          onViewDetails={handleViewDetails}
          onApprove={handleApproveBroker}
          onRevoke={handleRevokeBroker}
          primaryColor={primaryColor}
        />
      )}

      {/* Users Tab */}
      {tabValue === 2 && (
        <UsersTab
          users={allUsers}
          searchText={searchText}
          onSearchChange={(value) => setSearchText(value)}
          primaryColor={primaryColor}
        />
      )}

      {/* Listings Tab */}
      {tabValue === 3 && (
        <ListingsTab
          listings={listings}
          searchText={searchText}
          onSearchChange={(value) => setSearchText(value)}
          primaryColor={primaryColor}
        />
      )}

      {/* Broker Details Dialog */}
      <BrokerDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        broker={selectedBroker}
        onApprove={handleApproveBroker}
        onRevoke={handleRevokeBroker}
        primaryColor={primaryColor}
      />
    </Box>
  );
};

export default AdminDashboard;
