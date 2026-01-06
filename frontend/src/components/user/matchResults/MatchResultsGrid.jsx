/**
 * Match Results Grid Component
 * Displays the grid of match cards
 */

import React from 'react';
import { Grid } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MatchCard from '../../common/theme/MatchCard';

dayjs.extend(relativeTime);

const MatchResultsGrid = ({
  matches,
  activeSteps,
  savedApartments,
  onStepChange,
  onSaveToggle,
  getMatchColor,
}) => {
  return (
    <Grid 
      container 
      spacing={2} 
      sx={{ 
        mt: 0.5,
        width: '100%',
      }}
    >
      {matches.map((match) => {
        const apt = match.apartment;
        const currentStep = activeSteps[apt._id] || 0;
        const gallery = apt.imageUrls || [apt.imageUrl];
        const createdAt = dayjs(apt.createdAt).fromNow();
        const matchScore = Math.round(match.matchScore);
        const matchColor = getMatchColor(matchScore);
        const isSaved = savedApartments[apt._id] || false;

        return (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            lg={4}
            xl={3}
            key={apt._id}
            sx={{
              display: 'flex',
              width: '100%',
            }}
          >
            <MatchCard
              apt={apt}
              matchScore={matchScore}
              currentStep={currentStep}
              gallery={gallery}
              createdAt={createdAt}
              matchColor={matchColor}
              onStepChange={(dir) => onStepChange(apt._id, dir)}
              explanation={match.explanation}
              isSaved={isSaved}
              onSaveToggle={onSaveToggle}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default MatchResultsGrid;

