/**
 * User Match Results Page
 * Main component that aggregates all match results sub-components
 */

import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Hidden,
  Fab,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FilterListIcon from "@mui/icons-material/FilterList";
import LoadingMessage from "../../components/common/LoadingMessage";
import FilterComponent from "../../components/common/filter/FilterComponent";

// Import sub-components
import MatchResultsHeader from "../../components/user/matchResults/MatchResultsHeader";
import ActiveFiltersBar from "../../components/user/matchResults/ActiveFiltersBar";
import MatchResultsGrid from "../../components/user/matchResults/MatchResultsGrid";
import MatchResultsPagination from "../../components/user/matchResults/MatchResultsPagination";
import MobileFilterDrawer from "../../components/user/matchResults/MobileFilterDrawer";
import EmptyState from "../../components/user/matchResults/EmptyState";
import { useMatchResults } from "../../hooks/useMatchResults";

const MatchResults = () => {
  const { prefId } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const user = useSelector(state => state.user.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const primaryColor = "#00b386";
  const itemsPerPage = 6;
  const isDarkMode = theme.palette.mode === "dark";

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const {
    matches,
    savedApartments,
    totalCount,
    filteredCount,
    activeSteps,
    page,
    loading,
    error,
    sortBy,
    sortOrder,
    activeFilters,
    forceRefresh,
    snackbar,
    setError,
    setPage,
    handleManualRefresh,
    handleStepChange,
    handleSaveToggle,
    handleSortChange,
    handleSortOrderChange,
    handleApplyFilters,
    handleResetFilters,
    handleCloseSnackbar,
    getMatchColor,
  } = useMatchResults(prefId, itemsPerPage);
  
  // Handle 401 errors and unauthenticated users by redirecting to login
  useEffect(() => {
    if (error && (error.includes("session has expired") || error.includes("Please log in")) && !matches.length) {
      // Redirect immediately if user is not authenticated
      const timer = setTimeout(() => {
        navigate('/login', { 
          state: { 
            from: `/matches/${prefId}`,
            message: 'Please log in to view your matches'
          } 
        });
      }, 2000); // Give user 2 seconds to see the message
      
      return () => clearTimeout(timer);
    }
  }, [error, matches.length, navigate, prefId]);

  const handleApplyFiltersWithClose = (filters) => {
    handleApplyFilters(filters);
    if (isMobile) {
      setMobileFilterOpen(false);
    }
  };

  const toggleMobileFilter = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };

  if (loading && page === 1) return <LoadingMessage />;

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Desktop Filter Panel */}
        <Hidden mdDown>
          <Grid item md={3} lg={3}>
            <FilterComponent
              onApplyFilters={handleApplyFilters}
              initialFilters={activeFilters}
              onResetFilters={handleResetFilters}
              loading={loading}
            />
          </Grid>
        </Hidden>

        <Grid item xs={12} md={9} lg={9} sx={{ width: '100%', maxWidth: '100%' }}>
          <MatchResultsHeader
            filteredCount={filteredCount}
            totalCount={totalCount}
            primaryColor={primaryColor}
            isDarkMode={isDarkMode}
            loading={loading}
            forceRefresh={forceRefresh}
            onManualRefresh={handleManualRefresh}
            onToggleMobileFilter={toggleMobileFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onSortOrderChange={handleSortOrderChange}
            activeFilters={activeFilters}
          />

          <ActiveFiltersBar
            activeFilters={activeFilters}
            onFilterRemove={handleApplyFilters}
            primaryColor={primaryColor}
            isDarkMode={isDarkMode}
          />

          {loading && page > 1 && (
            <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
              <LoadingMessage message="Loading apartments..." />
            </Box>
          )}

          {!loading && matches.length === 0 ? (
            <EmptyState totalCount={totalCount} isDarkMode={isDarkMode} />
          ) : (
            !loading && (
              <>
                <MatchResultsGrid
                  matches={matches}
                  activeSteps={activeSteps}
                  savedApartments={savedApartments}
                  onStepChange={handleStepChange}
                          onSaveToggle={handleSaveToggle}
                  getMatchColor={getMatchColor}
                />

                <MatchResultsPagination
                  totalCount={totalCount}
                  filteredCount={filteredCount}
                  itemsPerPage={itemsPerPage}
                      page={page}
                  onPageChange={setPage}
                  primaryColor={primaryColor}
                  isDarkMode={isDarkMode}
                />
              </>
            )
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        onApplyFilters={handleApplyFiltersWithClose}
          initialFilters={activeFilters}
          onResetFilters={handleResetFilters}
          loading={loading}
        isDarkMode={isDarkMode}
        />

      {/* Mobile Filter FAB */}
      <Hidden mdUp>
        <Fab
          color="primary"
          aria-label="filter"
          onClick={toggleMobileFilter}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            backgroundColor: primaryColor,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <FilterListIcon />
        </Fab>
      </Hidden>
      
      {/* Refresh notification snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity || 'info'}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MatchResults;
