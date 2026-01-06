import React from "react";
import { Box, Button, CircularProgress, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const SubmitContainer = styled(Paper)(({ theme, primaryColor }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === "dark" 
    ? "rgba(0, 179, 134, 0.1)" 
    : `${primaryColor}08`,
  border: `2px solid ${primaryColor}30`,
  marginTop: theme.spacing(4),
  textAlign: "center",
}));

const SubmitButton = styled(Button)(({ theme, primaryColor }) => ({
  py: 2,
  px: 6,
  borderRadius: 12,
  fontSize: "1.1rem",
  fontWeight: 700,
  backgroundColor: primaryColor,
  textTransform: "none",
  boxShadow: `0 4px 16px ${primaryColor}40`,
  "&:hover": { 
    backgroundColor: "#009e75",
    boxShadow: `0 6px 20px ${primaryColor}50`,
    transform: "translateY(-2px)",
  },
  "&:disabled": {
    backgroundColor: theme.palette.mode === "dark" 
      ? "rgba(255, 255, 255, 0.1)" 
      : "rgba(0, 0, 0, 0.1)",
  },
  transition: "all 0.3s ease",
}));

const SubmitSection = ({ isSubmitting, primaryColor }) => {
  return (
    <Box mt={5}>
      <SubmitContainer elevation={0} primaryColor={primaryColor}>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
          Review all information before submitting. You can edit your listing later.
        </Typography>
        <SubmitButton
          variant="contained"
          fullWidth
          type="submit"
          disabled={isSubmitting}
          endIcon={
            isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <ArrowForwardIcon sx={{ fontSize: 24 }} />
            )
          }
          primaryColor={primaryColor}
        >
          {isSubmitting ? "Publishing Your Listing..." : "Publish Apartment Listing"}
        </SubmitButton>
        {!isSubmitting && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, gap: 1 }}>
            <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
            <Typography variant="caption" color="text.secondary">
              Your listing will be reviewed and published within 24 hours
            </Typography>
          </Box>
        )}
      </SubmitContainer>
    </Box>
  );
};

export default SubmitSection;