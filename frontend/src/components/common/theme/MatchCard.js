import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
  Button,
  CardMedia,
  MobileStepper,
  Stack,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import { formatImageUrl, handleImageError } from "../../../utils/imageUtils";
import { formatPriceSimple } from "../../../utils/formatUtils";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InfoIcon from "@mui/icons-material/Info";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import DiamondIcon from "@mui/icons-material/Diamond";
import WarningIcon from "@mui/icons-material/Warning";
import ViewApartmentModal from "../modal/ViewApartmentModal";

const MatchCard = ({
  apt,
  matchScore,
  currentStep,
  gallery,
  createdAt,
  onStepChange,
  matchColor,
  explanation,
  isSaved = false,
  onSaveToggle,
}) => {
  const theme = useTheme();
  const primaryColor = "#00b386";
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(isSaved);


  // Simple fallback for high scores when API fails
  const generateHighScoreFallback = () => {
    return [
      { type: "check", text: "Within your budget range" },
      { type: "check", text: `Has your required bedrooms (${apt.bedrooms})` },
      { type: "check", text: `In your preferred neighborhood (${apt.neighborhood})` },
      Array.isArray(apt.amenities) && apt.amenities.length > 0 ? 
        { type: "check", text: "Has desired amenities" } : null,
      apt.furnishedStatus ? 
        { type: "check", text: "Matches your furnishing preferences" } : null
    ].filter(Boolean); // Remove null items
  };

  // Simple fallback for low scores when API fails
  const generateLowScoreFallback = () => {
    const items = [];
    
    // Add explanation for why score is low
    items.push({ type: "info", text: `This apartment has a ${matchScore}% match with your preferences` });
    
    // Add common mismatches based on apartment data
    if (apt.bedrooms < 3) {
      items.push({ type: "cancel", text: `Only has ${apt.bedrooms} bedroom${apt.bedrooms !== 1 ? 's' : ''}` });
    }
    
    if (apt.price < 1500) {
      items.push({ 
        type: "cancel", 
        text: `Lower price point ($${apt.price.toLocaleString()}) may mean fewer amenities` 
      });
    } else if (apt.price > 4000) {
      items.push({ 
        type: "cancel", 
        text: `Higher price point ($${apt.price.toLocaleString()}) exceeds typical budget` 
      });
    }
    
    // Add recommendations
    items.push({ 
      type: "lightbulb", 
      text: "Consider your priorities - location, price, and amenities" 
    });
    
    items.push({ 
      type: "lightbulb", 
      text: "View the apartment to see if it meets your needs despite the low match score" 
    });
    
    return items;
  };

  // Process the explanation text from API or generate fallback
  const getProcessedExplanation = () => {
    // ONLY use fallback if explanation is empty or error message
    if (!explanation || explanation === "Could not generate explanation.") {
      return matchScore >= 80 ? generateHighScoreFallback() : generateLowScoreFallback();
    }
    
    // Otherwise, process the explanation from the API
    const lines = explanation.split("\n").filter(Boolean);
    return lines.map(line => {
      if (line.startsWith("✅")) {
        return { type: "check", text: line.substring(2).trim() };
      } else if (line.startsWith("❌")) {
        return { type: "cancel", text: line.substring(2).trim() };
      } else if (line.startsWith("💎")) {
        return { type: "diamond", text: line.substring(2).trim() };
      } else if (line.startsWith("🟡")) {
        return { type: "warning", text: line.substring(2).trim() };
      } else if (line.startsWith("💡")) {
        return { type: "lightbulb", text: line.substring(2).trim() };
      } else {
        return { type: "info", text: line };
      }
    });
  };

  // Update savedStatus when isSaved prop changes
  useEffect(() => {
    setSavedStatus(isSaved);
  }, [isSaved]);

  const handleSaveToggle = async () => {
    if (saving) return;
    
    if (!apt?._id) {
      console.error("Cannot save: apartment ID is missing", apt);
      return;
    }
    
    setSaving(true);
    const previousSavedState = savedStatus;
    
    try {
      // Calculate the new saved status (opposite of current)
      const newSavedStatus = !savedStatus;
      
      // Update local state first for immediate UI feedback
      setSavedStatus(newSavedStatus);
      
      // Call the parent component's onSaveToggle function
      // This is critical - pass the apartment ID and the NEW status
      if (onSaveToggle) {
        console.log("Calling onSaveToggle with:", { aptId: apt._id, newSavedStatus });
        await onSaveToggle(apt._id, newSavedStatus);
        // Parent component will update savedApartments state
        // We'll sync with it via the useEffect that watches isSaved prop
      } else {
        console.error("onSaveToggle is not provided to MatchCard");
        // Revert if no handler
        setSavedStatus(previousSavedState);
      }
    } catch (err) {
      console.error("Save toggle error:", err);
      console.error("Error details:", err.response?.data || err.message);
      
      // If there was an error, revert the UI
      setSavedStatus(previousSavedState);
      
      // Handle specific error cases
      if (err.response?.status === 404) {
        const errorMsg = err.response?.data?.error || "Apartment not found";
        if (errorMsg.includes("not found") || errorMsg.includes("not available")) {
          // Don't show alert here - let the parent component handle it
          // The error will be shown via snackbar from useMatchResults
        }
      }
    } finally {
      setSaving(false);
    }
  };

  // Get icon component based on type
  const getIconForType = (type) => {
    switch (type) {
      case "check":
        return <CheckCircleIcon sx={{ color: "#10B981", fontSize: 18, mr: 1 }} />;
      case "cancel":
        return <CancelIcon sx={{ color: theme.palette.mode === 'light' ? "#EF4444" : "#f87171", fontSize: 18, mr: 1 }} />;
      case "diamond":
        return <DiamondIcon sx={{ color: theme.palette.mode === 'light' ? "#3B82F6" : "#60a5fa", fontSize: 18, mr: 1 }} />;
      case "warning":
        return <WarningIcon sx={{ color: theme.palette.mode === 'light' ? "#F59E0B" : "#fbbf24", fontSize: 18, mr: 1 }} />;
      case "lightbulb":
        return <LightbulbIcon sx={{ color: theme.palette.mode === 'light' ? "#6366F1" : "#818cf8", fontSize: 18, mr: 1 }} />;
      case "info":
      default:
        return <InfoIcon sx={{ color: theme.palette.mode === 'light' ? "#6B7280" : "#9CA3AF", fontSize: 18, mr: 1 }} />;
    }
  };

  const processedExplanation = getProcessedExplanation();

  return (
    <>
      <Card
        sx={{
          width: "100%",
          height: "100%",
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
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Match Score Badge - Compact */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
            backgroundColor: theme.palette.mode === 'light' 
              ? "white" 
              : "#1e1e1e",
            borderRadius: "50%",
            width: 50,
            height: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: theme.palette.mode === 'light' 
              ? "0 2px 8px rgba(20, 20, 43, 0.1)" 
              : "0 2px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CircularProgress
            variant="determinate"
            value={matchScore}
            thickness={3.5}
            size={46}
            sx={{ color: matchColor, position: "absolute" }}
          />
          <Typography
            variant="subtitle2"
            fontWeight={700}
            color={theme.palette.mode === 'light' ? "#111927" : "#e0e0e0"}
            fontSize={14}
          >
            {matchScore}
            <Typography
              component="span"
              variant="caption"
              fontSize={8}
              fontWeight={600}
            >
              %
            </Typography>
          </Typography>
        </Box>

        {/* Save/Favorite Button - Compact */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 10,
          }}
        >
          <Tooltip title={savedStatus ? "Unsave" : "Save"}>
            <span>
              <IconButton
                onClick={handleSaveToggle}
                disabled={saving}
                size="small"
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                  width: 32,
                  height: 32,
                  "&:hover": {
                    backgroundColor: theme.palette.mode === 'light' ? "#f9fafb" : "#333",
                  },
                  "&:disabled": {
                    opacity: 0.6,
                  },
                  color: savedStatus ? "#FF4081" : (theme.palette.mode === 'light' ? "#9CA3AF" : "#9CA3AF"),
                }}
              >
                {savedStatus ? (
                  <FavoriteIcon sx={{ fontSize: 18 }} />
                ) : (
                  <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <Box
          sx={{ display: "flex", flexDirection: "column" }}
        >
          {/* Image Section - Compact */}
          <Box sx={{ width: "100%", position: "relative" }}>
            <CardMedia
              component="img"
              image={formatImageUrl(gallery[currentStep])}
              alt="Apartment Preview"
              sx={{
                height: 180,
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
                    onClick={() => onStepChange("next")}
                    disabled={currentStep === gallery.length - 1}
                    sx={{ color: primaryColor, minWidth: "auto", px: 1 }}
                  >
                    Next
                  </Button>
                }
                backButton={
                  <Button
                    size="small"
                    onClick={() => onStepChange("back")}
                    disabled={currentStep === 0}
                    sx={{ color: primaryColor, minWidth: "auto", px: 1 }}
                  >
                    Back
                  </Button>
                }
              />
            )}
          </Box>

          {/* Content Section - Compact */}
          <CardContent sx={{ p: 1.5, width: "100%", "&:last-child": { pb: 1.5 } }}>
            <Box>
              <Typography 
                variant="subtitle1" 
                fontWeight={600} 
                color={theme.palette.mode === 'light' ? "#111927" : "#e0e0e0"}
                sx={{ 
                  fontSize: "0.95rem",
                  lineHeight: 1.3,
                  mb: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {apt.bedrooms} BHK in {apt.neighborhood}
              </Typography>
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <LocationOnIcon sx={{ 
                  fontSize: 14, 
                  color: theme.palette.mode === 'light' ? "#6B7280" : "#b0b0b0" 
                }} />
                <Typography 
                  variant="caption" 
                  color={theme.palette.mode === 'light' ? "#6B7280" : "#b0b0b0"}
                  sx={{
                    fontSize: "0.75rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {apt.neighborhood}
                </Typography>
              </Stack>
              <Typography
                variant="h6"
                sx={{ 
                  color: theme.palette.mode === 'light' ? "#111927" : "#e0e0e0", 
                  fontWeight: 700, 
                  fontSize: "1.1rem",
                  mt: 0.5,
                  mb: 0.5
                }}
              >
                {formatPriceSimple(apt.price)}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1, mt: 1 }}
            >
              <Chip
                label={`${apt.bedrooms} B`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.7rem",
                  backgroundColor: theme.palette.mode === 'light' ? "#F3F4F6" : "#333",
                  color: theme.palette.mode === 'light' ? "#374151" : "#e0e0e0",
                }}
              />
              <Chip
                label={`${apt.bathrooms || 1} Ba`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.7rem",
                  backgroundColor: theme.palette.mode === 'light' ? "#F3F4F6" : "#333",
                  color: theme.palette.mode === 'light' ? "#374151" : "#e0e0e0",
                }}
              />
            </Box>
            {/* Compact explanation - show only first highlight */}
            {processedExplanation.length > 0 && (
              <Box
                sx={{
                  mt: 1,
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: theme.palette.mode === 'light' ? "#F9FAFB" : "#2a2a2a",
                  borderLeft: `2px solid ${matchColor}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  {getIconForType(processedExplanation[0].type)}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: "0.7rem",
                      color: theme.palette.mode === 'light' ? "#374151" : "#d0d0d0",
                      lineHeight: 1.4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {processedExplanation[0].text}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box display="flex" justifyContent="center" mt={1.5}>
              <Button
                variant="contained"
                disableElevation
                size="small"
                fullWidth
                sx={{
                  borderRadius: 1,
                  backgroundColor: primaryColor,
                  fontWeight: 600,
                  textTransform: "none",
                  py: 0.75,
                  fontSize: "0.85rem",
                  "&:hover": {
                    backgroundColor: "#009973",
                    boxShadow: "none",
                  },
                }}
                onClick={() => setOpen(true)}
              >
                View Details
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Card>

      {/* Modal integrated here */}
      <ViewApartmentModal
        open={open}
        onClose={() => setOpen(false)}
        apartment={{
          ...apt,
          matchScore,
          explanation
        }}
      />
    </>
  );
};

export default MatchCard;