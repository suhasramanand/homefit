/**
 * AI Match Analysis Tab
 * Shows detailed match analysis comparing apartment with user preferences
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DiamondIcon from '@mui/icons-material/Diamond';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';

const MatchAnalysisTab = ({ apartment, matchScore, primaryColor = "#00b386" }) => {
  const theme = useTheme();
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const matches = [];
  const mismatches = [];
  const bonuses = [];
  const partialMatches = [];

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4000/api/user/preferences/latest",
          { withCredentials: true }
        );
        
        if (response.data?.preference) {
          setPreferences(response.data.preference);
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          setError("Failed to load your preferences. Match analysis may be incomplete.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (apartment) {
      fetchPreferences();
    }
  }, [apartment]);

  // Parse explanation if available
  if (apartment?.explanation) {
    const lines = apartment.explanation.split('\n').filter(Boolean);
    
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('✅')) {
        const text = trimmed.substring(1).trim();
        if (text.toLowerCase().includes('matches in:') || text.toLowerCase().includes('matched:')) {
          // Extract items after "Matches in:" or "Matched:"
          const items = text.split(/[:/]/).slice(1).join('').split(',').map(i => i.trim()).filter(Boolean);
          matches.push(...items);
        } else {
          matches.push(text);
        }
      } else if (trimmed.startsWith('❌')) {
        const text = trimmed.substring(1).trim();
        if (text.toLowerCase().includes('missing:') || text.toLowerCase().includes('mismatched:')) {
          const items = text.split(/[:/]/).slice(1).join('').split(',').map(i => i.trim()).filter(Boolean);
          mismatches.push(...items);
        } else {
          mismatches.push(text);
        }
      } else if (trimmed.startsWith('💎')) {
        const text = trimmed.substring(1).trim();
        if (text.toLowerCase().includes('bonus') || text.toLowerCase().includes('better')) {
          const items = text.split(/[:/]/).slice(1).join('').split(',').map(i => i.trim()).filter(Boolean);
          bonuses.push(...items);
        } else {
          bonuses.push(text);
        }
      } else if (trimmed.startsWith('🟡')) {
        const text = trimmed.substring(1).trim();
        if (text.toLowerCase().includes('partial')) {
          const items = text.split(/[:/]/).slice(1).join('').split(',').map(i => i.trim()).filter(Boolean);
          partialMatches.push(...items);
        } else {
          partialMatches.push(text);
        }
      }
    });
  }

  // If no explanation, generate detailed comparison
  if (!apartment?.explanation && preferences) {
    // Compare price with detailed breakdown
    if (apartment.price) {
      const prefPrice = preferences.budget || preferences.priceRange;
      if (prefPrice) {
        if (typeof prefPrice === 'string' && prefPrice.includes('-')) {
          // Parse "3000-4000" format
          const [min, max] = prefPrice.split('-').map(p => parseInt(p.trim()));
          if (!isNaN(min) && !isNaN(max)) {
            if (apartment.price >= min && apartment.price <= max) {
              matches.push(`Within your budget range ($${min.toLocaleString()}-$${max.toLocaleString()})`);
            } else if (apartment.price > max) {
              const over = apartment.price - max;
              partialMatches.push(`Price exceeds budget by $${over.toLocaleString()}/mo ($${apartment.price.toLocaleString()} vs $${max.toLocaleString()} max)`);
            } else {
              const under = min - apartment.price;
              bonuses.push(`Price below budget by $${under.toLocaleString()}/mo ($${apartment.price.toLocaleString()} vs $${min.toLocaleString()} min)`);
            }
          }
        } else if (Array.isArray(prefPrice)) {
          if (apartment.price >= prefPrice[0] && apartment.price <= prefPrice[1]) {
            matches.push(`Within your budget range ($${prefPrice[0].toLocaleString()}-$${prefPrice[1].toLocaleString()})`);
          } else if (apartment.price > prefPrice[1]) {
            const over = apartment.price - prefPrice[1];
            partialMatches.push(`Price exceeds budget by $${over.toLocaleString()}/mo`);
          } else {
            const under = prefPrice[0] - apartment.price;
            bonuses.push(`Price below budget by $${under.toLocaleString()}/mo`);
          }
        } else if (typeof prefPrice === 'number' && apartment.price <= prefPrice) {
          matches.push(`Within your budget ($${apartment.price.toLocaleString()} ≤ $${prefPrice.toLocaleString()})`);
        } else if (typeof prefPrice === 'number') {
          partialMatches.push(`Price exceeds budget ($${apartment.price.toLocaleString()} > $${prefPrice.toLocaleString()})`);
        }
      }
    }

    // Compare bedrooms with detailed breakdown
    if (apartment.bedrooms && preferences.bedrooms) {
      // Handle "Studio" and "0" as 0 bedrooms
      const aptBedroomsStr = String(apartment.bedrooms).toLowerCase();
      const aptBedrooms = aptBedroomsStr.includes('studio') || aptBedroomsStr === '0' ? 0 : parseInt(apartment.bedrooms) || 0;
      
      const prefBedroomsStr = String(preferences.bedrooms).toLowerCase();
      const prefBedrooms = prefBedroomsStr.includes('studio') || prefBedroomsStr === '0' ? 0 : parseInt(preferences.bedrooms) || 0;
      
      if (aptBedrooms >= prefBedrooms) {
        if (aptBedrooms > prefBedrooms) {
          bonuses.push(`Has ${aptBedrooms === 0 ? 'Studio' : `${aptBedrooms} BHK`} (you wanted ${prefBedrooms === 0 ? 'Studio' : `${prefBedrooms} BHK`}) - Bonus space!`);
        } else {
          matches.push(`Has your required ${aptBedrooms === 0 ? 'Studio' : `${aptBedrooms} BHK`}`);
        }
      } else {
        mismatches.push(`Only ${aptBedrooms === 0 ? 'Studio' : `${aptBedrooms} BHK`} (you wanted ${prefBedrooms === 0 ? 'Studio' : `${prefBedrooms} BHK`})`);
      }
    }

    // Compare neighborhood with detailed breakdown
    if (apartment.neighborhood && preferences.neighborhood) {
      const aptNeighborhood = apartment.neighborhood.toLowerCase().trim();
      const prefNeighborhood = preferences.neighborhood.toLowerCase().trim();
      
      if (aptNeighborhood === prefNeighborhood) {
        matches.push(`In your preferred neighborhood: ${apartment.neighborhood}`);
      } else {
        partialMatches.push(`Neighborhood: ${apartment.neighborhood} (you preferred: ${preferences.neighborhood})`);
      }
    }

    // Compare amenities with detailed breakdown
    if (preferences.amenities && Array.isArray(preferences.amenities) && preferences.amenities.length > 0) {
      const aptAmenities = (apartment.amenities || []).map(a => a.toLowerCase().trim());
      const prefAmenities = preferences.amenities.map(a => a.toLowerCase().trim());
      
      const matchedAmenities = prefAmenities.filter(pref => 
        aptAmenities.some(apt => 
          apt.includes(pref) || pref.includes(apt) || 
          apt === pref
        )
      );
      
      const missingAmenities = prefAmenities.filter(pref => 
        !aptAmenities.some(apt => 
          apt.includes(pref) || pref.includes(apt) || 
          apt === pref
        )
      );
      
      if (matchedAmenities.length === prefAmenities.length) {
        matches.push(`Has all your desired amenities (${matchedAmenities.length})`);
      } else if (matchedAmenities.length > 0) {
        const matchPercent = Math.round((matchedAmenities.length / prefAmenities.length) * 100);
        partialMatches.push(`Has ${matchedAmenities.length} of ${prefAmenities.length} preferred amenities (${matchPercent}%)`);
        if (missingAmenities.length > 0) {
          mismatches.push(`Missing: ${missingAmenities.map(a => preferences.amenities.find(p => p.toLowerCase().trim() === a)).filter(Boolean).join(', ')}`);
        }
      } else {
        mismatches.push(`Missing all preferred amenities`);
      }
    }

    // Compare move-in date
    if (apartment.moveInDate && preferences.moveInDate) {
      const aptDate = new Date(apartment.moveInDate);
      const prefDate = new Date(preferences.moveInDate);
      const daysDiff = Math.ceil((aptDate - prefDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 30 && daysDiff >= -30) {
        matches.push(`Available within your timeframe (${daysDiff > 0 ? `${daysDiff} days after` : `${Math.abs(daysDiff)} days before`} preferred date)`);
      } else if (daysDiff > 30) {
        partialMatches.push(`Available ${daysDiff} days after your preferred move-in date`);
      } else {
        bonuses.push(`Available ${Math.abs(daysDiff)} days before your preferred move-in date - Early availability!`);
      }
    }

    // Compare other features
    const featureComparisons = [
      { apt: apartment.parking, pref: preferences.parking, label: 'Parking' },
      { apt: apartment.transport, pref: preferences.transport, label: 'Transport' },
      { apt: apartment.safety, pref: preferences.safety, label: 'Safety' },
      { apt: apartment.pets, pref: preferences.pets, label: 'Pets' },
      { apt: apartment.view, pref: preferences.view, label: 'View' },
      { apt: apartment.style, pref: preferences.style, label: 'Style' },
    ];

    featureComparisons.forEach(({ apt, pref, label }) => {
      if (apt && pref) {
        const aptLower = String(apt).toLowerCase().trim();
        const prefLower = String(pref).toLowerCase().trim();
        
        if (aptLower === prefLower) {
          matches.push(`${label}: ${apt}`);
        } else if (prefLower.includes('excellent') && (aptLower.includes('good') || aptLower.includes('excellent'))) {
          partialMatches.push(`${label}: ${apt} (you preferred: ${pref})`);
        } else if (prefLower.includes('no') && aptLower.includes('yes')) {
          bonuses.push(`${label}: ${apt} (bonus feature)`);
        } else if (prefLower.includes('yes') && aptLower.includes('no')) {
          mismatches.push(`${label}: ${apt} (you wanted: ${pref})`);
        } else {
          partialMatches.push(`${label}: ${apt} (you preferred: ${pref})`);
        }
      }
    });
  }

  const renderMatchSection = (title, items, icon, color, bgColor) => {
    if (items.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: bgColor,
              mr: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { color, fontSize: '1.5rem' } })}
          </Box>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            {title}
          </Typography>
          <Chip
            label={items.length}
            size="small"
            sx={{
              ml: 'auto',
              bgcolor: color,
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: theme.palette.mode === 'light' ? `${color}08` : `${color}15`,
            border: `1px solid ${color}30`,
            borderRadius: 2,
          }}
        >
          <List dense disablePadding>
            {items.map((item, index) => (
              <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {React.cloneElement(icon, { sx: { color, fontSize: '1.25rem' } })}
                </ListItemIcon>
                <ListItemText
                  primary={item}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: 'text.primary',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: primaryColor }} />
      </Box>
    );
  }

  if (!apartment) return null;

  return (
    <Box>
      {/* Header with match score */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
          AI Match Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Detailed breakdown of how this apartment matches your preferences
        </Typography>
        {matchScore !== undefined && matchScore > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 3,
                py: 1.5,
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'light' ? `${primaryColor}15` : `${primaryColor}25`,
                border: `2px solid ${primaryColor}40`,
                boxShadow: theme.palette.mode === 'light' 
                  ? `0 4px 12px ${primaryColor}20` 
                  : `0 4px 12px ${primaryColor}30`,
              }}
            >
              <Typography variant="h3" fontWeight={800} sx={{ color: primaryColor, mr: 1.5 }}>
                {matchScore}%
              </Typography>
              <Typography variant="body1" fontWeight={600} color="text.primary">
                Overall Match Score
              </Typography>
            </Box>
            
            {/* Quick stats */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {matches.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircleIcon sx={{ color: primaryColor, fontSize: '1.2rem' }} />
                  <Typography variant="body2" fontWeight={600}>
                    {matches.length} Perfect
                  </Typography>
                </Box>
              )}
              {bonuses.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <DiamondIcon sx={{ color: '#9C27B0', fontSize: '1.2rem' }} />
                  <Typography variant="body2" fontWeight={600}>
                    {bonuses.length} Bonus
                  </Typography>
                </Box>
              )}
              {partialMatches.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WarningIcon sx={{ color: '#FF9800', fontSize: '1.2rem' }} />
                  <Typography variant="body2" fontWeight={600}>
                    {partialMatches.length} Partial
                  </Typography>
                </Box>
              )}
              {mismatches.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CancelIcon sx={{ color: '#F44336', fontSize: '1.2rem' }} />
                  <Typography variant="body2" fontWeight={600}>
                    {mismatches.length} Mismatch
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Matches */}
      {renderMatchSection(
        'Perfect Matches',
        matches,
        <CheckCircleIcon />,
        primaryColor,
        theme.palette.mode === 'light' ? `${primaryColor}20` : `${primaryColor}30`
      )}

      {/* Bonuses */}
      {renderMatchSection(
        'Bonus Features',
        bonuses,
        <DiamondIcon />,
        '#9C27B0',
        theme.palette.mode === 'light' ? '#9C27B020' : '#9C27B030'
      )}

      {/* Partial Matches */}
      {renderMatchSection(
        'Partial Matches',
        partialMatches,
        <WarningIcon />,
        '#FF9800',
        theme.palette.mode === 'light' ? '#FF980020' : '#FF980030'
      )}

      {/* Mismatches */}
      {renderMatchSection(
        'Mismatches',
        mismatches,
        <CancelIcon />,
        '#F44336',
        theme.palette.mode === 'light' ? '#F4433620' : '#F4433630'
      )}

      {/* Match Summary Chart */}
      {matches.length > 0 || bonuses.length > 0 || partialMatches.length > 0 || mismatches.length > 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            bgcolor: theme.palette.mode === 'light' ? '#f9fafb' : '#1e1e1e',
            borderRadius: 2,
            border: `1px solid ${theme.palette.mode === 'light' ? '#e5e7eb' : '#333'}`,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
            Match Breakdown
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {matches.length > 0 && (
              <Box
                sx={{
                  flex: 1,
                  minWidth: 120,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: `${primaryColor}15`,
                  border: `1px solid ${primaryColor}30`,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" fontWeight={700} sx={{ color: primaryColor }}>
                  {matches.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Perfect Matches
                </Typography>
              </Box>
            )}
            {bonuses.length > 0 && (
              <Box
                sx={{
                  flex: 1,
                  minWidth: 120,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#9C27B015',
                  border: '1px solid #9C27B030',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" fontWeight={700} sx={{ color: '#9C27B0' }}>
                  {bonuses.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Bonus Features
                </Typography>
              </Box>
            )}
            {partialMatches.length > 0 && (
              <Box
                sx={{
                  flex: 1,
                  minWidth: 120,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#FF980015',
                  border: '1px solid #FF980030',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" fontWeight={700} sx={{ color: '#FF9800' }}>
                  {partialMatches.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Partial Matches
                </Typography>
              </Box>
            )}
            {mismatches.length > 0 && (
              <Box
                sx={{
                  flex: 1,
                  minWidth: 120,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#F4433615',
                  border: '1px solid #F4433630',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" fontWeight={700} sx={{ color: '#F44336' }}>
                  {mismatches.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Mismatches
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      ) : null}

      {/* Empty state */}
      {matches.length === 0 && bonuses.length === 0 && partialMatches.length === 0 && mismatches.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: theme.palette.mode === 'light' ? '#f5f5f5' : '#1a1a1a',
            borderRadius: 2,
          }}
        >
          <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            {apartment.explanation 
              ? "No detailed match analysis available for this apartment."
              : "Match analysis will appear here once you set your preferences."}
          </Typography>
        </Paper>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Additional info */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" color="text.secondary">
          This analysis is generated based on your saved preferences and the apartment's features.
          {!preferences && " Set your preferences to get personalized match analysis."}
        </Typography>
      </Box>
    </Box>
  );
};

export default MatchAnalysisTab;

