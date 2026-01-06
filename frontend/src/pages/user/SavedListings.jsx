import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Divider,
  useTheme,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  CardMedia,
  MobileStepper,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import LoadingMessage from "../../components/common/LoadingMessage";
import ViewApartmentModal from "../../components/common/modal/ViewApartmentModal";
import { formatImageUrl, handleImageError } from "../../utils/imageUtils";

const SavedListings = () => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const primaryColor = "#00b386";
  const isDarkMode = theme.palette.mode === "dark";

  const fetchSavedListings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/user/saved", {
        withCredentials: true,
      });

      const apartments = res.data || [];
      
      // Simplified version - just add the currentStep for gallery navigation
      const enriched = apartments.map(apt => ({
        ...apt,
        currentStep: 0  // Initialize currentStep for gallery
      }));

      setSaved(enriched);
    } catch (err) {
      console.error("Failed to fetch saved listings", err);
      setSaved([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedListings();
  }, []);

  const handleSaveToggle = async (aptId) => {
    try {
      // Remove apartment from the list
      setSaved(prev => prev.filter(apt => apt._id !== aptId));
      
      // Call API to update saved status
      await axios.post(
        "http://localhost:4000/api/user/save",
        { apartmentId: aptId },
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Failed to unsave apartment:", err);
      // If error, refresh the list to ensure UI is in sync with server
      fetchSavedListings();
    }
  };

  const handleStepChange = (aptId, dir) => {
    setSaved((prev) =>
      prev.map((item) => {
        if (item._id !== aptId) return item;
        const current = item.currentStep || 0;
        const imageUrls = item.imageUrls || [];
        const max = imageUrls.length;
        
        // Handle case where there are no images or only one image
        if (max <= 1) return item;
        
        const next =
          dir === "next"
            ? Math.min(current + 1, max - 1)
            : Math.max(current - 1, 0);
        return { ...item, currentStep: next };
      })
    );
  };


  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography 
          variant="h5" 
          fontWeight={600} 
          color={isDarkMode ? "#e0e0e0" : "#111927"}
        >
          Saved Listings
        </Typography>
      </Box>

      <Divider sx={{ mb: 3, borderColor: isDarkMode ? "#333" : "#E5E7EB" }} />

      {loading ? (
        <LoadingMessage />
      ) : saved.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            mt: 8,
            p: 4,
            borderRadius: 2,
            backgroundColor: isDarkMode 
              ? "rgba(0, 179, 134, 0.08)" 
              : "rgba(0, 179, 134, 0.05)",
            border: "1px solid rgba(0, 179, 134, 0.1)",
          }}
        >
          <FavoriteIcon sx={{ fontSize: 40, color: primaryColor, mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            You haven't saved any apartments yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {saved.map((apt) => {
            const gallery = apt.imageUrls || [apt.imageUrl];
            const currentStep = apt.currentStep || 0;
            const createdAt = dayjs(apt.createdAt).fromNow();

            return (
              <Grid item xs={12} key={apt._id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: theme.palette.mode === 'light' 
                      ? "0 2px 12px rgba(20, 20, 43, 0.08)" 
                      : "0 2px 12px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.palette.mode === 'light' 
                        ? "0 8px 24px rgba(20, 20, 43, 0.12)" 
                        : "0 8px 24px rgba(0, 0, 0, 0.3)",
                    },
                    overflow: "hidden",
                    border: theme.palette.mode === 'light' 
                      ? "1px solid #F2F4F7" 
                      : "1px solid #333",
                    position: "relative",
                  }}
                >
                  {/* Unsave Button */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      zIndex: 10,
                    }}
                  >
                    <IconButton
                      onClick={() => handleSaveToggle(apt._id)}
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                          backgroundColor: theme.palette.mode === 'light' ? "#f9fafb" : "#333",
                        },
                        color: "#FF4081",
                      }}
                    >
                      <FavoriteIcon sx={{ fontSize: 22 }} />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
                  >
                    {/* Image Section */}
                    <Box sx={{ width: { xs: "100%", md: 240 }, position: "relative" }}>
                      <CardMedia
                        component="img"
                        image={formatImageUrl(gallery[currentStep])}
                        alt="Apartment Preview"
                        sx={{
                          height: { xs: 200, md: "100%" },
                          objectFit: "cover",
                        }}
                        onError={handleImageError}
                      />
                      {gallery.length > 1 && (
                        <MobileStepper
                          variant="dots"
                          steps={gallery.length}
                          position="static"
                          activeStep={currentStep}
                          sx={{
                            justifyContent: "center",
                            backgroundColor: theme.palette.mode === 'light' 
                              ? "rgba(255, 255, 255, 0.8)" 
                              : "rgba(0, 0, 0, 0.6)",
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            "& .MuiMobileStepper-dot": {
                              backgroundColor: theme.palette.mode === 'light' 
                                ? "rgba(0, 0, 0, 0.2)" 
                                : "rgba(255, 255, 255, 0.3)",
                              mx: 0.3,
                            },
                            "& .MuiMobileStepper-dotActive": {
                              backgroundColor: primaryColor,
                            },
                          }}
                          nextButton={
                            <Button
                              size="small"
                              onClick={() => handleStepChange(apt._id, "next")}
                              disabled={currentStep === gallery.length - 1}
                              sx={{ color: primaryColor, minWidth: "auto", px: 1 }}
                            >
                              Next
                            </Button>
                          }
                          backButton={
                            <Button
                              size="small"
                              onClick={() => handleStepChange(apt._id, "back")}
                              disabled={currentStep === 0}
                              sx={{ color: primaryColor, minWidth: "auto", px: 1 }}
                            >
                              Back
                            </Button>
                          }
                        />
                      )}
                    </Box>

                    {/* Content Section */}
                    <CardContent sx={{ p: 3, width: "100%" }}>
                      <Box mb={1.5}>
                        <Typography 
                          variant="h6" 
                          fontWeight={700} 
                          color={theme.palette.mode === 'light' ? "#111927" : "#e0e0e0"}
                        >
                          {apt.bedrooms} BHK in {apt.neighborhood}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mt: 0.5 }}
                        >
                          <LocationOnIcon sx={{ 
                            fontSize: 16, 
                            color: theme.palette.mode === 'light' ? "#6B7280" : "#b0b0b0" 
                          }} />
                          <Typography 
                            variant="body2" 
                            color={theme.palette.mode === 'light' ? "#6B7280" : "#b0b0b0"}
                          >
                            {apt.neighborhood}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="h6"
                          sx={{ 
                            color: theme.palette.mode === 'light' ? "#111927" : "#e0e0e0", 
                            fontWeight: 700, 
                            mt: 1 
                          }}
                        >
                          ${apt.price.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={theme.palette.mode === 'light' ? "#6B7280" : "#b0b0b0"}
                          sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          Listed {createdAt}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2, mt: 2 }}
                      >
                        <Chip
                          label={`${apt.bedrooms} Bedroom${apt.bedrooms > 1 ? "s" : ""}`}
                          sx={{
                            backgroundColor: theme.palette.mode === 'light' ? undefined : "#333",
                            color: theme.palette.mode === 'light' ? undefined : "#e0e0e0",
                          }}
                        />
                        <Chip
                          label={`${apt.bathrooms || 1} Bathroom${
                            apt.bathrooms > 1 ? "s" : ""
                          }`}
                          sx={{
                            backgroundColor: theme.palette.mode === 'light' ? undefined : "#333",
                            color: theme.palette.mode === 'light' ? undefined : "#e0e0e0",
                          }}
                        />
                        <Chip 
                          label={apt.furnishedStatus || "Semi-Furnished"} 
                          sx={{
                            backgroundColor: theme.palette.mode === 'light' ? undefined : "#333",
                            color: theme.palette.mode === 'light' ? undefined : "#e0e0e0",
                          }}
                        />
                        {apt.amenities && apt.amenities.length > 0 && (
                          <Chip
                            label={`${apt.amenities.length} Amenities`}
                            sx={{
                              backgroundColor: theme.palette.mode === 'light' ? undefined : "#333",
                              color: theme.palette.mode === 'light' ? undefined : "#e0e0e0",
                            }}
                          />
                        )}
                      </Box>

                      <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button
                          variant="contained"
                          disableElevation
                          sx={{
                            borderRadius: 1.5,
                            backgroundColor: primaryColor,
                            fontWeight: 600,
                            textTransform: "none",
                            px: 3,
                            "&:hover": {
                              backgroundColor: "#009973",
                              boxShadow: "none",
                            },
                          }}
                          onClick={() => {
                            setSelectedApartment(apt);
                            setModalOpen(true);
                          }}
                        >
                          View Apartment
                        </Button>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      
      {/* Use consistent ViewApartmentModal */}
      {selectedApartment && (
        <ViewApartmentModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedApartment(null);
          }}
          apartment={selectedApartment}
        />
      )}
    </Box>
  );
};

export default SavedListings;