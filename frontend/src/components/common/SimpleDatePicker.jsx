/**
 * Simple Date Picker Component
 * Reusable date picker that doesn't require MUI date pickers
 */

import React from 'react';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';

const SimpleDatePicker = ({ 
  value, 
  onChange, 
  disablePast = false, 
  error = false,
  helperText = '',
  label = 'Date',
  required = false,
  fullWidth = true,
}) => {
  // Format date to YYYY-MM-DD for the input
  const formatDate = (date) => {
    if (!date) return '';
    return date.format ? date.format('YYYY-MM-DD') : dayjs(date).format('YYYY-MM-DD');
  };

  // Handler for date changes
  const handleDateChange = (e) => {
    const newDate = e.target.value ? dayjs(e.target.value) : null;
    onChange(newDate);
  };

  // Calculate min date if disablePast is true
  const minDate = disablePast ? formatDate(dayjs()) : undefined;

  return (
    <TextField
      label={label}
      type="date"
      value={formatDate(value)}
      onChange={handleDateChange}
      fullWidth={fullWidth}
      InputLabelProps={{ shrink: true }}
      inputProps={{ min: minDate }}
      error={error}
      helperText={helperText}
      required={required}
    />
  );
};

export default SimpleDatePicker;

