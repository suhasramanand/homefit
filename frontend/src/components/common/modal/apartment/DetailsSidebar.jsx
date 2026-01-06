/**
 * Apartment Details Sidebar Component
 */

import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Button,
  useTheme,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmailIcon from '@mui/icons-material/Email';
import MatchHighlights from './MatchHighlights';
import SimilarProperties from './SimilarProperties';

const DetailsSidebar = ({
  apartment,
  displayAddress,
  brokerInfo,
  matchHighlights,
  similarProperties,
  onContactBroker,
  onScheduleTour,
  primaryColor,
  formatImageUrl,
}) => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        p: { xs: 2.5, md: 3 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title and Location */}
      <Box mb={2}>
        <Typography
          variant="h5"
          fontWeight={700}
          color="text.primary"
          gutterBottom
          sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
        >
          {apartment.bedrooms} BHK in {apartment.neighborhood}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ 
            display: "flex", 
            alignItems: "flex-start", 
            gap: 0.5,
            mt: 1,
            lineHeight: 1.6,
          }}
        >
          <LocationOnIcon sx={{ fontSize: 18, mt: 0.25, flexShrink: 0 }} />
          <span>{displayAddress}</span>
        </Typography>
      </Box>

      {/* Price */}
      <Box mb={3}>
        <Typography
          variant="h4"
          fontWeight={700}
          color="text.primary"
          sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }}
        >
          ${apartment.price.toLocaleString()}
          <Typography
            component="span"
            variant="body1"
            color="text.secondary"
            sx={{ fontWeight: 400, ml: 0.5 }}
          >
            /mo
          </Typography>
        </Typography>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Broker info */}
      {brokerInfo && (
        <Box 
          mb={3}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.mode === "light" ? "#f5f5f5" : "#1e1e1e",
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary" 
            gutterBottom
            sx={{ mb: 1.5, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5 }}
          >
            Listed by
          </Typography>
          <Typography variant="body1" fontWeight={600} mb={0.5}>
            {brokerInfo.fullName}
          </Typography>
          {brokerInfo.company && (
            <Typography variant="body2" color="text.secondary" mb={1}>
              {brokerInfo.company}
            </Typography>
          )}
          {brokerInfo.email && (
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                {brokerInfo.email}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Interested section */}
      <Box 
        mb={3}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography 
          variant="h6" 
          fontWeight={600} 
          gutterBottom
          sx={{ mb: 2, fontSize: { xs: "1rem", md: "1.25rem" } }}
        >
          Interested in this property?
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={onContactBroker}
          sx={{
            bgcolor: primaryColor,
            py: 1.75,
            mb: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            boxShadow: `0 4px 12px ${primaryColor}40`,
            "&:hover": { 
              bgcolor: "#009973",
              transform: "translateY(-2px)",
              boxShadow: `0 6px 16px ${primaryColor}60`,
            },
            transition: "all 0.2s ease",
          }}
        >
          Contact Broker
        </Button>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<CalendarTodayIcon />}
          onClick={onScheduleTour}
          sx={{
            color: theme.palette.text.primary,
            borderColor: "divider",
            borderWidth: 2,
            py: 1.75,
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            "&:hover": {
              borderColor: primaryColor,
              bgcolor: theme.palette.mode === "light" ? `${primaryColor}10` : `${primaryColor}20`,
              borderWidth: 2,
            },
            transition: "all 0.2s ease",
          }}
        >
          Schedule Tour
        </Button>
      </Box>

      {/* Match highlights */}
      {matchHighlights.length > 0 && (
        <MatchHighlights
          highlights={matchHighlights}
          primaryColor={primaryColor}
        />
      )}

      {/* Similar properties */}
      {similarProperties.length > 0 && (
        <SimilarProperties
          properties={similarProperties}
          primaryColor={primaryColor}
          formatImageUrl={formatImageUrl}
        />
      )}
    </Box>
  );
};

export default DetailsSidebar;

