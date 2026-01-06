import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip, CircularProgress, Chip, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import HomeIcon from '@mui/icons-material/Home';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LayersIcon from '@mui/icons-material/Layers';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewApartmentModal from '../common/modal/ViewApartmentModal';

// Predefined marker URLs to avoid direct use of google object
const MARKER_ICONS = {
  green: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  yellow: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  orange: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
  red: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  blue: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
};

// Libraries to load
const libraries = ['places'];

const MapContainer = styled(Box)(({ theme }) => ({
  height: '70vh',
  minHeight: 500,
  width: '100%',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[4]
}));

const MapControls = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2]
}));

const InfoWindowContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  maxWidth: 200
}));

/**
 * Component to display apartments on a map
 */
const ApartmentMapView = ({ userLocation = null, initialCenter = { lat: 42.3601, lng: -71.0589 }, onError }) => {
  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [apartmentForModal, setApartmentForModal] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [zoom, setZoom] = useState(11);
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState('roadmap');
  const [center, setCenter] = useState(initialCenter);
  const [fetchError, setFetchError] = useState(null);
  
  // Load Google Maps API with useLoadScript hook
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });
  
  // Notify parent component about errors
  useEffect(() => {
    if (loadError && onError) {
      onError(loadError);
    }
  }, [loadError, onError]);
  
  // Fetch apartments - always fetch all apartments, filter by location if provided
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        
        let response;
        // Try to get nearby apartments if user location is provided
        if (userLocation && userLocation.lat && userLocation.lng) {
          try {
            response = await axios.get(`http://localhost:4000/api/apartments/nearby`, {
              params: {
                latitude: userLocation.lat,
                longitude: userLocation.lng,
                radius: 50 // 50km radius to show more apartments
              },
              withCredentials: true
            });
            
            // Set center to user location
            setCenter({ lat: userLocation.lat, lng: userLocation.lng });
            setZoom(12);
          } catch (nearbyError) {
            // If nearby fails, fall back to all apartments
            console.warn('Nearby apartments fetch failed, using all apartments:', nearbyError);
            response = await axios.get('http://localhost:4000/api/apartments', {
              withCredentials: true
            });
          }
        } else {
          // Get all apartments
          response = await axios.get('http://localhost:4000/api/apartments', {
            withCredentials: true
          });
          
          // If we have apartments, center map on them
          if (response.data && response.data.length > 0) {
            const validApartments = response.data.filter(apt => 
              apt.location && 
              apt.location.coordinates && 
              Array.isArray(apt.location.coordinates) &&
              apt.location.coordinates.length >= 2
            );
            
            if (validApartments.length > 0) {
              // Calculate center of all apartments
              const avgLat = validApartments.reduce((sum, apt) => 
                sum + parseFloat(apt.location.coordinates[1]), 0) / validApartments.length;
              const avgLng = validApartments.reduce((sum, apt) => 
                sum + parseFloat(apt.location.coordinates[0]), 0) / validApartments.length;
              
              if (!isNaN(avgLat) && !isNaN(avgLng)) {
                setCenter({ lat: avgLat, lng: avgLng });
                setZoom(11);
              }
            }
          }
        }
        
        // Filter out apartments without valid coordinates
        const validApartments = (response.data || []).filter(apt => {
          if (!apt || !apt.location || !apt.location.coordinates) return false;
          if (!Array.isArray(apt.location.coordinates) || apt.location.coordinates.length < 2) return false;
          
          const lat = parseFloat(apt.location.coordinates[1]);
          const lng = parseFloat(apt.location.coordinates[0]);
          
          return !isNaN(lat) && !isNaN(lng) && 
                 isFinite(lat) && isFinite(lng) &&
                 lat >= -90 && lat <= 90 && 
                 lng >= -180 && lng <= 180 &&
                 !(lat === 0 && lng === 0);
        });
        
        setApartments(validApartments);
        
        if (validApartments.length === 0) {
          setFetchError('No apartments with valid locations found.');
        }
      } catch (error) {
        console.error('Error fetching apartments:', error);
        setFetchError(error.response?.data?.error || 'Failed to load apartments. Please try again.');
        setApartments([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if Google Maps is loaded
    if (isLoaded) {
      fetchApartments();
    }
  }, [userLocation, isLoaded]);
  
  // Set map ref when loaded
  const onLoad = useCallback((map) => {
    setMapRef(map);
  }, []);
  
  // Fit map bounds to show all apartments
  const fitMapBounds = useCallback(() => {
    if (!mapRef || apartments.length === 0) return;
    
    const validApartments = apartments.filter(apt => {
      if (!apt?.location?.coordinates) return false;
      const lat = parseFloat(apt.location.coordinates[1]);
      const lng = parseFloat(apt.location.coordinates[0]);
      return !isNaN(lat) && !isNaN(lng) && 
             isFinite(lat) && isFinite(lng) &&
             lat >= -90 && lat <= 90 && 
             lng >= -180 && lng <= 180 &&
             !(lat === 0 && lng === 0);
    });
    
    if (validApartments.length === 0) return;
    
    // If only one apartment, just center on it
    if (validApartments.length === 1) {
      const apt = validApartments[0];
      const lat = parseFloat(apt.location.coordinates[1]);
      const lng = parseFloat(apt.location.coordinates[0]);
      mapRef.panTo({ lat, lng });
      mapRef.setZoom(14);
      return;
    }
    
    // Create bounds to fit all apartments
    const bounds = new window.google.maps.LatLngBounds();
    
    validApartments.forEach(apt => {
      const lat = parseFloat(apt.location.coordinates[1]);
      const lng = parseFloat(apt.location.coordinates[0]);
      bounds.extend({ lat, lng });
    });
    
    // Include user location in bounds if available
    if (userLocation && userLocation.lat && userLocation.lng) {
      bounds.extend({ lat: userLocation.lat, lng: userLocation.lng });
    }
    
    // Fit bounds with padding
    mapRef.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    });
  }, [mapRef, apartments, userLocation]);
  
  // Fit bounds when apartments are loaded or map ref changes
  useEffect(() => {
    if (mapRef && apartments.length > 0 && isLoaded) {
      // Small delay to ensure map is fully rendered
      const timer = setTimeout(() => {
        fitMapBounds();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mapRef, apartments, isLoaded, fitMapBounds]);
  
  // Clear map ref when unmounted
  const onUnmount = useCallback(() => {
    setMapRef(null);
  }, []);
  
  // Handle marker click
  const handleMarkerClick = (apartment) => {
    setSelectedApartment(apartment);
  };
  
  // Handle opening apartment modal
  const handleViewApartment = (apartment) => {
    setApartmentForModal(apartment);
    setModalOpen(true);
    setSelectedApartment(null); // Close info window when opening modal
  };
  
  // Handle closing apartment modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setApartmentForModal(null);
  };
  
  // Zoom in
  const handleZoomIn = () => {
    if (mapRef && zoom < 20) {
      const newZoom = zoom + 1;
      mapRef.setZoom(newZoom);
      setZoom(newZoom);
    }
  };
  
  // Zoom out
  const handleZoomOut = () => {
    if (mapRef && zoom > 1) {
      const newZoom = zoom - 1;
      mapRef.setZoom(newZoom);
      setZoom(newZoom);
    }
  };
  
  // Toggle map type
  const handleToggleMapType = () => {
    const types = ['roadmap', 'satellite', 'hybrid', 'terrain'];
    const currentIndex = types.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % types.length;
    setMapType(types[nextIndex]);
  };
  
  // Center on user location
  const handleCenterOnUser = () => {
    if (userLocation && mapRef) {
      mapRef.panTo({ lat: userLocation.lat, lng: userLocation.lng });
      setCenter({ lat: userLocation.lat, lng: userLocation.lng });
    }
  };
  
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Get marker color based on price
  const getMarkerIcon = (price) => {
    if (!price) return MARKER_ICONS.blue; // Default for missing price
    if (price < 1000) return MARKER_ICONS.green;
    if (price < 2000) return MARKER_ICONS.yellow;
    if (price < 3000) return MARKER_ICONS.orange;
    return MARKER_ICONS.red;
  };
  
  // Create a custom marker for user location
  const createUserLocationMarker = () => {
    return {
      fillColor: '#4285F4',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 8,
      path: 0  // Using 0 as a simple circle path instead of SymbolPath.CIRCLE
    };
  };
  
  // Handle rendering error states
  if (loadError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={500}>
        <Typography color="error">
          Error loading Google Maps. Please check your API key or try again later.
        </Typography>
      </Box>
    );
  }
  
  if (!isLoaded) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={500}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <MapContainer>
      {loading && (
        <Box 
          position="absolute" 
          top="50%" 
          left="50%" 
          zIndex={1} 
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <CircularProgress />
        </Box>
      )}
      
      {/* Apartment count badge */}
      {!loading && apartments.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1,
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 3,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {apartments.length} {apartments.length === 1 ? 'apartment' : 'apartments'} found
          </Typography>
        </Paper>
      )}
      
      {fetchError && (
        <Box 
          position="absolute" 
          top="50%" 
          left="50%" 
          zIndex={1} 
          sx={{ 
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 1,
            boxShadow: 2
          }}
        >
          <Typography color="error">{fetchError}</Typography>
        </Box>
      )}
      
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeId: mapType,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true
        }}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={{ lat: userLocation.lat, lng: userLocation.lng }}
            icon={createUserLocationMarker()}
            zIndex={1000}
          />
        )}
        
        {/* Apartment markers */}
        {apartments.map(apartment => {
          // Skip apartments without valid coordinates
          if (!apartment || !apartment.location) {
            return null;
          }
          
          // Handle empty string location
          if (typeof apartment.location === 'string') {
            return null;
          }
          
          if (!apartment.location.coordinates || 
              !Array.isArray(apartment.location.coordinates) ||
              apartment.location.coordinates.length < 2) {
            return null;
          }
          
          // Validate coordinates are valid numbers
          const lng = parseFloat(apartment.location.coordinates[0]);
          const lat = parseFloat(apartment.location.coordinates[1]);
          
          if (isNaN(lat) || isNaN(lng) || 
              !isFinite(lat) || !isFinite(lng) ||
              lat < -90 || lat > 90 || 
              lng < -180 || lng > 180 ||
              (lat === 0 && lng === 0)) {
            return null;
          }
          
          // Convert from [longitude, latitude] to { lat, lng }
          const position = {
            lat: lat,
            lng: lng
          };
          
          return (
            <Marker
              key={apartment._id}
              position={position}
              onClick={() => handleMarkerClick(apartment)}
              icon={{
                url: getMarkerIcon(apartment.price)
              }}
            />
          );
        })}
        
        {/* Info window for selected apartment */}
        {selectedApartment && selectedApartment.location && selectedApartment.location.coordinates && (
          <InfoWindow
            position={{
              lat: selectedApartment.location.coordinates[1],
              lng: selectedApartment.location.coordinates[0]
            }}
            onCloseClick={() => setSelectedApartment(null)}
          >
            <InfoWindowContent>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {selectedApartment.bedrooms || 'Studio'} {selectedApartment.bedrooms && 'BHK'} in {selectedApartment.neighborhood || 'Unknown Area'}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ fontSize: '0.85rem' }}>
                {selectedApartment.location.address || selectedApartment.neighborhood || 'Address not available'}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                {formatPrice(selectedApartment.price)}
              </Typography>
              {selectedApartment.amenities && selectedApartment.amenities.length > 0 && (
                <Box display="flex" flexWrap="wrap" gap={0.5} mt={1} mb={1}>
                  {selectedApartment.amenities.slice(0, 3).map((amenity, index) => (
                    <Chip key={index} label={amenity} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                  ))}
                  {selectedApartment.amenities.length > 3 && (
                    <Chip label={`+${selectedApartment.amenities.length - 3}`} size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
                  )}
                </Box>
              )}
              <Button
                variant="contained"
                size="small"
                fullWidth
                startIcon={<VisibilityIcon />}
                onClick={() => handleViewApartment(selectedApartment)}
                sx={{
                  mt: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: '#00b386',
                  '&:hover': {
                    backgroundColor: '#009973',
                  },
                }}
              >
                View Details
              </Button>
            </InfoWindowContent>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* Map controls */}
      <MapControls>
        <Tooltip title="Zoom in">
          <IconButton size="small" onClick={handleZoomIn}>
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom out">
          <IconButton size="small" onClick={handleZoomOut}>
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Change map type">
          <IconButton size="small" onClick={handleToggleMapType}>
            <LayersIcon />
          </IconButton>
        </Tooltip>
        {userLocation && (
          <Tooltip title="Center on your location">
            <IconButton size="small" onClick={handleCenterOnUser}>
              <MyLocationIcon />
            </IconButton>
          </Tooltip>
        )}
        {apartments.length > 0 && (
          <Tooltip title="Fit all apartments in view">
            <IconButton size="small" onClick={fitMapBounds}>
              <HomeIcon />
            </IconButton>
          </Tooltip>
        )}
      </MapControls>
      
      {/* Apartment Modal */}
      {apartmentForModal && (
        <ViewApartmentModal
          open={modalOpen}
          onClose={handleCloseModal}
          apartment={apartmentForModal}
        />
      )}
    </MapContainer>
  );
};

export default ApartmentMapView;