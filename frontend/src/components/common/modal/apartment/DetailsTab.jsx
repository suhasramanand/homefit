/**
 * Apartment Details Tab Component
 */

import React from 'react';
import { Grid, Typography, Box, useTheme, Paper } from '@mui/material';
import dayjs from 'dayjs';
import BedIcon from '@mui/icons-material/Bed';
import BathroomIcon from '@mui/icons-material/Bathroom';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const DetailsTab = ({ apartment }) => {
  const theme = useTheme();

  const detailItems = [
    {
      icon: <BedIcon />,
      label: "Bedrooms",
      value: apartment.bedrooms,
    },
    {
      icon: <BathroomIcon />,
      label: "Bathrooms",
      value: apartment.bathrooms || 1,
    },
    {
      icon: <SquareFootIcon />,
      label: "Square Feet",
      value: apartment.sqft || 750,
    },
    {
      icon: <CalendarTodayIcon />,
      label: "Available From",
      value: apartment.moveInDate
        ? dayjs(apartment.moveInDate).format("MMM DD, YYYY")
        : "May 14, 2025",
    },
  ];

  return (
    <Box>
      {/* Key Details Grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {detailItems.map((item, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                bgcolor: theme.palette.mode === "light" ? "#f8f9fa" : "#1e1e1e",
                border: `1px solid ${theme.palette.divider}`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.palette.mode === "light" 
                    ? "0 4px 12px rgba(0,0,0,0.1)" 
                    : "0 4px 12px rgba(0,0,0,0.3)",
                },
              }}
            >
              <Box
                sx={{
                  color: theme.palette.primary.main,
                  mb: 1,
                  fontSize: "2rem",
                }}
              >
                {item.icon}
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 0.5, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5 }}
              >
                {item.label}
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Description */}
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.mode === "light" ? "#f8f9fa" : "#1e1e1e",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography 
          variant="h6" 
          fontWeight={600} 
          gutterBottom
          sx={{ mb: 2 }}
        >
          About this property
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            lineHeight: 1.8,
            color: "text.secondary",
          }}
        >
          {apartment.description ||
            `This stunning ${
              apartment.bedrooms
            }-bedroom apartment in ${
              apartment.neighborhood
            } offers modern living with exceptional amenities. 
            Featuring beautiful bathroom${
              apartment.bathrooms > 1 ? "s" : ""
            } and thoughtfully designed space, 
            this residence provides both comfort and style.`}
        </Typography>
      </Box>
    </Box>
  );
};

export default DetailsTab;

