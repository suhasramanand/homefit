import React from "react";
import {
  Typography,
  Grid,
  TextField,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PlaceIcon from "@mui/icons-material/Place";
import PlacesAutocomplete from "./PlacesAutocomplete";
import ModernMapComponent from "../../map/ModernMapComponent";

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

const MapContainer = styled(Box)(({ theme }) => ({
  height: 400,
  width: "100%",
  borderRadius: 12,
  overflow: "hidden",
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  border: `2px solid ${theme.palette.mode === "dark"
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)"}`,
  boxShadow: theme.palette.mode === "dark"
    ? "0 4px 12px rgba(0, 0, 0, 0.2)"
    : "0 4px 12px rgba(0, 0, 0, 0.08)",
}));

const LocationSection = ({
  formData,
  handlePositionChange,
  handlePlaceSelected,
  googleMapsApiKey,
  geocodingError,
  isDarkMode,
  primaryColor,
}) => {
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
          <PlaceIcon />
        </Box>
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            Property Location
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start typing to search for an address, or click directly on the map to set the location.
          </Typography>
        </Box>
      </SectionHeader>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <PlacesAutocomplete
            onPlaceSelected={handlePlaceSelected}
            apiKey={googleMapsApiKey}
            initialValue={formData.location.address}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap={1}
          >
            <TextField
              label="Longitude"
              type="number"
              InputProps={{ readOnly: true }}
              value={formData.location.coordinates[0]}
              size="small"
              sx={{ flex: 1 }}
            />
            <TextField
              label="Latitude"
              type="number"
              InputProps={{ readOnly: true }}
              value={formData.location.coordinates[1]}
              size="small"
              sx={{ flex: 1 }}
            />
          </Box>
        </Grid>
      </Grid>

      {geocodingError && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
          {geocodingError}
        </Alert>
      )}

      <MapContainer>
        <ModernMapComponent
          position={formData.location.coordinates}
          onPositionChange={(newPos) => {
            // Convert from [lng, lat] to { lat, lng } format
            if (handlePositionChange) {
              handlePositionChange({
                lat: newPos[1],
                lng: newPos[0],
              });
            }
          }}
          apiKey={googleMapsApiKey}
          zoom={14}
          showRadius={false}
          height={400}
        />
      </MapContainer>
    </SectionCard>
  );
};

export default LocationSection;