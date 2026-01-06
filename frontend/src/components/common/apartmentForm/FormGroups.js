import React from "react";
import {
  Typography,
  Grid,
  TextField,
  Box,
  Paper,
  Chip,
  Stack,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BuildIcon from "@mui/icons-material/Build";
import PeopleIcon from "@mui/icons-material/People";

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === "dark" 
    ? "rgba(255, 255, 255, 0.03)" 
    : "rgba(0, 0, 0, 0.02)",
  border: `1px solid ${theme.palette.mode === "dark" 
    ? "rgba(255, 255, 255, 0.08)" 
    : "rgba(0, 0, 0, 0.08)"}`,
  marginBottom: theme.spacing(4),
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

const OptionChip = styled(Chip)(({ theme, selected, primaryColor }) => ({
  height: 40,
  borderRadius: 8,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s ease",
  backgroundColor: selected
    ? primaryColor
    : theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(0, 0, 0, 0.04)",
  color: selected
    ? "#fff"
    : theme.palette.text.primary,
  border: `2px solid ${selected
    ? primaryColor
    : theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 0, 0, 0.15)"}`,
  "&:hover": {
    backgroundColor: selected
      ? primaryColor
      : theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.12)"
        : "rgba(0, 0, 0, 0.08)",
    borderColor: primaryColor,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${primaryColor}40`,
  },
}));

const StyledTextField = styled(TextField)(({ theme, primaryColor }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "#fff",
    "& fieldset": {
      borderColor: theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.15)"
        : "rgba(0, 0, 0, 0.23)",
      borderWidth: 2,
    },
    "&:hover fieldset": {
      borderColor: primaryColor,
    },
    "&.Mui-focused fieldset": {
      borderColor: primaryColor,
      borderWidth: 2,
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
  },
}));

const fieldGroups = [
  {
    icon: <HomeIcon />,
    title: "Basic Information",
    description: "Essential details about your listing",
    fields: [
      { 
        name: "type", 
        label: "Listing Type *", 
        options: ["Rent", "Buy"],
        required: true,
      },
      { 
        name: "bedrooms", 
        label: "Bedrooms *", 
        options: ["Studio", "1", "2", "3", "4+"],
        required: true,
      },
      { 
        name: "price", 
        label: "Monthly Rent (USD) *", 
        type: "number",
        required: true,
        helperText: "Enter the monthly rental price",
      },
      { 
        name: "moveInDate", 
        label: "Available From *", 
        type: "date",
        required: true,
      },
    ],
  },
  {
    icon: <LocationOnIcon />,
    title: "Location & Design",
    description: "Where is your property located and how does it look?",
    fields: [
      {
        name: "neighborhood",
        label: "Neighborhood *",
        options: [
          "Quiet and Residential",
          "Busy Urban Area",
          "Close to Entertainment & Dining",
        ],
        required: true,
      },
      {
        name: "style",
        label: "Apartment Style *",
        options: ["Modern", "Traditional", "Loft", "High-rise"],
        required: true,
      },
      {
        name: "floor",
        label: "Floor Level",
        options: ["Ground Floor", "Mid-level Floor", "Top Floor"],
      },
      {
        name: "view",
        label: "View",
        options: ["City View", "Park View", "Ocean View", "No Specific View"],
      },
    ],
  },
  {
    icon: <BuildIcon />,
    title: "Features & Specifications",
    description: "Additional features and property specifications",
    fields: [
      {
        name: "sqft",
        label: "Square Footage",
        type: "number",
        helperText: "e.g., 1150",
      },
      { 
        name: "parking", 
        label: "Parking Available", 
        options: ["Yes", "No"] 
      },
      {
        name: "transport",
        label: "Public Transport Access",
        options: ["Excellent", "Good", "Average", "Limited"],
      },
      {
        name: "safety",
        label: "Safety Level",
        options: ["Very Safe", "Safe", "Moderate", "Basic"],
      },
    ],
  },
  {
    icon: <PeopleIcon />,
    title: "Tenant Information",
    description: "Policies and preferences for tenants",
    fields: [
      {
        name: "pets",
        label: "Pet Policy",
        options: ["Dogs Allowed", "Cats Allowed", "No Pets"],
      },
      {
        name: "leaseCapacity",
        label: "Lease Capacity",
        options: ["1", "2", "3", "4+"],
      },
      { 
        name: "roommates", 
        label: "Roommate-Friendly", 
        options: ["Yes", "No"] 
      },
    ],
  },
];

const FormGroups = ({ formData, handleChange, isDarkMode, primaryColor }) => {
  const handleChipClick = (fieldName, value) => {
    const syntheticEvent = {
      target: {
        name: fieldName,
        value: value,
      },
    };
    handleChange(syntheticEvent);
  };

  return (
    <>
      {fieldGroups.map((group, idx) => (
        <SectionCard key={idx} elevation={0}>
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
              {group.icon}
            </Box>
            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
                color="text.primary"
                gutterBottom
              >
                {group.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {group.description}
              </Typography>
            </Box>
          </SectionHeader>

          <Grid container spacing={3}>
            {group.fields.map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                {field.options ? (
                  <FormControl fullWidth>
                    <FormLabel
                      component="legend"
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        mb: 1.5,
                        color: "text.primary",
                      }}
                    >
                      {field.label}
                    </FormLabel>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {field.options.map((opt) => {
                        const isSelected = formData[field.name] === opt;
                        return (
                          <OptionChip
                            key={opt}
                            label={opt}
                            onClick={() => handleChipClick(field.name, opt)}
                            selected={isSelected}
                            primaryColor={primaryColor}
                          />
                        );
                      })}
                    </Stack>
                  </FormControl>
                ) : (
                  <StyledTextField
                    fullWidth
                    name={field.name}
                    label={field.label}
                    type={field.type || "text"}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                    helperText={field.helperText}
                    InputLabelProps={
                      field.type === "date" ? { shrink: true } : {}
                    }
                    primaryColor={primaryColor}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </SectionCard>
      ))}
    </>
  );
};

export default FormGroups;
