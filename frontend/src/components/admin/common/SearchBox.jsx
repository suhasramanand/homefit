/**
 * Reusable Search Box Component
 */

import React from 'react';
import { Paper, TextField, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBox = ({ placeholder, value, onChange, width = 300 }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Paper
      component="form"
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: width,
        p: '2px 8px',
        border: '1px solid',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        boxShadow: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
      <TextField
        size="small"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        variant="standard"
        fullWidth
        InputProps={{
          disableUnderline: true,
        }}
      />
    </Paper>
  );
};

export default SearchBox;

