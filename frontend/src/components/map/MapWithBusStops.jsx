/**
 * Map Component with MBTA Bus Stops Integration
 * Displays nearby bus stops on the map
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Chip, Tooltip, IconButton } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CloseIcon from '@mui/icons-material/Close';
import ModernMapComponent from './ModernMapComponent';
import { fetchNearbyBusStops, fetchStopRoutes } from '../../services/mbtaService';
import { loadGoogleMapsApi } from './GoogleMapsLoader';

const MapWithBusStops = ({
  position = [0, 0],
  radius = 5000,
  zoom,
  onPositionChange,
  apiKey,
  onError,
  mapId,
  height = 400,
  showRadius = true,
  showBusStops = true,
  busStopRadius = 500, // meters
}) => {
  const [busStops, setBusStops] = useState([]);
  const [isLoadingStops, setIsLoadingStops] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);
  const [stopRoutes, setStopRoutes] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);

  // Fetch bus stops when position changes
  useEffect(() => {
    if (!showBusStops || !position || position[0] === 0 || position[1] === 0) {
      return;
    }

    const fetchStops = async () => {
      try {
        setIsLoadingStops(true);
        const stops = await fetchNearbyBusStops(position[1], position[0], busStopRadius);
        setBusStops(stops);
      } catch (error) {
        console.error('Error fetching bus stops:', error);
      } finally {
        setIsLoadingStops(false);
      }
    };

    // Debounce API calls
    const timeoutId = setTimeout(fetchStops, 500);
    return () => clearTimeout(timeoutId);
  }, [position, busStopRadius, showBusStops]);

  // Display bus stops on map
  useEffect(() => {
    if (!mapInstance || !window.google?.maps || busStops.length === 0) {
      return;
    }

    // Clear existing markers
    markers.forEach((marker) => {
      if (marker.infoWindow) {
        marker.infoWindow.close();
      }
      if (marker.marker) {
        marker.marker.setMap(null);
      }
    });

    const newMarkers = [];
    const newInfoWindow = new window.google.maps.InfoWindow();

    busStops.forEach((stop) => {
      // Create marker for bus stop
      const stopMarker = new window.google.maps.Marker({
        position: { lat: stop.latitude, lng: stop.longitude },
        map: mapInstance,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#1976d2',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        title: stop.name,
      });

      // Create info window content
      const infoContent = `
        <div style="font-family: Arial, sans-serif; padding: 8px; min-width: 200px;">
          <div style="font-weight: bold; margin-bottom: 5px; color: #1976d2;">
            <span style="font-size: 16px;">🚌</span> ${stop.name}
          </div>
          ${stop.description ? `<div style="font-size: 12px; color: #666; margin-bottom: 5px;">${stop.description}</div>` : ''}
          ${stop.wheelchairAccessible ? '<div style="font-size: 11px; color: #4caf50;">♿ Wheelchair Accessible</div>' : ''}
        </div>
      `;

      // Add click listener
      stopMarker.addListener('click', async () => {
        // Close other info windows
        if (infoWindow) {
          infoWindow.close();
        }

        // Fetch routes for this stop
        try {
          const routes = await fetchStopRoutes(stop.id);
          setStopRoutes(routes);
          setSelectedStop(stop);

          // Update info window with routes
          const routesHtml = routes.length > 0
            ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                <div style="font-size: 11px; font-weight: bold; margin-bottom: 4px;">Routes:</div>
                ${routes.map((route) => `
                  <span style="display: inline-block; margin: 2px; padding: 4px 8px; background-color: #${route.color || '1976d2'}; color: #${route.textColor || 'ffffff'}; border-radius: 4px; font-size: 11px;">
                    ${route.shortName || route.name}
                  </span>
                `).join('')}
              </div>`
            : '';

          newInfoWindow.setContent(infoContent + routesHtml);
          newInfoWindow.open(mapInstance, stopMarker);
          setInfoWindow(newInfoWindow);
        } catch (error) {
          console.error('Error fetching routes:', error);
          newInfoWindow.setContent(infoContent);
          newInfoWindow.open(mapInstance, stopMarker);
          setInfoWindow(newInfoWindow);
        }
      });

      newMarkers.push({
        marker: stopMarker,
        stop,
        infoWindow: newInfoWindow,
      });
    });

    setMarkers(newMarkers);

    // Cleanup
    return () => {
      newMarkers.forEach(({ marker, infoWindow: iw }) => {
        if (iw) iw.close();
        marker.setMap(null);
      });
    };
  }, [mapInstance, busStops, infoWindow]);

  // Get map instance reference
  const handleMapLoad = useCallback(async () => {
    if (!apiKey) return;

    try {
      await loadGoogleMapsApi(apiKey, ['places', 'marker']);
      
      // Wait for map to be ready with timeout to prevent infinite polling
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max (50 * 100ms)
      
      const checkMap = setInterval(() => {
        attempts++;
        const mapElement = document.querySelector('[data-map-instance]');
        if (mapElement && window.google?.maps) {
          // We'll need to pass map instance from ModernMapComponent
          // For now, we'll use a different approach
          clearInterval(checkMap);
        } else if (attempts >= maxAttempts) {
          // Stop polling after max attempts to prevent infinite loops
          clearInterval(checkMap);
          console.warn('Map element not found after maximum attempts');
        }
      }, 100);
      
      // Return cleanup function
      return () => clearInterval(checkMap);
    } catch (error) {
      console.error('Error loading map:', error);
    }
  }, [apiKey]);

  return (
    <Box sx={{ position: 'relative', width: '100%', height }}>
      <ModernMapComponent
        position={position}
        radius={radius}
        zoom={zoom}
        onPositionChange={onPositionChange}
        apiKey={apiKey}
        onError={onError}
        mapId={mapId}
        height={height}
        showRadius={showRadius}
      />

      {/* Bus stops info panel */}
      {showBusStops && busStops.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 2,
            boxShadow: 3,
            maxWidth: 300,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 1000,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsBusIcon color="primary" />
              <Box sx={{ fontWeight: 600, fontSize: 14 }}>
                Nearby Bus Stops ({busStops.length})
              </Box>
            </Box>
            {isLoadingStops && (
              <Box sx={{ fontSize: 12, color: 'text.secondary' }}>Loading...</Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            {busStops.slice(0, 5).map((stop) => (
              <Tooltip key={stop.id} title={stop.description || stop.name}>
                <Chip
                  label={stop.name}
                  size="small"
                  onClick={() => {
                    setSelectedStop(stop);
                    // Center map on stop
                    if (onPositionChange) {
                      onPositionChange([stop.longitude, stop.latitude]);
                    }
                  }}
                  sx={{
                    justifyContent: 'flex-start',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  icon={stop.wheelchairAccessible ? <span>♿</span> : undefined}
                />
              </Tooltip>
            ))}
            {busStops.length > 5 && (
              <Box sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>
                +{busStops.length - 5} more stops
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Selected stop details */}
      {selectedStop && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            right: 10,
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 2,
            boxShadow: 3,
            zIndex: 1000,
            maxWidth: 400,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ fontWeight: 600, fontSize: 16 }}>{selectedStop.name}</Box>
            <IconButton size="small" onClick={() => setSelectedStop(null)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          {selectedStop.description && (
            <Box sx={{ fontSize: 12, color: 'text.secondary', mb: 1 }}>
              {selectedStop.description}
            </Box>
          )}
          {stopRoutes.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ fontSize: 12, fontWeight: 600, mb: 0.5 }}>Routes:</Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {stopRoutes.map((route) => (
                  <Chip
                    key={route.id}
                    label={route.shortName || route.name}
                    size="small"
                    sx={{
                      bgcolor: `#${route.color || '1976d2'}`,
                      color: `#${route.textColor || 'ffffff'}`,
                      fontSize: 11,
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MapWithBusStops;

