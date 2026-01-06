/**
 * Apartment Image Gallery Component
 */

import React from 'react';
import { Box, CardMedia, IconButton, useTheme } from '@mui/material';
import { handleImageError } from '../../../../utils/imageUtils';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ImageGallery = ({
  gallery,
  activeImage,
  onImageChange,
  isSaved,
  onSaveToggle,
  onShare,
  matchScore,
  primaryColor,
  formatImageUrl,
}) => {
  const theme = useTheme();

  const handlePrevious = (e) => {
    e.stopPropagation();
    const prevIndex = activeImage > 0 ? activeImage - 1 : gallery.length - 1;
    onImageChange(prevIndex);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const nextIndex = activeImage < gallery.length - 1 ? activeImage + 1 : 0;
    onImageChange(nextIndex);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Main image */}
      <Box 
        sx={{ 
          position: "relative", 
          height: { xs: 300, sm: 400, md: 500 },
          flex: 1,
          minHeight: 300,
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.3s ease",
          }}
          image={formatImageUrl(gallery[activeImage])}
          alt="Apartment image"
          onError={handleImageError}
        />

        {/* Gradient overlay for better text visibility */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Overlay actions */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: 12, md: 20 },
            right: { xs: 12, md: 20 },
            display: "flex",
            gap: 1,
            zIndex: 2,
          }}
        >
          <IconButton
            onClick={onSaveToggle}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              "&:hover": { 
                bgcolor: "rgba(255, 255, 255, 1)",
                transform: "scale(1.1)",
              },
              color: isSaved ? "#FF4081" : "grey.600",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {isSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton
            onClick={onShare}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              "&:hover": { 
                bgcolor: "rgba(255, 255, 255, 1)",
                transform: "scale(1.1)",
              },
              color: "grey.600",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <ShareIcon />
          </IconButton>
        </Box>

        {/* Match score badge */}
        {matchScore > 0 && (
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 12, md: 20 },
              left: { xs: 12, md: 20 },
              bgcolor: primaryColor,
              color: "#ffffff",
              px: 2.5,
              py: 1,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: { xs: "0.875rem", md: "1rem" },
              boxShadow: "0 4px 12px rgba(0, 179, 134, 0.4)",
              zIndex: 2,
            }}
          >
            {matchScore}% Match
          </Box>
        )}

        {/* Navigation arrows - only show if more than 1 image */}
        {gallery.length > 1 && (
          <>
            {/* Previous arrow */}
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: "absolute",
                left: { xs: 8, md: 16 },
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                color: "grey.700",
                zIndex: 2,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 1)",
                  transform: "translateY(-50%) scale(1.1)",
                },
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                "&:disabled": {
                  opacity: 0.3,
                },
              }}
            >
              <ArrowBackIosIcon sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }} />
            </IconButton>

            {/* Next arrow */}
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: { xs: 8, md: 16 },
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                color: "grey.700",
                zIndex: 2,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 1)",
                  transform: "translateY(-50%) scale(1.1)",
                },
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                "&:disabled": {
                  opacity: 0.3,
                },
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }} />
            </IconButton>

            {/* Image counter */}
            <Box
              sx={{
                position: "absolute",
                bottom: { xs: 12, md: 20 },
                right: { xs: 12, md: 20 },
                bgcolor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(10px)",
                color: "#ffffff",
                px: 2,
                py: 0.75,
                borderRadius: 2,
                fontSize: { xs: "0.75rem", md: "0.875rem" },
                fontWeight: 600,
                zIndex: 2,
              }}
            >
              {activeImage + 1} / {gallery.length}
            </Box>
          </>
        )}
      </Box>

      {/* Thumbnail images */}
      {gallery.length > 1 && (
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            p: { xs: 2, md: 3 },
            overflowX: "auto",
            bgcolor: theme.palette.background.paper,
            borderTop: 1,
            borderColor: "divider",
            "&::-webkit-scrollbar": {
              height: 6,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.mode === "light" ? "#ccc" : "#555",
              borderRadius: 3,
            },
          }}
        >
          {gallery.map((img, index) => (
            <Box
              key={index}
              onClick={() => onImageChange(index)}
              sx={{
                width: { xs: 70, md: 100 },
                height: { xs: 52, md: 75 },
                flexShrink: 0,
                cursor: "pointer",
                border:
                  activeImage === index
                    ? `3px solid ${primaryColor}`
                    : `2px solid ${theme.palette.divider}`,
                borderRadius: 2,
                overflow: "hidden",
                transition: "all 0.2s ease",
                opacity: activeImage === index ? 1 : 0.7,
                "&:hover": {
                  opacity: 1,
                  transform: "scale(1.05)",
                  borderColor: primaryColor,
                },
              }}
            >
              <CardMedia
                component="img"
                image={formatImageUrl(img)}
                alt={`Thumbnail ${index + 1}`}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={handleImageError}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageGallery;

