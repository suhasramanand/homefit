/**
 * View Apartment Modal
 * Main component that aggregates all apartment view sub-components
 */

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Grid,
  useTheme,
  Tab,
  Tabs,
} from "@mui/material";
import axios from "axios";
import ContactBrokerDialog from "./dialog/ContactBrokerDialog";
import ScheduleTourDialog from "./dialog/ScheduleTourDialog";

// Import sub-components
import ModalHeader from "./apartment/ModalHeader";
import ImageGallery from "./apartment/ImageGallery";
import DetailsSidebar from "./apartment/DetailsSidebar";
import DetailsTab from "./apartment/DetailsTab";
import AmenitiesTab from "./apartment/AmenitiesTab";
import LocationTab from "./apartment/LocationTab";
import MatchAnalysisTab from "./apartment/MatchAnalysisTab";
import { formatImageUrl } from "../../../utils/imageUtils";
import { formatPriceSimple } from "../../../utils/formatUtils";

const ViewApartmentModal = ({ open, onClose, apartment }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [matchHighlights, setMatchHighlights] = useState([]);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [locationAvailable, setLocationAvailable] = useState(true);
  const [brokerInfo, setBrokerInfo] = useState(null);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [openTourDialog, setOpenTourDialog] = useState(false);
  
  const theme = useTheme();
  const primaryColor = "#00b386";

  useEffect(() => {
    // Reset active image when modal is opened with a new apartment
    setActiveImage(0);

    // Check if apartment is saved
    const checkSavedStatus = async () => {
      if (!apartment || !open) return;

      try {
        const res = await axios.get("http://localhost:4000/api/user/saved", {
          withCredentials: true,
        });

        const isAptSaved = (res.data || []).some(
          (apt) => apt._id === apartment._id
        );
        setIsSaved(isAptSaved);
      } catch (err) {
        console.error("Failed to check saved status", err);
      }
    };

    // Get match highlights from explanation
    const parseMatchHighlights = () => {
      if (!apartment?.explanation) return;

      const highlights = [];
      const lines = apartment.explanation.split("\n").filter(Boolean);

      lines.forEach((line) => {
        if (line.startsWith("✅")) {
          highlights.push(line.substring(2).trim());
        }
      });

      setMatchHighlights(highlights.slice(0, 4)); // Limit to 4 highlights
    };

    // Get similar properties - would be from API in production
    const fetchSimilarProperties = async () => {
      if (!apartment || !open) return;

      try {
        const res = await axios.get("http://localhost:4000/api/apartments", {
          withCredentials: true,
        });

        // Filter to get properties in the same neighborhood
        const similar = (res.data || [])
          .filter(
            (apt) =>
              apt._id !== apartment._id &&
              apt.neighborhood === apartment.neighborhood
          )
          .slice(0, 2); // Limit to 2

        setSimilarProperties(similar);
      } catch (err) {
        console.error("Failed to fetch similar properties", err);
        setSimilarProperties([]);
      }
    };

    // Fetch broker information
    const fetchBrokerInfo = async () => {
      if (!apartment || !open || !apartment.brokerEmail) return;

      try {
        const res = await axios.get(`http://localhost:4000/api/broker/${apartment.broker}`, {
          withCredentials: true,
        });

        setBrokerInfo(res.data?.broker || {
          fullName: apartment?.broker?.fullName || "Property Agent",
          email: apartment.brokerEmail,
          phone: apartment?.broker?.phone || "Not available",
          company: apartment?.broker?.companyName || "Real Estate Agency",
          imagePath: apartment?.broker?.imagePath || null
        });
      } catch (err) {
        console.error("Failed to fetch broker info", err);
        // Set default broker info
        setBrokerInfo({
          fullName: apartment?.broker?.fullName || "Property Agent",
          email: apartment.brokerEmail,
          company: "Real Estate Agency",
        });
      }
    };

    if (open && apartment) {
      checkSavedStatus();
      parseMatchHighlights();
      fetchSimilarProperties();
      fetchBrokerInfo();
      
      // Check if location data is available
      const hasCoordinates = apartment.location && 
                            apartment.location.coordinates && 
                            apartment.location.coordinates.length === 2 &&
                            apartment.location.coordinates[0] !== 0 &&
                            apartment.location.coordinates[1] !== 0;
                            
      const hasAddress = apartment.location?.address || apartment.address;
      
      setLocationAvailable(hasCoordinates || hasAddress);
    }
  }, [open, apartment]);

  // Get actual address or precise location
  const getDisplayAddress = () => {
    if (!apartment) return "Location not available";
    
    // Check for specific address
    if (apartment.location?.address) return apartment.location.address;
    if (apartment.address) return apartment.address;
    
    // If no specific address but we have coordinates
    if (apartment.location?.coordinates && 
        apartment.location.coordinates.length === 2 &&
        apartment.location.coordinates[0] !== 0 &&
        apartment.location.coordinates[1] !== 0) {
      // We have coordinates but no readable address
      return `${apartment.neighborhood}, Mumbai (Exact location available on map)`;
    }
    
    // If we have a neighborhood but no specific address or coordinates
    if (apartment.neighborhood) {
      return `${apartment.neighborhood}, Mumbai`;
    }
    
    return "Location not disclosed";
  };

  // Handle sharing the apartment
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${apartment.bedrooms} BHK Apartment in ${apartment.neighborhood}`,
        text: `Check out this ${apartment.bedrooms} BHK apartment in ${apartment.neighborhood} for ${formatPriceSimple(apartment.price)}/month!`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      }).catch(err => {
        console.error('Error copying to clipboard:', err);
      });
    }
  };

  if (!apartment) return null;

  const gallery = apartment.imageUrls?.length
    ? apartment.imageUrls
    : [apartment.imageUrl];
  const matchScore = Math.round(apartment.matchScore || 0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSaveToggle = async () => {
    if (!apartment?._id) {
      console.error("Cannot save: apartment ID is missing");
      return;
    }
    
    const previousSavedState = isSaved;
    const apartmentId = apartment._id;
    
    // Optimistically update UI for immediate feedback
    setIsSaved(!isSaved);
    
    try {
      // Call API to toggle save status
      const response = await axios.post(
        "http://localhost:4000/api/user/save",
        { apartmentId },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      // Log success for debugging
      console.log("Save toggle response:", response.data);
      
      // Verify the actual saved state after API call to ensure sync
      const res = await axios.get("http://localhost:4000/api/user/saved", {
        withCredentials: true,
      });
      
      const isAptSaved = (res.data || []).some(
        (apt) => apt._id === apartmentId || apt._id?.toString() === apartmentId?.toString()
      );
      
      // Update state with actual server state
      setIsSaved(isAptSaved);
    } catch (err) {
      console.error("Save error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Apartment ID used:", apartmentId);
      
      // Revert to previous state on error
      setIsSaved(previousSavedState);
      
      // Show error message
      if (err.response?.data?.error) {
        alert(`Failed to save: ${err.response.data.error}`);
      } else {
        alert("Failed to save apartment. Please try again.");
      }
    }
  };

  // Modal styles based on theme mode
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "95%",
    maxWidth: 1400,
    bgcolor: theme.palette.background.paper,
    boxShadow:
      theme.palette.mode === "light"
        ? "0 20px 60px rgba(0, 0, 0, 0.15)"
        : "0 20px 60px rgba(0, 0, 0, 0.5)",
    borderRadius: 4,
    p: 0,
    maxHeight: "95vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    border:
      theme.palette.mode === "light"
        ? "none"
        : "1px solid rgba(255, 255, 255, 0.1)",
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          {/* Top navigation bar */}
          <ModalHeader onClose={onClose} />

          {/* Main content - scrollable area */}
          <Box sx={{ overflowY: "auto", flex: 1 }}>
            <Grid container sx={{ minHeight: "100%" }}>
              {/* Left section (images) - 60% */}
              <Grid 
                item 
                xs={12} 
                md={7} 
                lg={7}
                sx={{ 
                  borderRight: { md: 1 }, 
                  borderColor: "divider",
                  bgcolor: theme.palette.mode === "light" ? "#fafafa" : "#1a1a1a"
                }}
              >
                <ImageGallery
                  gallery={gallery}
                  activeImage={activeImage}
                  onImageChange={setActiveImage}
                  isSaved={isSaved}
                  onSaveToggle={handleSaveToggle}
                  onShare={handleShare}
                  matchScore={matchScore}
                  primaryColor={primaryColor}
                  formatImageUrl={formatImageUrl}
                />
              </Grid>

              {/* Right section (details) - 40% */}
              <Grid
                item
                xs={12}
                md={5}
                lg={5}
                sx={{ 
                  position: { md: "sticky" },
                  top: 0,
                  alignSelf: "flex-start",
                  maxHeight: { md: "95vh" },
                  overflowY: { md: "auto" }
                }}
              >
                <DetailsSidebar
                  apartment={apartment}
                  displayAddress={getDisplayAddress()}
                  brokerInfo={brokerInfo}
                  matchHighlights={matchHighlights}
                  similarProperties={similarProperties}
                  onContactBroker={() => setOpenContactDialog(true)}
                  onScheduleTour={() => setOpenTourDialog(true)}
                  primaryColor={primaryColor}
                  formatImageUrl={formatImageUrl}
                />
              </Grid>
            </Grid>

            {/* Tabs section - Full width below main content */}
            <Box 
              sx={{ 
                width: "100%", 
                px: { xs: 2, md: 4 },
                py: 3,
                bgcolor: theme.palette.background.paper,
                borderTop: 1,
                borderColor: "divider"
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  mb: 3,
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    px: { xs: 2, md: 4 },
                    minHeight: 48,
                    fontSize: { xs: "0.875rem", md: "1rem" },
                  },
                  "& .Mui-selected": {
                    color: `${primaryColor} !important`,
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: primaryColor,
                    height: 3,
                  },
                }}
              >
                <Tab label="AI Match Analysis" />
                <Tab label="Details" />
                <Tab label="Amenities" />
                <Tab label="Location" />
              </Tabs>

              <Box>
                {activeTab === 0 && (
                  <MatchAnalysisTab 
                    apartment={apartment} 
                    matchScore={matchScore}
                    primaryColor={primaryColor}
                  />
                )}

                {activeTab === 1 && (
                  <DetailsTab apartment={apartment} />
                )}

                {activeTab === 2 && (
                  <AmenitiesTab apartment={apartment} primaryColor={primaryColor} />
                )}

                {activeTab === 3 && (
                  <LocationTab
                    apartment={apartment}
                    locationAvailable={locationAvailable}
                    displayAddress={getDisplayAddress()}
                    onMapLoadingChange={setIsMapLoading}
                    onMapErrorChange={setMapError}
                    isMapLoading={isMapLoading}
                    mapError={mapError}
                    activeTab={activeTab}
                    open={open}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Contact Broker Dialog */}
      <ContactBrokerDialog
        open={openContactDialog}
        onClose={() => setOpenContactDialog(false)}
        apartmentId={apartment._id}
        brokerName={brokerInfo?.fullName || "the broker"}
        brokerEmail={brokerInfo?.email}
        brokerPhone={brokerInfo?.phone}
        brokerImage={brokerInfo?.imagePath ? formatImageUrl(brokerInfo.imagePath) : null}
        brokerCompany={brokerInfo?.company}
        apartmentDetails={apartment}
      />

      {/* Schedule Tour Dialog */}
      <ScheduleTourDialog
        open={openTourDialog}
        onClose={() => setOpenTourDialog(false)}
        apartmentId={apartment._id}
        brokerName={brokerInfo?.fullName || "the broker"}
        brokerImage={brokerInfo?.imagePath ? formatImageUrl(brokerInfo.imagePath) : null}
        apartmentName={`${apartment.bedrooms} BHK in ${apartment.neighborhood}`}
      />
    </>
  );
};

export default ViewApartmentModal;
