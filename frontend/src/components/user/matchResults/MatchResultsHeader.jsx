/**
 * Match Results Header Component
 * Displays title, refresh button, mobile filter toggle, and sort controls
 */

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Hidden,
  Badge,
  useTheme,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SyncIcon from '@mui/icons-material/Sync';

const MatchResultsHeader = ({
  filteredCount,
  totalCount,
  primaryColor,
  isDarkMode,
  loading,
  forceRefresh,
  onManualRefresh,
  onToggleMobileFilter,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  activeFilters,
}) => {
  const theme = useTheme();

  const filterBadgeCount =
    (activeFilters.bedrooms.length > 0 ? 1 : 0) +
    (activeFilters.bathrooms.length > 0 ? 1 : 0) +
    (activeFilters.neighborhoods.length > 0 ? 1 : 0) +
    (activeFilters.amenities.length > 0 ? 1 : 0) +
    (activeFilters.priceRange[0] !== 1000 ||
    activeFilters.priceRange[1] !== 3000
      ? 1
      : 0);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Typography
        variant="h5"
        fontWeight={600}
        sx={{
          position: "relative",
          display: "inline-block",
          color: theme.palette.text.primary,
          "&:after": {
            content: '""',
            position: "absolute",
            width: "60px",
            height: "3px",
            bottom: "-8px",
            left: 0,
            backgroundColor: primaryColor,
            borderRadius: "2px",
          },
        }}
      >
        Top Apartment Matches
        {filteredCount < totalCount && (
          <Typography
            component="span"
            variant="body2"
            sx={{ ml: 2, color: "text.secondary" }}
          >
            ({filteredCount} of {totalCount})
          </Typography>
        )}
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Refresh button */}
        <IconButton
          onClick={onManualRefresh}
          disabled={loading || forceRefresh}
          sx={{
            color: primaryColor,
            border: `1px solid ${
              isDarkMode
                ? "rgba(255, 255, 255, 0.23)"
                : "rgba(0, 0, 0, 0.23)"
            }`,
            borderRadius: 1,
            animation: forceRefresh ? "spin 1s linear infinite" : "none",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" }
            }
          }}
        >
          <SyncIcon />
        </IconButton>
      
        {/* Mobile filter toggle button */}
        <Hidden mdUp>
          <IconButton
            onClick={onToggleMobileFilter}
            sx={{
              color: primaryColor,
              border: `1px solid ${
                isDarkMode
                  ? "rgba(255, 255, 255, 0.23)"
                  : "rgba(0, 0, 0, 0.23)"
              }`,
              borderRadius: 1,
            }}
          >
            <Badge
              badgeContent={filterBadgeCount}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  bgcolor: primaryColor,
                },
              }}
            >
              <FilterListIcon />
            </Badge>
          </IconButton>
        </Hidden>

        <FormControl
          size="small"
          variant="outlined"
          sx={{ minWidth: 120 }}
        >
          <InputLabel id="sort-by-label">Sort By</InputLabel>
          <Select
            labelId="sort-by-label"
            value={sortBy}
            onChange={onSortChange}
            label="Sort By"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.23)"
                  : "rgba(0, 0, 0, 0.23)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: primaryColor,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: primaryColor,
              },
            }}
          >
            <MenuItem value="matchScore">Match Score</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="dateAdded">Date Added</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          size="small"
          variant="outlined"
          sx={{ minWidth: 120 }}
        >
          <InputLabel id="sort-order-label">Order</InputLabel>
          <Select
            labelId="sort-order-label"
            value={sortOrder}
            onChange={onSortOrderChange}
            label="Order"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.23)"
                  : "rgba(0, 0, 0, 0.23)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: primaryColor,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: primaryColor,
              },
            }}
          >
            <MenuItem value="desc">Highest First</MenuItem>
            <MenuItem value="asc">Lowest First</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default MatchResultsHeader;

