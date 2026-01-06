/**
 * Listing Statistics Cards Component
 */

import React from 'react';
import { Grid, Card, Box, Typography, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';

const ListingStatsCards = ({ listings, primaryColor }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const activeListings = listings.filter(listing => listing.isActive).length;
  const inactiveListings = listings.filter(listing => !listing.isActive).length;
  const averagePrice = listings.length > 0
    ? Math.round(listings.reduce((sum, listing) => sum + (listing.price || 0), 0) / listings.length)
    : 0;

  const StatCard = ({ icon, value, label, backgroundColor, color }) => (
    <Card
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4" fontWeight="bold" color={color || "text.primary"}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor,
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </Card>
  );

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<HomeIcon sx={{ color: 'white' }} />}
          value={listings.length}
          label="Total Listings"
          backgroundColor={primaryColor}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<CheckCircleIcon sx={{ color: 'white' }} />}
          value={activeListings}
          label="Active Listings"
          backgroundColor={theme.palette.success.main}
          color="success.main"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<BlockIcon sx={{ color: 'white' }} />}
          value={inactiveListings}
          label="Inactive Listings"
          backgroundColor={theme.palette.error.main}
          color="error.main"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<Typography sx={{ color: 'white', fontWeight: 'bold' }}>$</Typography>}
          value={`$${averagePrice.toLocaleString()}`}
          label="Average Price"
          backgroundColor={theme.palette.info.main}
          color="info.main"
        />
      </Grid>
    </Grid>
  );
};

export default ListingStatsCards;

