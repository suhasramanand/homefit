/**
 * Similar Properties Component
 */

import React from 'react';
import { handleImageError } from '../../../../utils/imageUtils';
import { Box, Typography, CardMedia } from '@mui/material';
import { formatPriceSimple } from '../../../../utils/formatUtils';

const SimilarProperties = ({ properties, primaryColor, formatImageUrl }) => {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Similar Properties
      </Typography>

      {properties.map((prop, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            mb: 2,
            p: 1,
            borderRadius: 1,
            "&:hover": { bgcolor: "action.hover" },
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 1,
              overflow: "hidden",
              mr: 2,
            }}
          >
            <CardMedia
              component="img"
              image={formatImageUrl(
                prop.imageUrls?.[0] ||
                prop.imageUrl
              )}
              alt={`Property ${index + 1}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={handleImageError}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {prop.bedrooms} BHK in {prop.neighborhood}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {prop.neighborhood}
            </Typography>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color={primaryColor}
            >
              {formatPriceSimple(prop.price)}/mo
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SimilarProperties;

