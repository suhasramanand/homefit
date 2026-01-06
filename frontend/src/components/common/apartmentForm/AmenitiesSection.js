import React from "react";
import {
  Typography,
  Box,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === "dark" 
    ? "rgba(255, 255, 255, 0.03)" 
    : "rgba(0, 0, 0, 0.02)",
  border: `1px solid ${theme.palette.mode === "dark" 
    ? "rgba(255, 255, 255, 0.08)" 
    : "rgba(0, 0, 0, 0.08)"}`,
  marginTop: theme.spacing(4),
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.palette.mode === "dark"
      ? "0 4px 20px rgba(0, 179, 134, 0.1)"
      : "0 4px 20px rgba(0, 179, 134, 0.08)",
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: `2px solid ${theme.palette.mode === "dark" 
    ? "rgba(255, 255, 255, 0.1)" 
    : "rgba(0, 0, 0, 0.08)"}`,
}));

const AmenityChip = styled(Chip)(({ theme, selected, primaryColor }) => ({
  height: 48,
  borderRadius: 12,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s ease",
  backgroundColor: selected
    ? `${primaryColor}15`
    : theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "#fff",
  color: selected
    ? primaryColor
    : theme.palette.text.primary,
  border: `2px solid ${selected
    ? primaryColor
    : theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 0, 0, 0.15)"}`,
  "&:hover": {
    backgroundColor: selected
      ? `${primaryColor}20`
      : theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(0, 0, 0, 0.04)",
    borderColor: primaryColor,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${primaryColor}40`,
  },
  "& .MuiChip-icon": {
    color: selected ? primaryColor : theme.palette.text.secondary,
  },
}));

const amenitiesList = [
  { name: "Gym", icon: "💪" },
  { name: "Swimming Pool", icon: "🏊" },
  { name: "Parking Space", icon: "🚗" },
  { name: "Pet-Friendly", icon: "🐾" },
  { name: "Balcony", icon: "🌆" },
  { name: "In-Unit Laundry", icon: "🧺" },
  { name: "AC", icon: "❄️" },
  { name: "Elevator", icon: "🛗" },
  { name: "Security", icon: "🔒" },
  { name: "WiFi", icon: "📶" },
];

const AmenitiesSection = ({ formData, handleCheckboxChange, isDarkMode, primaryColor }) => {
  const handleChipClick = (name) => {
    const syntheticEvent = {
      target: {
        name: name,
        checked: !formData.amenities.includes(name),
      },
    };
    handleCheckboxChange(syntheticEvent);
  };

  return (
    <SectionCard elevation={0}>
      <SectionHeader>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: 2,
            backgroundColor: `${primaryColor}15`,
            color: primaryColor,
            mr: 2,
          }}
        >
          <LocalFireDepartmentIcon />
        </Box>
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            Amenities & Features
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Select all amenities available in your property
          </Typography>
        </Box>
      </SectionHeader>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {amenitiesList.map((amenity) => {
          const isSelected = formData.amenities.includes(amenity.name);
          return (
            <AmenityChip
              key={amenity.name}
              label={amenity.name}
              icon={
                isSelected ? (
                  <CheckCircleIcon />
                ) : (
                  <CircleOutlinedIcon />
                )
              }
              onClick={() => handleChipClick(amenity.name)}
              selected={isSelected}
              primaryColor={primaryColor}
            />
          );
        })}
      </Stack>

      {formData.amenities.length > 0 && (
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary">
            {formData.amenities.length} {formData.amenities.length === 1 ? "amenity" : "amenities"} selected
          </Typography>
        </Box>
      )}
    </SectionCard>
  );
};

export default AmenitiesSection;