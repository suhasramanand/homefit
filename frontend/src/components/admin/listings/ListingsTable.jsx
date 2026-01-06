/**
 * Listings Table Component
 */

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
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
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import dayjs from 'dayjs';
import SearchBox from '../common/SearchBox';

const ListingsTable = ({
  listings,
  filteredListings,
  searchText,
  onSearchChange,
  onViewDetails,
  onToggleStatus,
  onDelete,
  onOpenFilter,
  primaryColor,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

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
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={onOpenFilter}
              sx={{
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                },
                height: 40,
              }}
            >
              Filter
            </Button>
            
            <SearchBox
              placeholder="Search listings..."
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </Box>
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
                  <TableCell sx={{ fontWeight: 600 }}>Date Added</TableCell>
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
                      <Tooltip title={dayjs(listing.createdAt).format('YYYY-MM-DD HH:mm')}>
                        <span>{dayjs(listing.createdAt).fromNow()}</span>
                      </Tooltip>
                    </TableCell>
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
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => onViewDetails(listing)}
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
                        <Tooltip title={listing.isActive ? "Deactivate" : "Activate"}>
                          <IconButton
                            size="small"
                            onClick={() => onToggleStatus(listing._id, listing.isActive)}
                            sx={{
                              color: listing.isActive ? theme.palette.error.main : theme.palette.success.main,
                            }}
                          >
                            {listing.isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(listing)}
                            sx={{
                              color: theme.palette.error.main,
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
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

export default ListingsTable;

