
import { store } from '@/store/store';
import { fetchExplanation } from '@/store/slices/explanationsSlice';

interface Apartment {
  id: string;
  title: string;
  price: number;
  location: {
    city: string;
    neighborhood: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
  };
  amenities: string[];
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

/**
 * Calculate match score between apartment and user preferences
 * @param apartment - The apartment to match
 * @param preferences - User preferences
 * @returns Score between 0-100
 */
export const calculateMatchScore = (apartment: Apartment, preferences: UserPreferences): number => {
  let score = 0;
  const weights = {
    budget: 30,
    location: 25,
    bedrooms: 15,
    bathrooms: 10,
    amenities: 20
  };
  
  // Budget match (30%)
  if (apartment.price >= preferences.budget.min && apartment.price <= preferences.budget.max) {
    // Full score if within budget range
    score += weights.budget;
  } else {
    // Partial score based on how close it is to budget range
    const minDiff = Math.abs(apartment.price - preferences.budget.min) / preferences.budget.min;
    const maxDiff = Math.abs(apartment.price - preferences.budget.max) / preferences.budget.max;
    const closestDiff = Math.min(minDiff, maxDiff);
    
    if (closestDiff <= 0.2) { // Within 20% of budget
      score += weights.budget * (1 - closestDiff);
    }
  }
  
  // Location match (25%)
  if (preferences.location.includes(apartment.location.neighborhood)) {
    score += weights.location;
  } else if (preferences.location.includes(apartment.location.city)) {
    score += weights.location * 0.6; // Partial match for city
  }
  
  // Bedrooms match (15%)
  if (apartment.features.bedrooms === preferences.bedrooms) {
    score += weights.bedrooms;
  } else {
    const bedroomDiff = Math.abs(apartment.features.bedrooms - preferences.bedrooms);
    if (bedroomDiff === 1) {
      score += weights.bedrooms * 0.5; // Half score if off by 1
    }
  }
  
  // Bathrooms match (10%)
  if (apartment.features.bathrooms === preferences.bathrooms) {
    score += weights.bathrooms;
  } else {
    const bathroomDiff = Math.abs(apartment.features.bathrooms - preferences.bathrooms);
    if (bathroomDiff <= 1) {
      score += weights.bathrooms * (1 - bathroomDiff); // Scale based on difference
    }
  }
  
  // Amenities match (20%)
  if (preferences.amenities.length > 0) {
    const amenitiesFound = preferences.amenities.filter(a => 
      apartment.amenities.includes(a)
    ).length;
    
    const amenityScore = amenitiesFound / preferences.amenities.length;
    score += weights.amenities * amenityScore;
  } else {
    score += weights.amenities; // No preferences means full score
  }
  
  return Math.round(score);
};

/**
 * Generate human-readable explanation for the match score
 */
export const getMatchExplanation = async (
  apartment: Apartment, 
  preferences: UserPreferences,
  matchScore: number
): Promise<string> => {
  // Try to get explanation from Redux first
  const state = store.getState();
  const existingExplanation = state.explanations.explanations[apartment.id];
  
  if (existingExplanation) {
    return existingExplanation;
  }
  
  // Dispatch action to fetch and store explanation
  try {
    const action = await store.dispatch(fetchExplanation({
      apartmentId: apartment.id,
      apartment,
      preferences,
      matchScore
    }));
    
    // Access payload using unwrapResult or from the returned action
    if (action.type === fetchExplanation.fulfilled.type) {
      return action.payload;
    } else {
      return generateFallbackExplanation(apartment, preferences, matchScore);
    }
  } catch (error) {
    console.error("Error fetching explanation:", error);
    return generateFallbackExplanation(apartment, preferences, matchScore);
  }
};

/**
 * Generate a basic explanation without AI when the API is unavailable
 */
const generateFallbackExplanation = (
  apartment: Apartment, 
  preferences: UserPreferences,
  matchScore: number
): string => {
  let explanation = '';
  
  if (matchScore >= 80) {
    explanation = `This apartment is an excellent match for you! `;
  } else if (matchScore >= 60) {
    explanation = `This apartment is a good match for you. `;
  } else {
    explanation = `This apartment meets some of your criteria. `;
  }
  
  // Add budget explanation
  if (apartment.price >= preferences.budget.min && apartment.price <= preferences.budget.max) {
    explanation += `The price of $${apartment.price} falls within your budget range. `;
  } else if (apartment.price < preferences.budget.min) {
    explanation += `The price of $${apartment.price} is below your minimum budget of $${preferences.budget.min}. `;
  } else {
    explanation += `The price of $${apartment.price} is above your maximum budget of $${preferences.budget.max}. `;
  }
  
  // Add bedroom/bathroom explanation
  if (apartment.features.bedrooms === preferences.bedrooms) {
    explanation += `It has exactly your preferred number of bedrooms. `;
  } else {
    const diff = apartment.features.bedrooms - preferences.bedrooms;
    explanation += `It has ${diff > 0 ? 'more' : 'fewer'} bedrooms than you preferred. `;
  }
  
  // Add amenity matches
  if (preferences.amenities.length > 0) {
    const matches = preferences.amenities.filter(a => apartment.amenities.includes(a));
    if (matches.length > 0) {
      explanation += `The apartment includes ${matches.length} of your desired amenities. `;
    }
  }
  
  return explanation;
};

export default { calculateMatchScore, getMatchExplanation };
