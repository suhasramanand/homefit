/**
 * Match Highlights Component
 */

import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const MatchHighlights = ({ highlights, primaryColor }) => {
  return (
    <Box mb={3}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Match Highlights
      </Typography>

      <List dense disablePadding>
        {highlights.map((highlight, index) => (
          <ListItem key={index} disableGutters>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <CheckCircleOutlineIcon
                sx={{ color: primaryColor }}
              />
            </ListItemIcon>
            <ListItemText primary={highlight} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MatchHighlights;

