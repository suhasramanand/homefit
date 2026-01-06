/**
 * Empty State Component
 * Displays when no matches are found
 */

import React from 'react';
import { Box, Typography } from '@mui/material';

const EmptyState = ({ totalCount, isDarkMode }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        mt: 8,
        p: 4,
        borderRadius: 2,
        backgroundColor: isDarkMode
          ? "rgba(0, 179, 134, 0.08)"
          : "rgba(0, 179, 134, 0.05)",
        border: isDarkMode
          ? "1px solid rgba(0, 179, 134, 0.1)"
          : "1px solid rgba(0, 179, 134, 0.1)",
      }}
    >
      <Typography variant="body1" color="text.secondary">
        {totalCount > 0
          ? "No matches found with current filters. Try adjusting your filters."
          : "No matches found. Try updating your preferences."}
      </Typography>
    </Box>
  );
};

export default EmptyState;

