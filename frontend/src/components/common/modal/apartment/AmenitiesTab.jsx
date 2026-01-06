/**
 * Apartment Amenities Tab Component
 */

import React from 'react';
import { Grid, useTheme, Box, Typography, Paper } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PoolIcon from '@mui/icons-material/Pool';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PetsIcon from '@mui/icons-material/Pets';
import BalconyIcon from '@mui/icons-material/Balcony';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import SecurityIcon from '@mui/icons-material/Security';
import ElevatorIcon from '@mui/icons-material/Elevator';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WifiIcon from '@mui/icons-material/Wifi';
import TvIcon from '@mui/icons-material/Tv';
import KitchenIcon from '@mui/icons-material/Kitchen';
import BathtubIcon from '@mui/icons-material/Bathtub';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AmenitiesTab = ({ apartment, primaryColor = "#00b386" }) => {
  const theme = useTheme();

  // Icon mapping for amenities - inspired by Airbnb, Zillow, Apartments.com
  const amenityIcons = {
    'Gym': <FitnessCenterIcon />,
    'Fitness Center': <FitnessCenterIcon />,
    'Swimming Pool': <PoolIcon />,
    'Pool': <PoolIcon />,
    'Parking Space': <LocalParkingIcon />,
    'Parking': <LocalParkingIcon />,
    'Pet-Friendly': <PetsIcon />,
    'Pets Allowed': <PetsIcon />,
    'Pets': <PetsIcon />,
    'Balcony': <BalconyIcon />,
    'In-Unit Laundry': <LocalLaundryServiceIcon />,
    'Laundry': <LocalLaundryServiceIcon />,
    'Washer/Dryer': <LocalLaundryServiceIcon />,
    'Security': <SecurityIcon />,
    'Elevator': <ElevatorIcon />,
    'Air Conditioning': <AcUnitIcon />,
    'AC': <AcUnitIcon />,
    'WiFi': <WifiIcon />,
    'Internet': <WifiIcon />,
    'TV': <TvIcon />,
    'Cable': <TvIcon />,
    'Kitchen': <KitchenIcon />,
    'Dishwasher': <KitchenIcon />,
    'Bathtub': <BathtubIcon />,
  };

  const amenities = apartment.amenities || ["Parking", "Security", "Elevator"];

  // Get icon for amenity or default checkmark
  const getAmenityIcon = (amenity) => {
    const normalizedAmenity = amenity.trim();
    for (const [key, icon] of Object.entries(amenityIcons)) {
      if (normalizedAmenity.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(normalizedAmenity.toLowerCase())) {
        return icon;
      }
    }
    return <CheckCircleIcon />;
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h6" 
          fontWeight={700} 
          gutterBottom
          sx={{ 
            mb: 0.5,
            fontSize: { xs: "1.25rem", md: "1.5rem" },
            color: "text.primary"
          }}
        >
          Amenities & Features
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: "0.875rem" }}
        >
          Everything this property has to offer
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {amenities.map((amenity, index) => {
          const icon = getAmenityIcon(amenity);
          return (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  height: "100%",
                  minHeight: { xs: 100, md: 110 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                  background: theme.palette.mode === "light"
                    ? `linear-gradient(135deg, ${primaryColor}08 0%, ${primaryColor}12 100%)`
                    : `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}20 100%)`,
                  border: `1.5px solid ${theme.palette.mode === "light" ? `${primaryColor}20` : `${primaryColor}30`}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                    background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 70%)`,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)`,
                    transition: "left 0.5s ease",
                  },
                  "&:hover": {
                    transform: "translateY(-6px) scale(1.03)",
                    borderColor: primaryColor,
                    background: theme.palette.mode === "light"
                      ? `linear-gradient(135deg, ${primaryColor}12 0%, ${primaryColor}18 100%)`
                      : `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}25 100%)`,
                    boxShadow: theme.palette.mode === "light"
                      ? `0 8px 20px ${primaryColor}30, 0 0 0 1px ${primaryColor}15`
                      : `0 8px 20px ${primaryColor}40, 0 0 0 1px ${primaryColor}25`,
                    "&::before": {
                      opacity: 1,
                    },
                    "&::after": {
                      left: "100%",
                    },
                    "& .amenity-icon": {
                      transform: "scale(1.15) rotate(5deg)",
                      color: primaryColor,
                      filter: `drop-shadow(0 2px 4px ${primaryColor}40)`,
                    },
                    "& .amenity-text": {
                      color: primaryColor,
                      fontWeight: 700,
                    },
                  },
                }}
              >
                <Box
                  className="amenity-icon"
                  sx={{
                    color: primaryColor,
                    fontSize: { xs: "1.75rem", md: "2rem" },
                    mb: 1,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {icon}
                </Box>
                <Typography 
                  className="amenity-text"
                  variant="body2" 
                  fontWeight={600}
                  sx={{
                    color: "text.primary",
                    fontSize: { xs: "0.8125rem", md: "0.875rem" },
                    lineHeight: 1.4,
                    position: "relative",
                    zIndex: 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  {amenity}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Empty state if no amenities */}
      {amenities.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No amenities listed for this property.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AmenitiesTab;

