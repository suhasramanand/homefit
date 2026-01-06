/**
 * Approval Pending View Component
 * Displays when broker account is pending approval
 */

import React from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ApprovalPendingView = ({ primaryColor, isDarkMode }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, maxWidth: "800px", mx: "auto", textAlign: "center" }}>
      <Card
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
        }}
      >
        <ErrorOutlineIcon
          sx={{ fontSize: 64, color: theme.palette.warning.main, mb: 2 }}
        />
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          mb={2}
          color="text.primary"
        >
          Approval Pending
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Your broker account is currently pending approval from an
          administrator. Once approved, you'll have full access to all broker
          features.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This typically takes 1-2 business days. You'll receive an email
          notification once your account is approved.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/profile"
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.2,
              bgcolor: primaryColor,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Check Profile Status
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default ApprovalPendingView;

