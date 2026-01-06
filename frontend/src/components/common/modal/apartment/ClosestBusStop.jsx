/**
 * Closest Bus Stop Component
 * Fetches and displays the closest MBTA bus stop to the apartment location
 * Only fetches when user clicks the button to avoid rate limits
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { fetchNearbyBusStops, fetchStopRoutes } from '../../../../services/mbtaService';

const ClosestBusStop = ({ latitude, longitude, address }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [closestStop, setClosestStop] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  const handleFetchClosestStop = async () => {
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      setError('Invalid location coordinates');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch nearby stops (within 500m)
      const stops = await fetchNearbyBusStops(latitude, longitude, 500);

      if (stops.length === 0) {
        setError('No bus stops found within 500 meters of this location.');
        setIsLoading(false);
        return;
      }

      // Find the closest stop (stops are sorted by distance in the service)
      const closest = stops[0];
      setClosestStop(closest);

      // Fetch routes for the closest stop
      try {
        const stopRoutes = await fetchStopRoutes(closest.id);
        setRoutes(stopRoutes);
      } catch (routeError) {
        console.error('Error fetching routes:', routeError);
        // Don't fail if routes can't be fetched
      }

      setHasFetched(true);
    } catch (err) {
      console.error('Error fetching closest bus stop:', err);
      // Show user-friendly error message
      let errorMessage = 'Failed to fetch nearby bus stops.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response) {
        if (err.response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (err.response.status >= 500) {
          errorMessage = 'MBTA service is temporarily unavailable. Please try again later.';
        } else {
          errorMessage = 'Unable to fetch bus stop information at this time.';
        }
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Use distance from stop object (already calculated in service)
  const distance = closestStop?.distance || null;

  if (!hasFetched) {
    return (
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<DirectionsBusIcon />}
          onClick={handleFetchClosestStop}
          disabled={isLoading || !latitude || !longitude}
          fullWidth
          sx={{
            textTransform: 'none',
            py: 1.5,
            borderColor: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              bgcolor: 'action.hover',
            },
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Finding closest bus stop...
            </>
          ) : (
            'Show Closest Bus Stop'
          )}
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Card
      sx={{
        mt: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <DirectionsBusIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Closest Bus Stop
          </Typography>
        </Box>

        {closestStop && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {closestStop.name}
              </Typography>
              {closestStop.description && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {closestStop.description}
                </Typography>
              )}
              {distance && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {distance < 1000
                      ? `${Math.round(distance)} meters away`
                      : `${(distance / 1000).toFixed(1)} km away`}
                  </Typography>
                </Box>
              )}
            </Box>

            {closestStop.wheelchairAccessible && (
              <Chip
                label="Wheelchair Accessible"
                size="small"
                sx={{
                  bgcolor: 'success.light',
                  color: 'success.contrastText',
                  mb: 2,
                }}
              />
            )}

            {routes.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Available Routes:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {routes.slice(0, 10).map((route) => (
                    <Chip
                      key={route.id}
                      label={route.shortName || route.name}
                      size="small"
                      sx={{
                        bgcolor: `#${route.color || '1976d2'}`,
                        color: `#${route.textColor || 'ffffff'}`,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  ))}
                  {routes.length > 10 && (
                    <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                      +{routes.length - 10} more
                    </Typography>
                  )}
                </Box>
              </>
            )}

            <Button
              variant="text"
              size="small"
              onClick={handleFetchClosestStop}
              disabled={isLoading}
              sx={{ mt: 2, textTransform: 'none' }}
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ClosestBusStop;

