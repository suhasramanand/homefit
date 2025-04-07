import { api } from './api';
import { store } from '../store/store';
import { getMatchExplanation } from '../store/slices/explanationsSlice';

interface Apartment {
  id: string;
  title: string;
  price: number;
  location: {
    city: string;
    state: string;
    address: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
  };
  amenities: string[];
  description: string;
}

interface UserPreferences {
  budget: {
    min: number;
    max: number;
  };
  location: string[];
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
}

// Calculate match score between an apartment and user preferences
export const calculateMatchScore = (apartment: Apartment, preferences: UserPreferences): number => {
  let score = 0;
  let maxScore = 0;
  
  // Budget match (25%)
  maxScore += 25;
  if (preferences.budget) {
    // Perfect match if within 10% of preferred max
    if (apartment.price <= preferences.budget.max) {
      const budgetRatio = apartment.price / preferences.budget.max;
      // Higher score if price is well within budget
      if (budgetRatio <= 0.8) {
        score += 25; // Perfect budget match
      } else {
        // Score decreases as price approaches max budget
        score += 25 * (1 - ((budgetRatio - 0.8) / 0.2));
      }
    }
  }
  
  // Location match (25%)
  maxScore += 25;
  if (preferences.location && preferences.location.length > 0) {
    // Check if apartment location matches any preferred location
    const locationMatches = preferences.location.some(location => {
      const lowerLocation = location.toLowerCase();
      return (
        apartment.location.city.toLowerCase().includes(lowerLocation) ||
        apartment.location.state.toLowerCase().includes(lowerLocation) ||
        apartment.location.address.toLowerCase().includes(lowerLocation)
      );
    });
    
    if (locationMatches) {
      score += 25;
    }
  }
  
  // Bedrooms match (15%)
  maxScore += 15;
  if (preferences.bedrooms) {
    if (apartment.features.bedrooms >= preferences.bedrooms) {
      // Perfect match if exact or more bedrooms
      score += 15;
    } else {
      // Partial match if fewer bedrooms
      score += 15 * (apartment.features.bedrooms / preferences.bedrooms);
    }
  }
  
  // Bathrooms match (10%)
  maxScore += 10;
  if (preferences.bathrooms) {
    if (apartment.features.bathrooms >= preferences.bathrooms) {
      // Perfect match if exact or more bathrooms
      score += 10;
    } else {
      // Partial match if fewer bathrooms
      score += 10 * (apartment.features.bathrooms / preferences.bathrooms);
    }
  }
  
  // Amenities match (25%)
  maxScore += 25;
  if (preferences.amenities && preferences.amenities.length > 0) {
    const matchingAmenities = preferences.amenities.filter(amenity => 
      apartment.amenities.includes(amenity)
    );
    
    const amenityScore = (matchingAmenities.length / preferences.amenities.length) * 25;
    score += amenityScore;
  }
  
  // Calculate percentage score (0-100)
  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
};

// Generate a unique cache key for an apartment and preferences combination
const generateCacheKey = (apartment: Apartment, preferences: UserPreferences): string => {
  // Create a deterministic cache key based on apartment ID and preference values
  const prefsKey = JSON.stringify({
    budgetMin: preferences.budget?.min,
    budgetMax: preferences.budget?.max,
    locations: preferences.location?.join(','),
    bedrooms: preferences.bedrooms,
    bathrooms: preferences.bathrooms,
    amenities: preferences.amenities?.join(',')
  });
  
  // Create a hash of the preferences
  let prefsHash = 0;
  for (let i = 0; i < prefsKey.length; i++) {
    prefsHash = ((prefsHash << 5) - prefsHash) + prefsKey.charCodeAt(i);
    prefsHash = prefsHash & prefsHash; // Convert to 32bit integer
  }
  
  return `${apartment.id}_${prefsHash}`;
};

// Get match explanation using Groq API with Redis caching and rate limiting
export const getMatchExplanation = async (apartment: Apartment, preferences: UserPreferences, matchScore: number): Promise<string> => {
  try {
    const cacheKey = generateCacheKey(apartment, preferences);
    
    // Check if we already have this explanation in the Redux store
    const explanations = store.getState().explanations.explanations;
    if (explanations[cacheKey]) {
      return explanations[cacheKey];
    }
    
    // Check rate limit info before making request
    const { remaining, resetTime } = store.getState().explanations.rateLimit;
    
    if (remaining <= 0 && resetTime && resetTime > Date.now()) {
      const minutes = Math.ceil((resetTime - Date.now()) / (1000 * 60));
      return `Rate limit reached. Please try again in approximately ${minutes} minute${minutes !== 1 ? 's' : ''}.`;
    }
    
    // Dispatch the async thunk to get the explanation
    const resultAction = await store.dispatch(
      getMatchExplanation({
        apartment,
        preferences,
        matchScore,
        cacheKey
      })
    );
    
    if (getMatchExplanation.fulfilled.match(resultAction)) {
      return resultAction.payload.explanation;
    } else {
      // If we hit an error, return a fallback explanation
      return generateFallbackExplanation(apartment, preferences, matchScore);
    }
  } catch (error) {
    console.error('Error getting match explanation:', error);
    return generateFallbackExplanation(apartment, preferences, matchScore);
  }
};

// Fallback explanation generator if API call fails
const generateFallbackExplanation = (apartment: Apartment, preferences: UserPreferences, matchScore: number): string => {
  const matchLevel = 
    matchScore >= 90 ? 'excellent' :
    matchScore >= 75 ? 'strong' :
    matchScore >= 60 ? 'good' :
    matchScore >= 40 ? 'moderate' :
    'limited';
  
  let explanation = `This apartment is a ${matchLevel} match (${matchScore}%) based on your preferences.`;
  
  // Add budget comment
  if (preferences.budget) {
    if (apartment.price <= preferences.budget.max) {
      explanation += ` The price of $${apartment.price} fits within your budget range.`;
    } else {
      explanation += ` The price of $${apartment.price} exceeds your maximum budget of $${preferences.budget.max}.`;
    }
  }
  
  // Add location comment if specified
  if (preferences.location && preferences.location.length > 0) {
    const locationMatches = preferences.location.some(location => {
      const lowerLocation = location.toLowerCase();
      return (
        apartment.location.city.toLowerCase().includes(lowerLocation) ||
        apartment.location.state.toLowerCase().includes(lowerLocation)
      );
    });
    
    if (locationMatches) {
      explanation += ` The location matches your preferred area.`;
    } else {
      explanation += ` The location is different from your preferred areas.`;
    }
  }
  
  // Add bedroom/bathroom comment
  if (preferences.bedrooms || preferences.bathrooms) {
    explanation += ` It offers ${apartment.features.bedrooms} bedrooms and ${apartment.features.bathrooms} bathrooms`;
    
    if (preferences.bedrooms && apartment.features.bedrooms < preferences.bedrooms) {
      explanation += ` (you preferred at least ${preferences.bedrooms} bedrooms)`;
    }
    
    explanation += '.';
  }
  
  return explanation;
};
