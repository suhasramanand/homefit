/**
 * Filter Dialog Component
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  useTheme,
} from '@mui/material';

const FilterDialog = ({
  open,
  onClose,
  onApply,
  onReset,
  filters,
  onChange,
  uniqueNeighborhoods,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          Filter Listings
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel htmlFor="price-min">Min Price</InputLabel>
              <OutlinedInput
                id="price-min"
                name="priceMin"
                value={filters.priceMin}
                onChange={onChange}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Min Price"
                type="number"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel htmlFor="price-max">Max Price</InputLabel>
              <OutlinedInput
                id="price-max"
                name="priceMax"
                value={filters.priceMax}
                onChange={onChange}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Max Price"
                type="number"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="bedrooms-label">Bedrooms</InputLabel>
              <Select
                labelId="bedrooms-label"
                id="bedrooms"
                name="bedrooms"
                value={filters.bedrooms}
                label="Bedrooms"
                onChange={onChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Studio">Studio</MenuItem>
                <MenuItem value="1">1 Bedroom</MenuItem>
                <MenuItem value="2">2 Bedrooms</MenuItem>
                <MenuItem value="3">3 Bedrooms</MenuItem>
                <MenuItem value="4">4+ Bedrooms</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="neighborhood-label">Neighborhood</InputLabel>
              <Select
                labelId="neighborhood-label"
                id="neighborhood"
                name="neighborhood"
                value={filters.neighborhood}
                label="Neighborhood"
                onChange={onChange}
              >
                <MenuItem value="">All</MenuItem>
                {uniqueNeighborhoods.map(hood => (
                  <MenuItem key={hood} value={hood}>{hood}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-label">Listing Status</InputLabel>
              <Select
                labelId="status-label"
                id="approvalStatus"
                name="approvalStatus"
                value={filters.approvalStatus}
                label="Listing Status"
                onChange={onChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onReset} color="inherit">
          Reset
        </Button>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onApply} variant="contained" color="primary">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;

