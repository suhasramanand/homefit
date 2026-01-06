/**
 * Match Results Pagination Component
 */

import React from 'react';
import { Box, Pagination } from '@mui/material';

const MatchResultsPagination = ({
  totalCount,
  filteredCount,
  itemsPerPage,
  page,
  onPageChange,
  primaryColor,
  isDarkMode,
}) => {
  if (totalCount <= itemsPerPage) return null;

  return (
    <Box mt={4} mb={4} display="flex" justifyContent="center">
      <Pagination
        count={Math.ceil(filteredCount / itemsPerPage)}
        page={page}
        onChange={(e, val) => onPageChange(val)}
        sx={{
          "& .MuiPaginationItem-root": {
            fontWeight: 500,
            color: isDarkMode ? "#e0e0e0" : "#4B5563",
          },
          "& .Mui-selected": {
            backgroundColor: `${primaryColor} !important`,
            color: "white !important",
            fontWeight: 600,
          },
          "& .MuiPaginationItem-page:hover": {
            backgroundColor: isDarkMode
              ? "rgba(0, 179, 134, 0.15)"
              : "rgba(0, 179, 134, 0.1)",
          },
          "& .MuiPaginationItem-ellipsis": {
            color: isDarkMode ? "#b0b0b0" : "#4B5563",
          },
          "& .MuiPaginationItem-previousNext": {
            color: primaryColor,
          },
        }}
      />
    </Box>
  );
};

export default MatchResultsPagination;

