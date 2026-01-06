/**
 * Admin Listings Page
 * Main component that aggregates all listings sub-components
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  Alert,
  Snackbar,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Import sub-components
import ListingStatsCards from '../../components/admin/listings/ListingStatsCards';
import ListingsTable from '../../components/admin/listings/ListingsTable';
import ListingDetailsDialog from '../../components/admin/listings/ListingDetailsDialog';
import DeleteListingDialog from '../../components/admin/listings/DeleteListingDialog';
import FilterDialog from '../../components/admin/listings/FilterDialog';

dayjs.extend(relativeTime);

const AdminListings = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Filter states
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    neighborhood: '',
    approvalStatus: '',
  });
  
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const primaryColor = theme.palette.primary.main;

  useEffect(() => {
    const fetchListings = async () => {
      if (!user || user.type !== 'admin') {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Get all listings
        const listingsRes = await axios.get('/api/apartments', {
          withCredentials: true,
        });
        
        setListings(listingsRes.data || []);
        setFilteredListings(listingsRes.data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
        setFilteredListings([]);
        showSnackbar('Failed to load listings', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, navigate]);

  useEffect(() => {
    // Apply search filter
    const filtered = listings.filter(listing => 
      (listing.type && listing.type.toLowerCase().includes(searchText.toLowerCase())) ||
      (listing.neighborhood && listing.neighborhood.toLowerCase().includes(searchText.toLowerCase())) ||
      (listing.brokerEmail && listing.brokerEmail.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredListings(filtered);
  }, [searchText, listings]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleViewDetails = (listing) => {
    setSelectedListing(listing);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  const handleDeleteClick = (listing) => {
    setListingToDelete(listing);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!listingToDelete) return;
    
    try {
      await axios.delete(`/api/apartments/${listingToDelete._id}`, {
        withCredentials: true
      });
      
      // Update lists
      const updatedListings = listings.filter(item => item._id !== listingToDelete._id);
      setListings(updatedListings);
      setFilteredListings(
        filteredListings.filter(item => item._id !== listingToDelete._id)
      );
      
      showSnackbar('Listing deleted successfully');
    } catch (error) {
      console.error('Error deleting listing:', error);
      showSnackbar('Failed to delete listing', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setListingToDelete(null);
  };

  const handleToggleListingStatus = async (listingId, currentStatus) => {
    try {
      await axios.put(`/api/apartments/${listingId}`, {
        isActive: !currentStatus
      }, {
        withCredentials: true
      });
      
      // Update lists
      const updatedListings = listings.map(item => 
        item._id === listingId ? { ...item, isActive: !currentStatus } : item
      );
      
      setListings(updatedListings);
      setFilteredListings(
        filteredListings.map(item => 
          item._id === listingId ? { ...item, isActive: !currentStatus } : item
        )
      );
      
      showSnackbar(`Listing ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      
      // If details dialog is open and showing this listing, update it
      if (detailsOpen && selectedListing?._id === listingId) {
        setSelectedListing({
          ...selectedListing,
          isActive: !currentStatus
        });
      }
    } catch (error) {
      console.error('Error updating listing status:', error);
      showSnackbar('Failed to update listing status', 'error');
    }
  };

  const handleOpenFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setFilterDialogOpen(false);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleApplyFilters = () => {
    let filtered = [...listings];
    
    // Apply price filter - min
    if (filters.priceMin) {
      filtered = filtered.filter(listing => 
        listing.price && listing.price >= parseInt(filters.priceMin)
      );
    }
    
    // Apply price filter - max
    if (filters.priceMax) {
      filtered = filtered.filter(listing => 
        listing.price && listing.price <= parseInt(filters.priceMax)
      );
    }
    
    // Apply bedrooms filter
    if (filters.bedrooms) {
      filtered = filtered.filter(listing => {
        if (!listing.bedrooms) return false;
        
        // Handle cases like "Studio", "1 Bedroom", etc.
        const bedroomStr = listing.bedrooms.toString().toLowerCase();
        
        if (filters.bedrooms === 'Studio') {
          return bedroomStr.includes('studio') || bedroomStr === '0';
        } else {
          return bedroomStr.startsWith(filters.bedrooms) || bedroomStr === filters.bedrooms;
        }
      });
    }
    
    // Apply neighborhood filter
    if (filters.neighborhood) {
      filtered = filtered.filter(listing => 
        listing.neighborhood && listing.neighborhood.toLowerCase() === filters.neighborhood.toLowerCase()
      );
    }
    
    // Apply approval status filter
    if (filters.approvalStatus) {
      filtered = filtered.filter(listing => 
        listing.approvalStatus === filters.approvalStatus
      );
    }
    
    setFilteredListings(filtered);
    setFilterDialogOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      neighborhood: '',
      approvalStatus: '',
    });
    setFilteredListings(listings);
    setFilterDialogOpen(false);
  };

  // Get unique neighborhoods for filter dropdown
  const uniqueNeighborhoods = [...new Set(listings
    .filter(listing => listing.neighborhood)
    .map(listing => listing.neighborhood))];

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
        Manage Listings
      </Typography>

      {/* Stats summary */}
      <ListingStatsCards listings={listings} primaryColor={primaryColor} />

      {/* Listings table */}
      <ListingsTable
        listings={listings}
        filteredListings={filteredListings}
        searchText={searchText}
        onSearchChange={(value) => setSearchText(value)}
        onViewDetails={handleViewDetails}
        onToggleStatus={handleToggleListingStatus}
        onDelete={handleDeleteClick}
        onOpenFilter={handleOpenFilterDialog}
        primaryColor={primaryColor}
      />

      {/* Listing Details Dialog */}
      <ListingDetailsDialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        listing={selectedListing}
        onToggleStatus={handleToggleListingStatus}
        primaryColor={primaryColor}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteListingDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        listing={listingToDelete}
      />
      
      {/* Filter Dialog */}
      <FilterDialog
        open={filterDialogOpen}
        onClose={handleCloseFilterDialog}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        filters={filters}
        onChange={handleFilterChange}
        uniqueNeighborhoods={uniqueNeighborhoods}
      />
    </Box>
  );
};

export default AdminListings;
