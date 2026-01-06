import React from "react";
import {
  Typography,
  Box,
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

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

const UploadButton = styled(Button)(({ theme, primaryColor }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  borderRadius: 16,
  border: `2px dashed ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'}`,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#fff',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.02)',
    borderColor: primaryColor,
    borderWidth: 3,
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 24px ${primaryColor}30`,
  },
  marginBottom: theme.spacing(3)
}));

const Input = styled('input')({
  display: 'none',
});

const ImageGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const ImageItem = styled(Paper)(({ theme }) => ({
  position: 'relative',
  borderRadius: 8,
  overflow: 'hidden',
  aspectRatio: '1/1',
  '&:hover .delete-button': {
    opacity: 1,
  },
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  padding: 4,
  opacity: 0,
  transition: 'opacity 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 4,
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  borderRadius: 2,
  overflow: 'hidden',
  marginTop: theme.spacing(1),
}));

const ProgressIndicator = styled(Box)(({ progress, theme }) => ({
  width: `${progress}%`,
  height: '100%',
  backgroundColor: theme.palette.primary.main,
  transition: 'width 0.3s ease-in-out',
}));

const ImageUploadSection = ({
  formData,
  handleFileChange,
  uploadProgress,
  uploadStatus,
  isDarkMode,
  primaryColor,
  handleRemoveImage
}) => {
  const fileInputRef = React.useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
          <PhotoCameraIcon />
        </Box>
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            Apartment Images
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload high-quality photos to showcase your property (minimum 3 recommended)
          </Typography>
        </Box>
      </SectionHeader>
      
      <Input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        id="apartment-image-upload"
      />
      
      <UploadButton
        fullWidth
        onClick={triggerFileInput}
        disabled={uploadProgress > 0 && uploadProgress < 100}
        primaryColor={primaryColor}
      >
        <CloudUploadIcon sx={{ fontSize: 48, mb: 1.5, color: primaryColor }} />
        <Typography variant="body1" fontWeight={600} gutterBottom>
          {uploadProgress > 0 && uploadProgress < 100 
            ? `Uploading... ${uploadProgress}%` 
            : "Click or drag to upload images"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supported formats: JPG, PNG, WEBP (Max 10MB per image)
        </Typography>
      </UploadButton>
      
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box sx={{ width: '100%', mt: 1, mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Uploading: {uploadProgress}%
          </Typography>
          <ProgressBar>
            <ProgressIndicator progress={uploadProgress} />
          </ProgressBar>
        </Box>
      )}
      
      {uploadStatus === 'success' && (
        <Alert severity="success" sx={{ mt: 2, mb: 3 }}>
          Images uploaded successfully
        </Alert>
      )}
      
      {uploadStatus === 'error' && (
        <Alert severity="error" sx={{ mt: 2, mb: 3 }}>
          Failed to upload images. Please try again.
        </Alert>
      )}
      
      {formData.imageUrls.length > 0 && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, mb: 2 }}>
            <Typography 
              variant="body1" 
              fontWeight={600}
              color="text.primary"
            >
              {formData.imageUrls.length} {formData.imageUrls.length === 1 ? 'image' : 'images'} uploaded
            </Typography>
            {formData.imageUrls.length < 3 && (
              <Typography variant="body2" color="warning.main">
                ⚠️ Add at least 3 images for better visibility
              </Typography>
            )}
          </Box>
          
          <ImageGrid>
            {formData.imageUrls.map((url, index) => (
              <ImageItem key={index} elevation={2}>
                <Box
                  component="img"
                  src={url}
                  alt={`Apartment ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    console.error(`Error loading image: ${url}`);
                    e.target.src = "https://placehold.co/100x100?text=Error";
                  }}
                />
                <DeleteButton 
                  className="delete-button"
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                >
                  <DeleteIcon fontSize="small" />
                </DeleteButton>
              </ImageItem>
            ))}
          </ImageGrid>
        </>
      )}
    </SectionCard>
  );
};

export default ImageUploadSection;