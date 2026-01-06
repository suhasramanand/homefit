/**
 * Listing Details Dialog Component
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from 'dayjs';

const ListingDetailsDialog = ({
  open,
  onClose,
  listing,
  onToggleStatus,
  primaryColor,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  if (!listing) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Listing Details
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Images */}
          {listing.imageUrls && listing.imageUrls.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                {listing.imageUrls.map((imgUrl, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={imgUrl}
                    alt={`Property image ${index + 1}`}
                    sx={{
                      width: 200,
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                ))}
              </Box>
            </Grid>
          )}
          
          {/* Main details */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Property Type</Typography>
            <Typography variant="body1" gutterBottom>{listing.type || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Price</Typography>
            <Typography variant="body1" gutterBottom>
              ${typeof listing.price === 'number' 
                ? listing.price.toLocaleString() 
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Bedrooms</Typography>
            <Typography variant="body1" gutterBottom>{listing.bedrooms || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Bathrooms</Typography>
            <Typography variant="body1" gutterBottom>{listing.bathrooms || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Square Feet</Typography>
            <Typography variant="body1" gutterBottom>{listing.sqft || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Neighborhood</Typography>
            <Typography variant="body1" gutterBottom>{listing.neighborhood || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Move-in Date</Typography>
            <Typography variant="body1" gutterBottom>
              {listing.moveInDate 
                ? dayjs(listing.moveInDate).format('MMMM D, YYYY')
                : 'N/A'
              }
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
            <Typography variant="body1" gutterBottom>
              <Chip
                label={listing.isActive ? "Active" : "Inactive"}
                size="small"
                sx={{
                  backgroundColor: listing.isActive
                    ? (isDarkMode ? 'rgba(46, 204, 113, 0.2)' : 'rgba(46, 204, 113, 0.1)')
                    : (isDarkMode ? 'rgba(231, 76, 60, 0.2)' : 'rgba(231, 76, 60, 0.1)'),
                  color: listing.isActive
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  fontWeight: 600,
                }}
              />
            </Typography>
          </Grid>
          
          {/* Location */}
          {listing.location && (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                <Typography variant="body1" gutterBottom>{listing.location.address || 'N/A'}</Typography>
              </Grid>
              {listing.location.coordinates && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Coordinates</Typography>
                  <Typography variant="body1" gutterBottom>
                    {`${listing.location.coordinates[1]}, ${listing.location.coordinates[0]}`}
                  </Typography>
                </Grid>
              )}
            </>
          )}
          
          {/* Broker info */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Broker Email</Typography>
            <Typography variant="body1" gutterBottom>{listing.brokerEmail}</Typography>
          </Grid>
          
          {/* Amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Amenities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {listing.amenities.map((amenity, index) => (
                  <Chip
                    key={index}
                    label={amenity}
                    size="small"
                    sx={{
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      color: theme.palette.text.primary,
                    }}
                  />
                ))}
              </Box>
            </Grid>
          )}
          
          {/* Additional details */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Parking</Typography>
            <Typography variant="body1" gutterBottom>{listing.parking || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Transportation</Typography>
            <Typography variant="body1" gutterBottom>{listing.transport || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Pets</Typography>
            <Typography variant="body1" gutterBottom>{listing.pets || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">View</Typography>
            <Typography variant="body1" gutterBottom>{listing.view || 'N/A'}</Typography>
          </Grid>
          
          {/* Created at */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Listed on</Typography>
            <Typography variant="body1" gutterBottom>
              {listing.createdAt
                ? dayjs(listing.createdAt).format('MMMM D, YYYY [at] h:mm A')
                : 'N/A'
              }
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            color: 'text.secondary',
          }}
        >
          Close
        </Button>
        {listing && (
          <Button
            variant="contained"
            color={listing.isActive ? "error" : "success"}
            onClick={() => onToggleStatus(listing._id, listing.isActive)}
            startIcon={listing.isActive ? <BlockIcon /> : <CheckCircleIcon />}
          >
            {listing.isActive ? "Deactivate" : "Activate"} Listing
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ListingDetailsDialog;

