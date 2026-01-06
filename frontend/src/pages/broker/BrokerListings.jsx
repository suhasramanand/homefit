/**
 * Broker Listings Page
 * Main component that aggregates all broker listings sub-components
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import BrokerEditListing from "./BrokerEditListing";

// Import sub-components
import ListingHeader from "../../components/broker/listings/ListingHeader";
import ListingCard from "../../components/broker/listings/ListingCard";
import EmptyState from "../../components/broker/listings/EmptyState";
import ApprovalPendingView from "../../components/broker/listings/ApprovalPendingView";
import ListingContextMenu from "../../components/broker/listings/ListingContextMenu";
import DeleteListingDialog from "../../components/broker/listings/DeleteListingDialog";

const BrokerListings = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);
  const primaryColor = theme.palette.primary.main;
  const isDarkMode = theme.palette.mode === "dark";
  const isApproved = user?.isApproved === true;

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      if (!user || user.type !== "broker") {
        navigate("/login");
        return;
      }

      if (!isApproved) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get("/api/broker/listings", {
          withCredentials: true,
        });

        let listingsArray = [];
        if (response && response.data) {
          if (Array.isArray(response.data)) {
            listingsArray = response.data;
          } else if (typeof response.data === 'object') {
            const possibleArrays = Object.values(response.data).filter(Array.isArray);
            if (possibleArrays.length > 0) {
              listingsArray = possibleArrays[0];
            }
          }
        }
        
        const validListings = listingsArray.filter(item => item && typeof item === 'object' && item._id);
        setListings(validListings);
      } catch (error) {
        console.error("Error fetching listings:", error);

        if (error.response && error.response.status === 403) {
          showSnackbar(
            "You need admin approval before accessing listings",
            "error"
          );
        } else {
          showSnackbar(
            "Failed to load listings. Please try again later.",
            "error"
          );
        }

        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, navigate, isApproved]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleMenuOpen = (event, listing) => {
    if (!listing || !listing._id) return; 
    setAnchorEl(event.currentTarget);
    setSelectedListing(listing);
  };

  const handleEditClick = (id) => {
    if (!id) return; 
    setSelectedId(id);
    setEditOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    if (!selectedListing || !selectedListing._id) return;
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedListing || !selectedListing._id) {
      setDeleteDialogOpen(false);
      return;
    }
    
    try {
      await axios.delete(`/api/broker/listings/${selectedListing._id}`, {
        withCredentials: true,
      });
      
      setListings(prevListings => 
        prevListings.filter(listing => listing && listing._id !== selectedListing._id)
      );
      
      showSnackbar("Listing deleted successfully");
    } catch (error) {
      console.error("Error deleting listing:", error);
      showSnackbar("Failed to delete listing. Please try again.", "error");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedListing(null);
    }
  };

  const handleToggleActive = async () => {
    if (!selectedListing || !selectedListing._id) {
      handleMenuClose();
      return;
    }
    
    try {
      const updatedListing = {
        ...selectedListing,
        isActive: !selectedListing.isActive,
      };
      
      await axios.put(
        `/api/broker/listings/${selectedListing._id}/toggle-active`,
        { isActive: updatedListing.isActive },
        { withCredentials: true }
      );

      setListings(prevListings => 
        prevListings.map(listing => 
          listing && listing._id === selectedListing._id ? updatedListing : listing
        )
      );

      showSnackbar(
        `Listing ${
          updatedListing.isActive ? "activated" : "deactivated"
        } successfully`
      );
    } catch (error) {
      console.error("Error toggling listing status:", error);
      showSnackbar(
        "Failed to update listing status. Please try again.",
        "error"
      );
    } finally {
      handleMenuClose();
    }
  };

  const handleViewDetails = () => {
    if (selectedListing?._id) {
      navigate(`/broker/listings/${selectedListing._id}`);
    }
    handleMenuClose();
  };

  const handleEditFromMenu = () => {
    if (selectedListing?._id) {
      handleEditClick(selectedListing._id);
    }
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress sx={{ color: primaryColor }} />
      </Box>
    );
  }

  if (!isApproved) {
    return (
      <ApprovalPendingView
        primaryColor={primaryColor}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", mx: "auto" }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <ListingHeader primaryColor={primaryColor} />

      {!listings || listings.length === 0 ? (
        <EmptyState primaryColor={primaryColor} isDarkMode={isDarkMode} />
      ) : (
        <Grid container spacing={3}>
          {listings
            .filter(listing => listing && typeof listing === 'object' && listing._id)
            .map((listing) => (
              <Grid item xs={12} sm={6} md={4} key={listing._id}>
                <ListingCard
                  listing={listing}
                  primaryColor={primaryColor}
                  isDarkMode={isDarkMode}
                  onMenuOpen={handleMenuOpen}
                  onEditClick={handleEditClick}
                />
              </Grid>
            ))}
        </Grid>
      )}

      <ListingContextMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        selectedListing={selectedListing}
        primaryColor={primaryColor}
        isDarkMode={isDarkMode}
        onViewDetails={handleViewDetails}
        onEdit={handleEditFromMenu}
        onToggleActive={handleToggleActive}
        onDelete={handleDeleteClick}
      />

      <DeleteListingDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDarkMode={isDarkMode}
      />

      {selectedId && (
        <BrokerEditListing
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setSelectedId(null);
          }}
          apartmentId={selectedId}
          onUpdate={(updated) => {
            if (updated && updated._id) {
              setListings((prev) => {
                if (!Array.isArray(prev)) return [updated];
                return prev.map((apt) => 
                  apt && apt._id === updated._id ? updated : apt
                );
              });
            }
          }}
        />
      )}
    </Box>
  );
};

export default BrokerListings;
