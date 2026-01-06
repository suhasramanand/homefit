/**
 * Listings Tab Component
 */

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchBox from '../common/SearchBox';

const ListingsTab = ({
  listings,
  searchText,
  onSearchChange,
  primaryColor,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const filteredListings = listings.filter(listing => 
    listing.neighborhood?.toLowerCase().includes(searchText.toLowerCase()) ||
    listing.brokerEmail?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Property Listings
          </Typography>
          
          <SearchBox
            placeholder="Search listings..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Box>

        {filteredListings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {listings.length === 0
                ? "No listings found"
                : "No listings match your search criteria"}
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Property Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Neighborhood</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Bedrooms</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Broker</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow 
                    key={listing._id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(35, 206, 163, 0.05)' : 'rgba(35, 206, 163, 0.02)',
                      }
                    }}
                  >
                    <TableCell>{listing.type || 'N/A'}</TableCell>
                    <TableCell>{listing.neighborhood || 'N/A'}</TableCell>
                    <TableCell>{listing.bedrooms || 'N/A'}</TableCell>
                    <TableCell>
                      ${typeof listing.price === 'number' 
                        ? listing.price.toLocaleString() 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{listing.brokerEmail}</TableCell>
                    <TableCell>
                      <Chip
                        label={listing.isActive ? "Active" : "Inactive"}
                        size="small"
                        sx={{
                          backgroundColor: listing.isActive
                            ? (isDarkMode ? 'rgba(46, 204, 113, 0.2)' : 'rgba(46, 204, 113, 0.1)')
                            : (isDarkMode ? 'rgba(231, 76, 60, 0.2)' : 'rgba(231, 76, 60, 0.1)'),
                          color: listing.isActive
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => {}} // Future feature: view listing details
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: primaryColor,
                            },
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ListingsTab;

