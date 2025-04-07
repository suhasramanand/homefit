
import { api } from './api';

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

// Get match explanation using Groq API
export const getMatchExplanation = async (apartment: Apartment, preferences: UserPreferences, matchScore: number): Promise<string> => {
  try {
    // Use Groq API to generate an explanation
    const prompt = `
      I need an explanation for why this apartment is a ${matchScore}% match for a user.
      
      Apartment details:
      - Title: ${apartment.title}
      - Price: $${apartment.price}
      - Location: ${apartment.location.address}, ${apartment.location.city}, ${apartment.location.state}
      - Bedrooms: ${apartment.features.bedrooms}
      - Bathrooms: ${apartment.features.bathrooms}
      - Square Feet: ${apartment.features.squareFeet}
      - Amenities: ${apartment.amenities.join(', ')}
      - Description: ${apartment.description}
      
      User preferences:
      - Budget: $${preferences.budget?.min || 0} - $${preferences.budget?.max || 0}
      - Preferred Locations: ${preferences.location?.join(', ') || 'Any'}
      - Bedrooms: ${preferences.bedrooms || 'Any'}
      - Bathrooms: ${preferences.bathrooms || 'Any'}
      - Desired Amenities: ${preferences.amenities?.join(', ') || 'None specified'}
      
      In 3-4 sentences, explain why this is a ${matchScore}% match. Highlight the strongest matching points and mention any mismatches.
    `;
    
    const explanation = await api.groq.getExplanation(prompt);
    return explanation || generateFallbackExplanation(apartment, preferences, matchScore);
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
