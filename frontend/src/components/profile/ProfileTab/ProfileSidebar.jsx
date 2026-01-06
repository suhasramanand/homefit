import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Typography,
  Chip,
  Divider,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import HouseIcon from "@mui/icons-material/House";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";

const ProfileSidebar = ({
  user,
  profileData,
  previewImage,
  savedListings,
  handleImageChange,
  handleRemoveSavedListing,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDarkMode = theme.palette.mode === "dark";
  const primaryColor = theme.palette.primary.main;
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Card
        elevation={2}
        sx={{
          borderRadius: 2,
          backgroundColor: isDarkMode
            ? "rgba(255, 255, 255, 0.05)"
            : "#fff",
          border: isDarkMode
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "none",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 3,
          }}
        >
          <Box
            sx={{
              position: "relative",
              mb: 2,
              cursor: "pointer",
              "&:hover .avatar-overlay": {
                opacity: 1,
              },
            }}
            onClick={handleAvatarClick}
          >
            <Avatar
              key={`profile-avatar-${previewImage ? 'preview' : (user?.imagePath || 'default')}`}
              src={previewImage || (user?.imagePath ? (user.imagePath.startsWith('http') ? `${user.imagePath}?t=${Date.now()}` : `http://localhost:4000${user.imagePath}?t=${Date.now()}`) : null)}
              alt={profileData.fullName}
              sx={{
                width: 120,
                height: 120,
                bgcolor: primaryColor,
              }}
            >
              {profileData.fullName
                ? profileData.fullName.charAt(0).toUpperCase()
                : "U"}
            </Avatar>
            <Box
              className="avatar-overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "50%",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.3s ease",
                pointerEvents: "none",
              }}
            >
              <CameraAltIcon
                sx={{
                  color: theme.palette.primary.contrastText,
                  fontSize: 32,
                }}
              />
            </Box>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Box>

          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            color="text.primary"
            key={`name-${profileData.fullName}`}
          >
            {profileData.fullName}
          </Typography>

          <Chip
            icon={<PersonIcon />}
            label="User Account"
            color="primary"
            sx={{ mt: 1, mb: 2 }}
          />

          <Divider sx={{ width: "100%", my: 2 }} />

          <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <PersonIcon
                sx={{ color: "text.secondary", mr: 1, fontSize: 20 }}
              />
              <Typography variant="body2" color="text.secondary">
                Full Name
              </Typography>
            </Box>
            <Typography
              variant="body1"
              gutterBottom
              fontWeight="medium"
              color="text.primary"
            >
              {profileData.fullName}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
                mt: 2,
              }}
            >
              <EmailIcon
                sx={{ color: "text.secondary", mr: 1, fontSize: 20 }}
              />
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
            </Box>
            <Typography
              variant="body1"
              gutterBottom
              fontWeight="medium"
              color="text.primary"
            >
              {profileData.email}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
                mt: 2,
              }}
            >
              <HouseIcon
                sx={{ color: "text.secondary", mr: 1, fontSize: 20 }}
              />
              <Typography variant="body2" color="text.secondary">
                Saved Properties
              </Typography>
            </Box>
            <Typography
              variant="body1"
              gutterBottom
              fontWeight="medium"
              color="text.primary"
            >
              {savedListings.length || 0}
            </Typography>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, mb: 2, textAlign: "center", fontStyle: "italic" }}
          >
            Click on photo to change
          </Typography>
        </CardContent>
      </Card>

      {savedListings.length > 0 && (
        <Card
          elevation={2}
          sx={{
            borderRadius: 2,
            backgroundColor: isDarkMode
              ? "rgba(255, 255, 255, 0.05)"
              : "#fff",
            border: isDarkMode
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "none",
            mt: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              color="text.primary"
            >
              Saved Properties
            </Typography>

            <Divider sx={{ my: 2 }} />

            <List>
              {savedListings.slice(0, 3).map((listing) => (
                <ListItem key={listing._id} divider>
                  <ListItemText
                    primary={listing.title || "Apartment"}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          ${listing.price}/month
                        </Typography>
                        {" — "}
                        {listing.neighborhood || "Unknown area"},{" "}
                        {listing.bedrooms || "?"} bed
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() =>
                        navigate(`/apartment/${listing._id}`)
                      }
                    >
                      View
                    </Button>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() =>
                        handleRemoveSavedListing(listing._id)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            {savedListings.length > 3 && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/user/saved")}
                  sx={{
                    borderRadius: 2,
                    borderColor: primaryColor,
                    color: primaryColor,
                  }}
                >
                  View All ({savedListings.length})
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ProfileSidebar;