/**
 * Pending Brokers Tab Component
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
  Button,
  useTheme,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';
import SearchBox from '../common/SearchBox';

const PendingBrokersTab = ({
  brokers,
  searchText,
  onSearchChange,
  onViewDetails,
  onApprove,
  primaryColor,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const filteredBrokers = brokers.filter(broker => 
    broker.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
    broker.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    (broker.licenseNumber && broker.licenseNumber.toLowerCase().includes(searchText.toLowerCase()))
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
            Broker Approval Requests
          </Typography>
          
          <SearchBox
            placeholder="Search brokers..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Box>

        {filteredBrokers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {brokers.length === 0
                ? "No pending broker approval requests"
                : "No brokers match your search criteria"}
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>License #</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Submitted</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBrokers.map((broker) => (
                  <TableRow 
                    key={broker._id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(35, 206, 163, 0.05)' : 'rgba(35, 206, 163, 0.02)',
                      }
                    }}
                  >
                    <TableCell>{broker.fullName}</TableCell>
                    <TableCell>{broker.email}</TableCell>
                    <TableCell>{broker.licenseNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <Tooltip title={dayjs(broker.createdAt).format('YYYY-MM-DD HH:mm')}>
                        <span>{dayjs(broker.createdAt).fromNow()}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Pending"
                        size="small"
                        sx={{
                          backgroundColor: isDarkMode ? 'rgba(249, 199, 79, 0.2)' : 'rgba(249, 199, 79, 0.1)',
                          color: theme.palette.warning.main,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => onViewDetails(broker)}
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
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => onApprove(broker._id)}
                          sx={{
                            borderRadius: 1,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            px: 2,
                          }}
                        >
                          Approve
                        </Button>
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

export default PendingBrokersTab;

