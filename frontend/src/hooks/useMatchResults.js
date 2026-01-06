/**
 * Custom hook for match results logic
 * Handles authentication, fetching, and state management
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  cacheMatchResults, 
  getCachedMatchResults, 
  shouldFetchNewMatches,
  clearAllMatchCaches
} from '../utils/matchCache';

export const useMatchResults = (prefId, itemsPerPage) => {
  const location = useLocation();
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const user = useSelector(state => state.user.user);
  const [matches, setMatches] = useState([]);
  const [savedApartments, setSavedApartments] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [activeSteps, setActiveSteps] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("matchScore");
  const [sortOrder, setSortOrder] = useState("desc");
  const [activeFilters, setActiveFilters] = useState({
    priceRange: [1000, 3000],
    bedrooms: [],
    bathrooms: [],
    neighborhoods: [],
    amenities: [],
  });
  const [forceRefresh, setForceRefresh] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  
  const hasRefreshedAfterLogin = useRef(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');
  const lastPrefUpdateTime = useRef(null);

  // Function to handle login detection
  const handleAuthChange = useCallback(() => {
    const currentToken = localStorage.getItem('authToken');
    
    if (currentToken && currentToken !== authToken) {
      setAuthToken(currentToken);
      
      if (!hasRefreshedAfterLogin.current) {
        setForceRefresh(true);
        setSnackbar({
          open: true,
          message: "Updating matches after login..."
        });
        hasRefreshedAfterLogin.current = true;
      }
    }
  }, [authToken]);

  // Listen for login events
  useEffect(() => {
    const handleLoginEvent = () => {
      hasRefreshedAfterLogin.current = false;
      handleAuthChange();
    };
    
    window.addEventListener('user-logged-in', handleLoginEvent);
    window.addEventListener('storage', (event) => {
      if (event.key === 'authToken') {
        hasRefreshedAfterLogin.current = false;
        handleAuthChange();
      }
    });
    
    return () => {
      window.removeEventListener('user-logged-in', handleLoginEvent);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [handleAuthChange]);

  // Initial auth check on component mount
  useEffect(() => {
    if (authToken) {
      hasRefreshedAfterLogin.current = true;
    }
  }, [authToken]);

  // Check for forceRefresh in URL and preference updates
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const shouldForceRefresh = searchParams.get("forceRefresh") === "true";

    // Check if preferences were updated
    if (prefId) {
      const prefUpdateKey = `preference_updated_at_${prefId}`;
      const prefUpdateTime = localStorage.getItem(prefUpdateKey);
      
      if (prefUpdateTime) {
        const updateTime = parseInt(prefUpdateTime);
        if (!lastPrefUpdateTime.current || updateTime > lastPrefUpdateTime.current) {
          // Preferences were updated, clear cache and refresh
          lastPrefUpdateTime.current = updateTime;
          setForceRefresh(true);
          setSnackbar({
            open: true,
            message: "Refreshing matches with updated preferences..."
          });
        }
      }
    }

    if (shouldForceRefresh) {
      setForceRefresh(true);
      setSnackbar({
        open: true,
        message: "Refreshing matches from server..."
      });
      
      searchParams.delete("forceRefresh");
      const newUrl = `${location.pathname}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;
      window.history.replaceState({}, "", newUrl);
    }
  }, [location, prefId]);

  // Fetch saved apartments
  useEffect(() => {
    const fetchSavedApartments = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/user/saved", {
          withCredentials: true,
        });

        const savedMap = {};
        (res.data || []).forEach((apt) => {
          savedMap[apt._id] = true;
        });

        setSavedApartments(savedMap);
      } catch (err) {
        console.error("Failed to fetch saved apartments", err);
      }
    };

    fetchSavedApartments();
    
    if (forceRefresh) {
      fetchSavedApartments();
    }
  }, [forceRefresh]);

  // Convert filters to API parameters
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", itemsPerPage);
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);

    if (
      activeFilters.priceRange &&
      (activeFilters.priceRange[0] !== 1000 ||
        activeFilters.priceRange[1] !== 3000)
    ) {
      params.append("minPrice", activeFilters.priceRange[0]);
      params.append("maxPrice", activeFilters.priceRange[1]);
    }

    if (activeFilters.bedrooms && activeFilters.bedrooms.length > 0) {
      params.append("bedrooms", activeFilters.bedrooms.join(","));
    }

    if (activeFilters.bathrooms && activeFilters.bathrooms.length > 0) {
      params.append("bathrooms", activeFilters.bathrooms.join(","));
    }

    if (activeFilters.neighborhoods && activeFilters.neighborhoods.length > 0) {
      params.append("neighborhoods", activeFilters.neighborhoods.join(","));
    }

    if (activeFilters.amenities && activeFilters.amenities.length > 0) {
      params.append("amenities", activeFilters.amenities.join(","));
    }

    if (forceRefresh) {
      params.append("_t", Date.now());
      params.append("forceRefresh", "true");
    }

    return params;
  }, [page, sortBy, sortOrder, activeFilters, forceRefresh, itemsPerPage]);

  // Fetch matches with filters (with caching)
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted
    
    const fetchMatches = async () => {
      if (!prefId) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        // Build filter object for cache key (include itemsPerPage to differentiate cache)
        const filterKey = {
          page,
          sortBy,
          sortOrder,
          itemsPerPage, // Include itemsPerPage in cache key
          ...activeFilters,
        };

        // Check authentication before showing cached data
        if (!isAuthenticated || !user) {
          if (isMounted) {
            // Clear cache if user is not authenticated
            clearAllMatchCaches();
            setMatches([]);
            setTotalCount(0);
            setFilteredCount(0);
            setError("Please log in to view your matches.");
            setLoading(false);
          }
          return;
        }

        // Check cache first (unless force refresh)
        if (!forceRefresh) {
          const cached = getCachedMatchResults(prefId, filterKey);
          if (cached && isMounted) {
            // Use cached data only if authenticated
            setMatches(cached.results || []);
            setTotalCount(cached.totalCount || 0);
            setFilteredCount(cached.filteredCount || cached.totalCount || 0);
            setLoading(false);
            return;
          }
        }

        // Note: Session check removed - let the API handle authentication
        // This avoids double requests and lets the backend handle session validation

        // Fetch from API with timeout
        const queryParams = buildQueryParams();
        const queryString = queryParams.toString();

        const res = await axios.get(
          `http://localhost:4000/api/user/matches/${prefId}?${queryString}`,
          { 
            withCredentials: true,
            timeout: 30000, // 30 second timeout
            headers: { 
              'Cache-Control': forceRefresh ? 'no-cache' : 'default',
              'Pragma': forceRefresh ? 'no-cache' : 'default'
            }
          }
        );

        const matchData = {
          results: res.data.results || [],
          totalCount: res.data.totalCount || 0,
          filteredCount: res.data.filteredCount || res.data.totalCount || 0,
        };

        if (isMounted) {
          setMatches(matchData.results);
          setTotalCount(matchData.totalCount);
          setFilteredCount(matchData.filteredCount);
          
          // Cache the results
          cacheMatchResults(prefId, matchData, filterKey);
          
          // Clear any previous errors
          setError(null);
          
          if (forceRefresh) {
            setForceRefresh(false);
            setLastFetchTime(Date.now());
          }
        }
      } catch (err) {
        console.error("Error fetching matches:", err);
        
        // Handle 401 Unauthorized specifically
        if (err.response?.status === 401) {
          // Clear cache on 401 - user is not authenticated
          clearAllMatchCaches();
          
          if (isMounted) {
            setError("Your session has expired. Please log in again to view matches.");
            setMatches([]);
            setTotalCount(0);
            setFilteredCount(0);
          }
        } else {
          // Other errors - try cached data as fallback
          const filterKey = {
            page,
            sortBy,
            sortOrder,
            itemsPerPage, // Include itemsPerPage in cache key
            ...activeFilters,
          };
          const cached = getCachedMatchResults(prefId, filterKey);
          
          if (isMounted) {
            if (cached) {
              setMatches(cached.results || []);
              setTotalCount(cached.totalCount || 0);
              setFilteredCount(cached.filteredCount || cached.totalCount || 0);
            } else {
              setMatches([]);
              setTotalCount(0);
              setFilteredCount(0);
              setError("Failed to fetch apartment matches. Please try again later.");
            }
          }
        }
        
        if (isMounted && forceRefresh) {
          setForceRefresh(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMatches();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [prefId, page, sortBy, sortOrder, activeFilters, forceRefresh, buildQueryParams]);

  // Manual refresh button handler
  const handleManualRefresh = () => {
    const timeSinceLastFetch = Date.now() - lastFetchTime;
    if (timeSinceLastFetch < 30000) {
      setSnackbar({
        open: true,
        message: `Please wait before refreshing again (${Math.ceil((30000 - timeSinceLastFetch) / 1000)}s)`
      });
      return;
    }
    
    setForceRefresh(true);
    setSnackbar({
      open: true,
      message: "Refreshing matches from server..."
    });
  };

  const handleStepChange = (aptId, direction) => {
    setActiveSteps((prev) => {
      const current = prev[aptId] || 0;
      const matchedApt = matches.find((m) => m.apartment._id === aptId);
      const imageUrls = matchedApt?.apartment?.imageUrls || [];
      const max = imageUrls.length;

      if (max <= 1) return prev;

      const next =
        direction === "next"
          ? Math.min(current + 1, max - 1)
          : Math.max(current - 1, 0);
      return { ...prev, [aptId]: next };
    });
  };

  const handleSaveToggle = async (aptId, newSavedStatus) => {
    if (!aptId) {
      console.error("Cannot save: apartment ID is missing");
      setSnackbar({
        open: true,
        message: "Invalid apartment ID",
        severity: "error",
      });
      return;
    }
    
    const previousSavedState = savedApartments[aptId] || false;
    
    // Optimistically update UI for immediate feedback
    setSavedApartments((prev) => ({
      ...prev,
      [aptId]: newSavedStatus,
    }));
  
    try {
      // Call API to toggle save status
      const response = await axios.post(
        "http://localhost:4000/api/user/save",
        { apartmentId: aptId },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log("Save toggle API response:", response.data);
      
      // Verify by fetching latest saved apartments to sync with server
      // This ensures UI matches actual server state
      const res = await axios.get("http://localhost:4000/api/user/saved", {
        withCredentials: true,
      });
      
      const savedMap = {};
      (res.data || []).forEach((apt) => {
        if (apt._id) {
          savedMap[apt._id] = true;
          savedMap[apt._id.toString()] = true; // Support both formats
        }
      });
      
      // Update state with actual server state
      setSavedApartments(savedMap);
      
      // Show success message
      setSnackbar({
        open: true,
        message: response.data?.message || (newSavedStatus ? "Apartment saved!" : "Apartment unsaved!"),
        severity: "success",
      });
         } catch (err) {
           console.error("Failed to toggle save status:", err);
           console.error("Error response:", err.response?.data);
           console.error("Apartment ID used:", aptId);
           
           // Revert to previous state on error
           setSavedApartments((prev) => ({
             ...prev,
             [aptId]: previousSavedState,
           }));
           
           // Handle specific error cases
           let errorMessage = "Failed to update saved status. Please try again.";
           if (err.response?.status === 404) {
             if (err.response?.data?.error?.includes("not found")) {
               errorMessage = "This apartment is no longer available.";
               // Remove from saved list if it was saved
               if (previousSavedState) {
                 setSavedApartments((prev) => {
                   const updated = { ...prev };
                   delete updated[aptId];
                   return updated;
                 });
               }
             } else {
               errorMessage = "Apartment not found. It may have been removed.";
             }
           } else if (err.response?.status === 400) {
             errorMessage = err.response?.data?.error || "Invalid request. Please refresh and try again.";
           } else if (err.response?.data?.error) {
             errorMessage = err.response.data.error;
           }
           
           // Show error message
           setSnackbar({
             open: true,
             message: errorMessage,
             severity: "error",
           });
         }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    setPage(1);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setActiveFilters({
      priceRange: [1000, 3000],
      bedrooms: [],
      bathrooms: [],
      neighborhoods: [],
      amenities: [],
    });
    setPage(1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Import getMatchColor from utils
  const getMatchColor = (score) => {
    // Using inline function for now, can be imported from utils if needed
    if (score >= 80) return "#36B37E";
    if (score >= 50) return "#FFAB00";
    return "#FF5630";
  };

  return {
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
  };
};

