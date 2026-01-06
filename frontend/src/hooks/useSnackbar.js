/**
 * useSnackbar Hook
 * Reusable hook for managing snackbar state and actions
 */

import { useState, useCallback } from 'react';

export const useSnackbar = (initialState = { open: false, message: '', severity: 'success' }) => {
  const [snackbar, setSnackbar] = useState(initialState);

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const setSnackbarState = useCallback((state) => {
    setSnackbar((prev) => ({ ...prev, ...state }));
  }, []);

  return {
    snackbar,
    showSnackbar,
    closeSnackbar,
    setSnackbarState,
  };
};

export default useSnackbar;

