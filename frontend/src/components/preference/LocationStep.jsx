// src/pages/preferences/components/LocationStep.jsx
import React from 'react';
import { Alert } from '@mui/material';
import ModernLocationPreference from '../../components/map/ModernLocationPreference';

const LocationStep = ({ formData, handleLocationChange, googleMapsApiKey, errors }) => {
  return (
    <>
      {(errors.locationAddress || errors.locationCoordinates) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.locationAddress || errors.locationCoordinates}
        </Alert>
      )}
      
      <ModernLocationPreference
        value={formData.locationPreference || { center: [0, 0], radius: 5, address: '' }}
        onChange={handleLocationChange}
        googleMapsApiKey={googleMapsApiKey}
      />
    </>
  );
};

export default LocationStep;