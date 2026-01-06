/**
 * Active Filters Bar Component
 * Displays active filter chips that can be removed
 */

import React from 'react';
import { Box, Chip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const ActiveFiltersBar = ({
  activeFilters,
  onFilterRemove,
  primaryColor,
  isDarkMode,
}) => {
  const handleRemoveBedrooms = () => {
    onFilterRemove({ ...activeFilters, bedrooms: [] });
  };

  const handleRemoveBathrooms = () => {
    onFilterRemove({ ...activeFilters, bathrooms: [] });
  };

  const handleRemoveNeighborhoods = () => {
    onFilterRemove({ ...activeFilters, neighborhoods: [] });
  };

  const handleRemoveAmenities = () => {
    onFilterRemove({ ...activeFilters, amenities: [] });
  };

  const handleRemovePriceRange = () => {
    onFilterRemove({
      ...activeFilters,
      priceRange: [1000, 3000],
    });
  };

  const chipStyle = {
    bgcolor: isDarkMode
      ? "rgba(0, 179, 134, 0.15)"
      : "rgba(0, 179, 134, 0.08)",
    color: primaryColor,
    "& .MuiChip-deleteIcon": {
      color: primaryColor,
    },
  };

  return (
    <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
      {activeFilters.bedrooms && activeFilters.bedrooms.length > 0 && (
        <Chip
          size="small"
          label={`Bedrooms: ${activeFilters.bedrooms.join(", ")}`}
          onDelete={handleRemoveBedrooms}
          deleteIcon={<ClearIcon fontSize="small" />}
          sx={chipStyle}
        />
      )}

      {activeFilters.bathrooms && activeFilters.bathrooms.length > 0 && (
        <Chip
          size="small"
          label={`Bathrooms: ${activeFilters.bathrooms.join(", ")}`}
          onDelete={handleRemoveBathrooms}
          deleteIcon={<ClearIcon fontSize="small" />}
          sx={chipStyle}
        />
      )}

      {activeFilters.neighborhoods &&
        activeFilters.neighborhoods.length > 0 && (
          <Chip
            size="small"
            label={`Areas: ${activeFilters.neighborhoods.join(", ")}`}
            onDelete={handleRemoveNeighborhoods}
            deleteIcon={<ClearIcon fontSize="small" />}
            sx={chipStyle}
          />
        )}

      {activeFilters.amenities && activeFilters.amenities.length > 0 && (
        <Chip
          size="small"
          label={`${activeFilters.amenities.length} amenities`}
          onDelete={handleRemoveAmenities}
          deleteIcon={<ClearIcon fontSize="small" />}
          sx={chipStyle}
        />
      )}

      {(activeFilters.priceRange[0] !== 1000 ||
        activeFilters.priceRange[1] !== 3000) && (
        <Chip
          size="small"
          label={`$${activeFilters.priceRange[0]} - $${activeFilters.priceRange[1]}`}
          onDelete={handleRemovePriceRange}
          deleteIcon={<ClearIcon fontSize="small" />}
          sx={chipStyle}
        />
      )}
    </Box>
  );
};

export default ActiveFiltersBar;

