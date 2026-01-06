/**
 * Listing Context Menu Component
 * Context menu for listing actions (view, edit, activate/deactivate, delete)
 */

import React from 'react';
import {
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
  Divider,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ListingContextMenu = ({
  anchorEl,
  open,
  onClose,
  selectedListing,
  primaryColor,
  isDarkMode,
  onViewDetails,
  onEdit,
  onToggleActive,
  onDelete,
}) => {
  const theme = useTheme();

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          minWidth: 180,
          border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
        },
      }}
    >
      {selectedListing && (
        <>
          <MenuItem
            onClick={onViewDetails}
            sx={{
              py: 1.2,
              "&:hover": {
                backgroundColor: isDarkMode
                  ? "rgba(35, 206, 163, 0.1)"
                  : "rgba(35, 206, 163, 0.05)",
              },
            }}
          >
            <ListItemIcon>
              <VisibilityIcon fontSize="small" sx={{ color: primaryColor }} />
            </ListItemIcon>
            <Typography variant="body2">View Details</Typography>
          </MenuItem>
          
          <MenuItem
            onClick={onEdit}
            sx={{
              py: 1.2,
              "&:hover": {
                backgroundColor: isDarkMode
                  ? "rgba(35, 206, 163, 0.1)"
                  : "rgba(35, 206, 163, 0.05)",
              },
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: primaryColor }} />
            </ListItemIcon>
            <Typography variant="body2">Edit Listing</Typography>
          </MenuItem>

          {/* Only show toggle for listings that are not pending approval */}
          {selectedListing && selectedListing.approvalStatus !== "pending" && (
            <MenuItem
              onClick={onToggleActive}
              sx={{
                py: 1.2,
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "rgba(35, 206, 163, 0.1)"
                    : "rgba(35, 206, 163, 0.05)",
                },
              }}
            >
              <ListItemIcon>
                {selectedListing.isActive ? (
                  <VisibilityOffIcon
                    fontSize="small"
                    sx={{ color: theme.palette.warning.main }}
                  />
                ) : (
                  <VisibilityIcon fontSize="small" sx={{ color: primaryColor }} />
                )}
              </ListItemIcon>
              <Typography variant="body2">
                {selectedListing.isActive ? "Deactivate" : "Activate"}
              </Typography>
            </MenuItem>
          )}

          <Divider sx={{ my: 1 }} />
          <MenuItem
            onClick={onDelete}
            sx={{
              py: 1.2,
              "&:hover": {
                backgroundColor: isDarkMode
                  ? "rgba(231, 76, 60, 0.1)"
                  : "rgba(231, 76, 60, 0.05)",
              },
            }}
          >
            <ListItemIcon>
              <DeleteIcon
                fontSize="small"
                sx={{ color: theme.palette.error.main }}
              />
            </ListItemIcon>
            <Typography variant="body2" color="error">
              Delete Listing
            </Typography>
          </MenuItem>
        </>
      )}
    </Menu>
  );
};

export default ListingContextMenu;

