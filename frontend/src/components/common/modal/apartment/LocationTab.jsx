/**
 * Apartment Location Tab Component
 */

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import ModernMapComponent from '../../../map/ModernMapComponent';
import ClosestBusStop from './ClosestBusStop';

const LocationTab = ({
  apartment,
  locationAvailable,
  displayAddress,
  onMapLoadingChange,
  onMapErrorChange,
  isMapLoading,
  mapError,
  activeTab,
  open,
}) => {
  const theme = useTheme();

  // Extract coordinates from apartment - must be called unconditionally
  const mapPosition = useMemo(() => {
    // Handle empty string or invalid location
    if (!apartment?.location || 
        typeof apartment.location === 'string' || 
        !apartment.location.coordinates ||
        !Array.isArray(apartment.location.coordinates) ||
        apartment.location.coordinates.length < 2) {
      return [0, 0]; // Default position
    }
    
    // Apartments use [longitude, latitude] format for GeoJSON compliance
    const lng = parseFloat(apartment.location.coordinates[0]);
    const lat = parseFloat(apartment.location.coordinates[1]);
    
    // Validate coordinates are valid numbers and within valid ranges
    if (isNaN(lat) || isNaN(lng) || 
        !isFinite(lat) || !isFinite(lng) ||
        lat < -90 || lat > 90 || lng < -180 || lng > 180 ||
        (lat === 0 && lng === 0)) {
      return [0, 0];
    }
    
    return [lng, lat];
  }, [apartment]);

  // Extract coordinates for bus stop component - must be called unconditionally
  const coordinates = useMemo(() => {
    // Handle empty string or invalid location
    if (!apartment?.location || 
        typeof apartment.location === 'string' || 
        !apartment.location.coordinates ||
        !Array.isArray(apartment.location.coordinates) ||
        apartment.location.coordinates.length < 2) {
      return { lat: null, lng: null };
    }
    
    const lng = parseFloat(apartment.location.coordinates[0]);
    const lat = parseFloat(apartment.location.coordinates[1]);
    
    // Validate coordinates are valid numbers and within valid ranges
    if (isNaN(lat) || isNaN(lng) || 
        !isFinite(lat) || !isFinite(lng) ||
        lat < -90 || lat > 90 || lng < -180 || lng > 180 ||
        (lat === 0 && lng === 0)) {
      return { lat: null, lng: null };
    }
    
    return { lat, lng };
  }, [apartment]);

  if (!locationAvailable) {
    return (
      <Box
        sx={{
          width: "100%",
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor:
            theme.palette.mode === "light" ? "#f5f5f5" : "#333",
          borderRadius: 2,
          border:
            theme.palette.mode === "light"
              ? "1px solid #e0e0e0"
              : "1px solid #444",
        }}
      >
        <Typography color="text.secondary" align="center">
          Exact location not disclosed by landlord.<br />
          Contact broker for more details.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {displayAddress}
      </Typography>

      {/* Modern Map Component */}
      <Box
        sx={{
          width: "100%",
          height: 300,
          borderRadius: 2,
          overflow: "hidden",
          border:
            theme.palette.mode === "light"
              ? "1px solid #e0e0e0"
              : "1px solid #444",
          mb: 2,
        }}
      >
        <ModernMapComponent
          position={mapPosition}
          zoom={14}
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          onError={(err) => {
            if (onMapErrorChange) {
              onMapErrorChange(err.message || 'Error loading map');
            }
          }}
          showRadius={false}
          height={300}
        />
      </Box>

      {/* Closest Bus Stop Component */}
      {coordinates.lat && coordinates.lng && (
        <ClosestBusStop
          latitude={coordinates.lat}
          longitude={coordinates.lng}
          address={displayAddress}
        />
      )}
    </Box>
  );
};

export default LocationTab;

