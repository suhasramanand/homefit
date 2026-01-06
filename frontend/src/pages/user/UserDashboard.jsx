import React, { useState, useEffect, Fragment } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  useTheme,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Divider,
  CardMedia,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EventIcon from "@mui/icons-material/Event";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import { formatPriceSimple } from "../../utils/formatUtils";
import { formatImageUrl, handleImageError } from "../../utils/imageUtils";

const UserDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const isDarkMode = theme.palette.mode === "dark";
  const primaryColor = theme.palette.primary.main;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    savedCount: 0,
    toursCount: 0,
    recommendationsCount: 0,
  });
  const [savedApartments, setSavedApartments] = useState([]);
  const [upcomingTours, setUpcomingTours] = useState([]);
  const [hasPreferences, setHasPreferences] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch saved apartments
        const savedRes = await axios.get("http://localhost:4000/api/user/saved", {
          withCredentials: true,
        });
        const saved = savedRes.data || [];
        setSavedApartments(saved.slice(0, 3)); // Show only 3 recent
        setStats((prev) => ({ ...prev, savedCount: saved.length }));

        // Fetch user tours
        const toursRes = await axios.get("http://localhost:4000/api/user/tours", {
          withCredentials: true,
        });
        const tours = toursRes.data?.tours || [];
        // Filter upcoming tours (status: pending or confirmed, date in future)
        const upcoming = tours
          .filter((tour) => {
            const tourDate = new Date(tour.tourDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return (
              (tour.status === "pending" || tour.status === "confirmed") &&
              tourDate >= today
            );
          })
          .sort((a, b) => new Date(a.tourDate) - new Date(b.tourDate))
          .slice(0, 3);
        setUpcomingTours(upcoming);
        setStats((prev) => ({ ...prev, toursCount: tours.length }));

        // Check if user has preferences
        try {
          const prefRes = await axios.get(
            "http://localhost:4000/api/user/preferences/latest",
            { withCredentials: true }
          );
          if (prefRes.data?.preference) {
            setHasPreferences(true);
            // If they have preferences, we could fetch match count
            // For now, just set a placeholder
            setStats((prev) => ({ ...prev, recommendationsCount: 0 }));
          }
        } catch (err) {
          if (err.response?.status !== 404) {
            console.error("Error checking preferences:", err);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const goToRecommendations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/user/preferences/latest",
        { withCredentials: true }
      );
      const prefId = res.data.preference?._id;
      if (prefId) {
        navigate(`/matches/${prefId}`);
      } else {
        navigate("/preferences");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        navigate("/preferences");
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress sx={{ color: primaryColor }} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
            Welcome back, {user?.fullName || user?.email?.split("@")[0] || "User"}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your apartment search.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Saved Listings Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                border: isDarkMode
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "none",
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${primaryColor}20`,
                      color: primaryColor,
                      mr: 2,
                    }}
                  >
                    <FavoriteIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Saved Listings
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {stats.savedCount}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  component={Link}
                  to="/user/saved"
                  variant="text"
                  size="small"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  View All Saved
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Tours Scheduled Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                border: isDarkMode
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "none",
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${theme.palette.info.main}20`,
                      color: theme.palette.info.main,
                      mr: 2,
                    }}
                  >
                    <EventIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Tours Scheduled
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {stats.toursCount}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  component={Link}
                  to="/user/tours"
                  variant="text"
                  size="small"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Manage Tours
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Recommendations Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                border: isDarkMode
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "none",
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${theme.palette.success.main}20`,
                      color: theme.palette.success.main,
                      mr: 2,
                    }}
                  >
                    <StarIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Recommendations
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {hasPreferences ? "Ready" : "—"}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  onClick={goToRecommendations}
                  variant="text"
                  size="small"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  {hasPreferences ? "View Matches" : "Get Matched"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Column - Recent Saved & Quick Actions */}
          <Grid item xs={12} md={7}>
            {/* Recent Saved Listings */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                border: isDarkMode
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "none",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Recently Saved
                </Typography>
                <Button
                  component={Link}
                  to="/user/saved"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                >
                  View All
                </Button>
              </Box>
              {savedApartments.length > 0 ? (
                <List>
                  {savedApartments.map((apt, index) => (
                    <Fragment key={apt._id}>
                      <ListItem
                        sx={{
                          px: 0,
                          py: 2,
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: isDarkMode
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(0, 0, 0, 0.02)",
                            borderRadius: 1,
                          },
                        }}
                        onClick={() => {
                          // Navigate to apartment details if you have a route
                          // For now, just show the saved listings page
                          navigate("/user/saved");
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 2,
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={formatImageUrl(
                                apt.imageUrls?.[0] || apt.imageUrl
                              )}
                              alt={apt.neighborhood}
                              onError={handleImageError}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight={600}>
                              {apt.bedrooms} BHK in {apt.neighborhood}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mt: 0.5,
                                }}
                              >
                                <LocationOnIcon
                                  fontSize="small"
                                  sx={{ color: "text.secondary" }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  {apt.address || apt.neighborhood}
                                </Typography>
                              </Box>
                              <Typography
                                variant="h6"
                                color="primary"
                                sx={{ mt: 0.5, fontWeight: 600 }}
                              >
                                {formatPriceSimple(apt.price)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < savedApartments.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <FavoriteIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    No saved listings yet
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/preferences"
                    startIcon={<SearchIcon />}
                  >
                    Start Searching
                  </Button>
                </Box>
              )}
            </Paper>

            {/* Quick Actions */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                border: isDarkMode
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "none",
              }}
            >
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    component={Link}
                    to="/preferences"
                    startIcon={<SearchIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      justifyContent: "flex-start",
                    }}
                  >
                    Get Matched
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={goToRecommendations}
                    startIcon={<StarIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      justifyContent: "flex-start",
                    }}
                  >
                    View Recommendations
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    size="large"
                    component={Link}
                    to="/map"
                    startIcon={<LocationOnIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      justifyContent: "flex-start",
                    }}
                  >
                    Map View
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    size="large"
                    component={Link}
                    to="/user/tours"
                    startIcon={<EventIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      justifyContent: "flex-start",
                    }}
                  >
                    My Tours
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right Column - Upcoming Tours */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                border: isDarkMode
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "none",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Upcoming Tours
                </Typography>
                <Button
                  component={Link}
                  to="/user/tours"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                >
                  View All
                </Button>
              </Box>
              {upcomingTours.length > 0 ? (
                <List>
                  {upcomingTours.map((tour, index) => (
                    <React.Fragment key={tour._id}>
                      <ListItem sx={{ px: 0, py: 2, flexDirection: "column", alignItems: "flex-start" }}>
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {tour.apartmentDetails?.bedrooms} BHK in {tour.apartmentDetails?.neighborhood}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(tour.tourDate).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}{" "}
                              at {tour.tourTime}
                            </Typography>
                          </Box>
                          <Chip
                            label={tour.status}
                            size="small"
                            color={
                              tour.status === "confirmed"
                                ? "success"
                                : tour.status === "pending"
                                ? "warning"
                                : "default"
                            }
                          />
                        </Box>
                      </ListItem>
                      {index < upcomingTours.length - 1 && <Divider sx={{ my: 1 }} />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <EventIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    No upcoming tours
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to="/preferences"
                    startIcon={<SearchIcon />}
                  >
                    Find Apartments
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserDashboard;

