/**
 * Users Tab Component
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
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';
import SearchBox from '../common/SearchBox';

const UsersTab = ({
  users,
  searchText,
  onSearchChange,
  primaryColor,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchText.toLowerCase())
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
            Users
          </Typography>
          
          <SearchBox
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Box>

        {filteredUsers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {users.length === 0
                ? "No users found"
                : "No users match your search criteria"}
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Saved Listings</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow 
                    key={user._id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(35, 206, 163, 0.05)' : 'rgba(35, 206, 163, 0.02)',
                      }
                    }}
                  >
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Tooltip title={user.createdAt ? dayjs(user.createdAt).format('YYYY-MM-DD HH:mm') : 'Unknown'}>
                        <span>{user.createdAt ? dayjs(user.createdAt).fromNow() : 'Unknown'}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{user.savedApartments ? user.savedApartments.length : 0}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => {}} // Future feature: view user details
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

export default UsersTab;

