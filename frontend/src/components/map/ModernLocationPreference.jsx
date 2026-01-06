/**
 * Modern Location Preference Component
 * Production-ready implementation with best practices
 * 
 * Features:
 * - Debounced autocomplete
 * - Modern Places API usage
 * - Smooth UX with loading states
 * - Error handling and recovery
 * - Mobile-optimized
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Slider,
  InputAdornment,
  Paper,
  Alert,
  CircularProgress,
  useTheme,
  Autocomplete,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ModernMapComponent from './ModernMapComponent';
import { loadGoogleMapsApi } from './GoogleMapsLoader';

const DEFAULT_CENTER = [-71.0589, 42.3601]; // [lng, lat] - Boston default
const DEFAULT_RADIUS = 5; // km

const ModernLocationPreference = ({
  value = { center: DEFAULT_CENTER, radius: DEFAULT_RADIUS, address: '' },
  onChange,
  googleMapsApiKey,
}) => {
  const theme = useTheme();
  const [localValue, setLocalValue] = useState(value);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Initialize Google Places services
  useEffect(() => {
    const initGooglePlaces = async () => {
      try {
        await loadGoogleMapsApi(googleMapsApiKey, ['places', 'marker']);

        if (!window.google?.maps?.places) {
          throw new Error('Places API not available');
        }

        // Create session token for autocomplete
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
        
        // Create autocomplete service
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        
        // Create places service (needs a temporary map element)
        const tempDiv = document.createElement('div');
        const tempMap = new window.google.maps.Map(tempDiv);
        placesServiceRef.current = new window.google.maps.places.PlacesService(tempMap);
      } catch (error) {
        console.error('Error initializing Google Places:', error);
        setGeocodingError('Failed to initialize location services. Please refresh the page.');
      }
    };

    initGooglePlaces();
  }, [googleMapsApiKey]);

  // Sync with parent value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Update value and notify parent
  const updateValue = useCallback((newValue) => {
    setLocalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange]);

  // Debounced address search
  const fetchAddressSuggestions = useCallback((input) => {
    if (!input || input.length < 3 || !autocompleteServiceRef.current) {
      setAddressSuggestions([]);
      return;
    }

    // Clear previous debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsLoadingSuggestions(true);

    // Debounce API calls (300ms)
    debounceTimerRef.current = setTimeout(() => {
      const request = {
        input,
        sessionToken: sessionTokenRef.current,
        types: ['geocode'],
      };

      autocompleteServiceRef.current.getPlacePredictions(
        request,
        (predictions, status) => {
          setIsLoadingSuggestions(false);
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setAddressSuggestions(predictions);
          } else {
            setAddressSuggestions([]);
          }
        }
      );
    }, 300);
  }, []);

  // Handle address selection
  const handleAddressSelect = useCallback(async (selectedPlace) => {
    if (!selectedPlace || !placesServiceRef.current) return;

    setIsGeocoding(true);
    setGeocodingError('');

    try {
      const request = {
        placeId: selectedPlace.place_id,
        fields: ['geometry', 'formatted_address'],
        sessionToken: sessionTokenRef.current,
      };

      placesServiceRef.current.getDetails(request, (place, status) => {
        setIsGeocoding(false);

        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry) {
          const location = place.geometry.location;
          const newCenter = [location.lng(), location.lat()];

          updateValue({
            center: newCenter,
            radius: localValue.radius,
            address: place.formatted_address || selectedPlace.description,
          });

          // Create new session token for next search
          sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
        } else {
          setGeocodingError('Could not get location details. Please try again.');
        }
      });
    } catch (error) {
      setIsGeocoding(false);
      setGeocodingError('Error processing location. Please try again.');
    }
  }, [localValue.radius, updateValue]);

  // Handle address input change
  const handleAddressChange = useCallback((event, newInputValue) => {
    const input = typeof newInputValue === 'string' ? newInputValue : newInputValue?.description || '';
    
    setLocalValue(prev => ({ ...prev, address: input }));
    fetchAddressSuggestions(input);
  }, [fetchAddressSuggestions]);

  // Handle radius change
  const handleRadiusChange = useCallback((event, newValue) => {
    updateValue({
      ...localValue,
      radius: newValue,
    });
  }, [localValue, updateValue]);

  // Handle map position change
  const handlePositionChange = useCallback(async (newPosition) => {
    if (!window.google?.maps) return;

    setIsGeocoding(true);
    setGeocodingError('');

    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: newPosition },
        (results, status) => {
          setIsGeocoding(false);

          if (status === window.google.maps.GeocoderStatus.OK && results?.[0]) {
            updateValue({
              center: [newPosition.lng, newPosition.lat],
              radius: localValue.radius,
              address: results[0].formatted_address,
            });
          } else {
            // Update position even if reverse geocoding fails
            updateValue({
              center: [newPosition.lng, newPosition.lat],
              radius: localValue.radius,
              address: localValue.address || '',
            });
          }
        }
      );
    } catch (error) {
      setIsGeocoding(false);
      // Still update position
      updateValue({
        center: [newPosition.lng, newPosition.lat],
        radius: localValue.radius,
        address: localValue.address || '',
      });
    }
  }, [localValue.radius, localValue.address, updateValue]);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Location Preference
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        Search for a location or click on the map. Adjust the radius to set how far you're willing to commute.
      </Typography>

      {/* Address Autocomplete */}
      <Box sx={{ mb: 3 }}>
        <Autocomplete
          freeSolo
          options={addressSuggestions}
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : option.description
          }
          loading={isLoadingSuggestions}
          inputValue={localValue.address || ''}
          onInputChange={handleAddressChange}
          onChange={(event, newValue) => {
            if (newValue && typeof newValue !== 'string') {
              handleAddressSelect(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Address"
              placeholder="Enter your preferred location"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoadingSuggestions ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  </>
                ),
              }}
            />
          )}
        />
      </Box>

      {/* Radius Slider */}
      <Box sx={{ mb: 3, px: 2 }}>
        <Typography id="radius-slider" gutterBottom>
          Radius: {localValue.radius} km
        </Typography>
        <Slider
          value={localValue.radius}
          onChange={handleRadiusChange}
          aria-labelledby="radius-slider"
          min={1}
          max={20}
          marks={[
            { value: 1, label: '1 km' },
            { value: 10, label: '10 km' },
            { value: 20, label: '20 km' },
          ]}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value} km`}
        />
      </Box>

      {/* Error Alert */}
      {geocodingError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setGeocodingError('')}>
          {geocodingError}
        </Alert>
      )}

      {/* Map Component */}
      <Box sx={{ height: 400, mb: 2, borderRadius: 1, overflow: 'hidden' }}>
        <ModernMapComponent
          position={localValue.center}
          radius={localValue.radius * 1000} // Convert km to meters
          onPositionChange={handlePositionChange}
          apiKey={googleMapsApiKey}
          zoom={12}
          onError={(err) => setGeocodingError(err.message)}
          showRadius={true}
        />
      </Box>

      {/* Coordinates Display */}
      <Typography variant="body2" color="text.secondary">
        Selected coordinates: {localValue.center[1]?.toFixed(6) || '0.000000'},{' '}
        {localValue.center[0]?.toFixed(6) || '0.000000'}
      </Typography>
    </Paper>
  );
};

export default ModernLocationPreference;

