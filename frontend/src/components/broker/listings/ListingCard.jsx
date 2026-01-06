/**
 * Listing Card Component
 * Displays a single listing card in the broker listings grid
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Button,
  Box,
  Divider,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { formatImageUrl } from '../../../utils/imageUtils';
import { formatPriceSimple } from '../../../utils/formatUtils';

dayjs.extend(relativeTime);

const ListingCard = ({
  listing,
  primaryColor,
  isDarkMode,
  onMenuOpen,
  onEditClick,
}) => {
  const theme = useTheme();
  const isPendingApproval = listing.approvalStatus === "pending";

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        border: isDarkMode
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "none",
        transition:
          "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: isDarkMode
            ? "0 8px 24px rgba(0, 0, 0, 0.3)"
            : "0 8px 24px rgba(35, 206, 163, 0.15)",
        },
      }}
    >
      {/* Inactive chip */}
      {listing.isActive === false && (
        <Chip
          label="Inactive"
          color="default"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1,
            backgroundColor: isDarkMode
              ? "rgba(0, 0, 0, 0.6)"
              : "rgba(0, 0, 0, 0.6)",
            color: "white",
          }}
        />
      )}

      {/* Pending approval chip */}
      {isPendingApproval && (
        <Chip
          label="Pending Approval"
          color="warning"
          sx={{
            position: "absolute",
            top: listing.isActive === false ? 45 : 10,
            left: 10,
            zIndex: 1,
          }}
        />
      )}

      {/* Menu button */}
      <IconButton
        aria-label="more"
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
          backgroundColor: isDarkMode
            ? "rgba(0, 0, 0, 0.5)"
            : "rgba(255, 255, 255, 0.8)",
          "&:hover": {
            backgroundColor: isDarkMode
              ? "rgba(0, 0, 0, 0.7)"
              : "rgba(255, 255, 255, 0.9)",
          },
        }}
        onClick={(e) => onMenuOpen(e, listing)}
      >
        <MoreVertIcon />
      </IconButton>

      {/* Card content */}
      <CardActionArea
        component={Link}
        to={`/broker/listings/${listing._id}`}
      >
        <CardMedia
          component="img"
          height="180"
          image={formatImageUrl(listing.imageUrls?.[0])}
          alt={`${listing.bedrooms || 'Apartment'} in ${listing.neighborhood || 'Location'}`}
          sx={{
            opacity:
              listing.isActive && !isPendingApproval ? 1 : 0.7,
          }}
          onError={(e) => {
            console.error(`Error loading image: ${listing.imageUrls?.[0]}`);
            e.target.src = "/images/placeholder.jpg";
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              component="div"
              color="text.primary"
            >
              {formatPriceSimple(listing.price)}
            </Typography>
            <Chip
              label={listing.type || "Rent"}
              size="small"
              sx={{
                backgroundColor:
                  (listing.type || "Rent") === "Rent"
                    ? isDarkMode
                      ? "rgba(35, 206, 163, 0.2)"
                      : "rgba(35, 206, 163, 0.1)"
                    : isDarkMode
                    ? "rgba(249, 199, 79, 0.2)"
                    : "rgba(249, 199, 79, 0.1)",
                color:
                  (listing.type || "Rent") === "Rent"
                    ? primaryColor
                    : theme.palette.warning.main,
                fontWeight: 600,
              }}
            />
          </Box>
          <Typography
            variant="body1"
            color="text.primary"
            gutterBottom
          >
            {listing.bedrooms || 'N/A'} BHK {listing.style || ""} in{" "}
            {listing.neighborhood || 'N/A'}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "text.secondary",
              }}
            >
              <VisibilityOutlinedIcon
                sx={{
                  fontSize: 16,
                  mr: 0.5,
                  color: "text.secondary",
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {listing.views || 0}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "text.secondary",
              }}
            >
              <EmailOutlinedIcon
                sx={{
                  fontSize: 16,
                  mr: 0.5,
                  color: "text.secondary",
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {listing.inquiries || 0}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>

      <Divider />

      {/* Card actions */}
      <CardActions
        sx={{
          justifyContent: "space-between",
          backgroundColor: isDarkMode
            ? "rgba(0, 0, 0, 0.2)"
            : "rgba(0, 0, 0, 0.03)",
          px: 2,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {listing.createdAt ? dayjs(listing.createdAt).fromNow() : 'Recently added'}
        </Typography>
        <Button
          size="small"
          onClick={() => onEditClick(listing._id)}
          startIcon={<EditIcon />}
          sx={{
            color: primaryColor,
            "&:hover": {
              backgroundColor: isDarkMode
                ? "rgba(35, 206, 163, 0.1)"
                : "rgba(35, 206, 163, 0.05)",
            },
          }}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};

export default ListingCard;

