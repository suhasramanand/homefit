/**
 * Modern Google Maps Component
 * Built following best practices from production apps (Uber, Instacart, etc.)
 * 
 * Features:
 * - Advanced Markers with Map ID support
 * - Proper error handling and retry logic
 * - Optimized rendering and performance
 * - Clean component architecture
 * - Production-ready error states
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Box, CircularProgress, Alert, Button } from '@mui/material';
import { loadGoogleMapsApi } from './GoogleMapsLoader';

const ModernMapComponent = ({
  position = [0, 0], // [lng, lat]
  radius = 5000, // radius in meters
  zoom,
  onPositionChange,
  apiKey,
  onError,
  mapId, // Optional Map ID for Advanced Markers
  height = 400,
  showRadius = true,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const listenersRef = useRef([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Memoize position to avoid unnecessary updates
  const memoizedPosition = useMemo(() => {
    // Handle various invalid input formats
    if (!position || !Array.isArray(position) || position.length < 2) {
      return { lat: 42.3601, lng: -71.0589 }; // Default to Boston
    }
    
    // Parse and validate coordinates
    const lat = parseFloat(position[1]);
    const lng = parseFloat(position[0]);
    
    // Validate that both are valid numbers
    if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
      return { lat: 42.3601, lng: -71.0589 }; // Default to Boston
    }
    
    // Validate coordinate ranges
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return { lat: 42.3601, lng: -71.0589 }; // Default to Boston
    }
    
    return { lat, lng };
  }, [position]);

  // Calculate optimal zoom based on radius
  const calculatedZoom = useMemo(() => {
    if (zoom) return zoom;
    if (radius > 10000) return 10;
    if (radius > 5000) return 11;
    if (radius > 2000) return 12;
    if (radius > 1000) return 13;
    return 14;
  }, [radius, zoom]);

  // Cleanup listeners
  const cleanupListeners = useCallback(() => {
    listenersRef.current.forEach(listener => {
      if (listener && listener.remove) {
        listener.remove();
      }
    });
    listenersRef.current = [];
  }, []);

  // Initialize map with proper error handling
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || !apiKey) return;

    try {
      setIsLoading(true);
      setError(null);

      // Load Google Maps API
      await loadGoogleMapsApi(apiKey, ['places', 'marker']);

      if (!window.google?.maps) {
        throw new Error('Google Maps API failed to load');
      }

      // Map configuration following best practices
      const mapOptions = {
        center: memoizedPosition,
        zoom: calculatedZoom,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        gestureHandling: 'cooperative', // Better mobile experience
        // Use Map ID if provided (required for Advanced Markers)
        ...(mapId && { mapId }),
      };

      // Create map instance
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

      // Create marker - prefer Advanced Marker if Map ID is available
      const useAdvancedMarker = mapId && window.google.maps.marker?.AdvancedMarkerElement;

      if (useAdvancedMarker) {
        markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
          map: mapInstanceRef.current,
          position: memoizedPosition,
          gmpDraggable: true,
        });

        // Advanced Marker drag event
        const dragListener = markerRef.current.addListener('dragend', (event) => {
          const newPos = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          updatePosition(newPos);
        });
        listenersRef.current.push(dragListener);
      } else {
        // Fallback to legacy Marker
        markerRef.current = new window.google.maps.Marker({
          position: memoizedPosition,
          map: mapInstanceRef.current,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
        });

        // Legacy Marker drag event
        const dragListener = window.google.maps.event.addListener(
          markerRef.current,
          'dragend',
          (event) => {
            const newPos = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };
            updatePosition(newPos);
          }
        );
        listenersRef.current.push(dragListener);
      }

      // Create radius circle if enabled
      if (showRadius) {
        circleRef.current = new window.google.maps.Circle({
          map: mapInstanceRef.current,
          center: memoizedPosition,
          radius: radius,
          strokeColor: '#23CEA3',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#23CEA3',
          fillOpacity: 0.15,
        });
      }

      // Map click event
      const clickListener = window.google.maps.event.addListener(
        mapInstanceRef.current,
        'click',
        (event) => {
          const newPos = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          updatePosition(newPos);
        }
      );
      listenersRef.current.push(clickListener);

      setIsLoading(false);
    } catch (err) {
      console.error('Map initialization error:', err);
      handleError(err);
      setIsLoading(false);
    }
  }, [apiKey, mapId, memoizedPosition, calculatedZoom, radius, showRadius]);

  // Update position helper
  const updatePosition = useCallback((newPos) => {
    if (!markerRef.current || !mapInstanceRef.current) return;

    // Update marker
    if (markerRef.current.position !== undefined) {
      // Advanced Marker
      markerRef.current.position = newPos;
    } else {
      // Legacy Marker
      markerRef.current.setPosition(newPos);
    }

    // Update circle
    if (circleRef.current) {
      circleRef.current.setCenter(newPos);
    }

    // Notify parent
    if (onPositionChange) {
      onPositionChange([newPos.lng, newPos.lat]);
    }
  }, [onPositionChange]);

  // Error handling
  const handleError = useCallback((err) => {
    let errorMessage = err.message || 'Failed to load Google Maps';

    if (err.message?.includes('ExpiredKeyMapError') || err.message?.includes('expired')) {
      errorMessage = 'API key has expired. Please update your Google Maps API key.';
    } else if (err.message?.includes('DeletedApiProjectMapError') || err.message?.includes('deleted')) {
      errorMessage = 'The Google Cloud project for this API key has been deleted.';
    } else if (err.message?.includes('InvalidKeyMapError')) {
      errorMessage = 'Invalid API key. Please check your Google Maps API key configuration.';
    }

    setError(errorMessage);
    if (onError) onError(err);
  }, [onError]);

  // Retry logic
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setError(null);
    cleanupListeners();
    initializeMap();
  }, [initializeMap, cleanupListeners]);

  // Initialize on mount
  useEffect(() => {
    initializeMap();

    return () => {
      cleanupListeners();
      if (mapInstanceRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(mapInstanceRef.current);
      }
    };
  }, [initializeMap, cleanupListeners]);

  // Update map when position/radius changes (debounced updates)
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || isLoading) return;

    const timeoutId = setTimeout(() => {
      try {
        const newPos = memoizedPosition;

        // Update map center if position changed significantly
        const currentCenter = mapInstanceRef.current.getCenter();
        if (currentCenter) {
          const latDiff = Math.abs(currentCenter.lat() - newPos.lat);
          const lngDiff = Math.abs(currentCenter.lng() - newPos.lng);
          
          if (latDiff > 0.001 || lngDiff > 0.001) {
            mapInstanceRef.current.setCenter(newPos);
            mapInstanceRef.current.setZoom(calculatedZoom);
          }
        }

        // Update marker
        if (markerRef.current.position !== undefined) {
          markerRef.current.position = newPos;
        } else {
          markerRef.current.setPosition(newPos);
        }

        // Update circle
        if (circleRef.current) {
          circleRef.current.setCenter(newPos);
          circleRef.current.setRadius(radius);
        }
      } catch (err) {
        console.error('Error updating map:', err);
      }
    }, 100); // Debounce updates

    return () => clearTimeout(timeoutId);
  }, [memoizedPosition, radius, calculatedZoom, isLoading]);

  // Error UI
  if (error) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          borderRadius: 1,
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={handleRetry} disabled={retryCount >= 3}>
          {retryCount >= 3 ? 'Max retries reached' : 'Retry'}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'grey.200',
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 1000,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        ref={mapRef}
        sx={{
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};

export default ModernMapComponent;

