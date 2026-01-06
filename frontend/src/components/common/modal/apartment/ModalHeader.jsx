/**
 * Modal Header Component
 */

import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

const ModalHeader = ({ onClose }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={{ xs: 2, md: 3 }}
      py={2}
      borderBottom={1}
      borderColor="divider"
      sx={{
        bgcolor: theme.palette.background.paper,
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(10px)",
      }}
    >
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={onClose}
        sx={{ 
          color: theme.palette.text.primary,
          textTransform: "none",
          fontWeight: 500,
          "&:hover": {
            bgcolor: theme.palette.mode === "light" ? "#f5f5f5" : "#2a2a2a",
          },
        }}
      >
        Back to Results
      </Button>
      <IconButton 
        onClick={onClose} 
        sx={{
          color: theme.palette.text.secondary,
          "&:hover": {
            bgcolor: theme.palette.mode === "light" ? "#f5f5f5" : "#2a2a2a",
            color: theme.palette.text.primary,
          },
          transition: "all 0.2s ease",
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default ModalHeader;

