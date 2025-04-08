
import { Apartment } from '@/types';
import { UserPreferences } from '@/types';
import { MatchExplanation } from '@/types';
import { setExplanation } from '@/store/slices/explanationsSlice';
import { getCache, setCache } from './redisCache';
import { api } from './api';

// Calculate matching score between user preferences and apartment
export const calculateMatchScore = async (apartment: Apartment, userPreferences: UserPreferences, dispatch: any) => {
  try {
    // Check if explanation exists in Redis cache
    const cacheKey = `explanation_${apartment.id}`;
    const cachedExplanation = await getCache(cacheKey);
    
    if (cachedExplanation) {
      dispatch(setExplanation({ 
        key: apartment.id, 
        explanation: cachedExplanation 
      }));
      return parseFloat(cachedExplanation.score || "0");
    }
    
    // Basic scoring algorithm
    let score = 0;
    const maxScore = 100;
    const explanations: string[] = [];
    
    // Location match (highest weight)
    if (apartment.location === userPreferences.location) {
      score += 30;
      explanations.push("✓ Perfect location match");
    } else if (apartment.neighborhood && userPreferences.neighborhoods?.includes(apartment.neighborhood)) {
      score += 20;
      explanations.push("✓ Preferred neighborhood");
    } else {
      explanations.push("✗ Location is not in your preferred areas");
    }
    
    // Price match
    const priceMin = userPreferences.priceRange?.[0] || 0;
    const priceMax = userPreferences.priceRange?.[1] || 10000;
    
    if (apartment.price >= priceMin && apartment.price <= priceMax) {
      score += 20;
      explanations.push("✓ Within your budget");
    } else if (apartment.price < priceMin) {
      score += 15;
      explanations.push("✓ Below your budget");
    } else {
      const overBudgetPercent = ((apartment.price - priceMax) / priceMax) * 100;
      if (overBudgetPercent <= 10) {
        score += 10;
        explanations.push(`✗ Slightly over budget (${Math.round(overBudgetPercent)}% above max)`);
      } else {
        explanations.push(`✗ Over budget (${Math.round(overBudgetPercent)}% above max)`);
      }
    }
    
    // Bedrooms match
    if (apartment.bedrooms === userPreferences.bedrooms) {
      score += 15;
      explanations.push("✓ Exact number of bedrooms");
    } else if (apartment.bedrooms > userPreferences.bedrooms!) {
      score += 10;
      explanations.push(`✓ More bedrooms than requested (${apartment.bedrooms} vs ${userPreferences.bedrooms})`);
    } else {
      explanations.push(`✗ Fewer bedrooms than requested (${apartment.bedrooms} vs ${userPreferences.bedrooms})`);
    }
    
    // Bathrooms match
    if (apartment.bathrooms >= userPreferences.bathrooms!) {
      score += 10;
      explanations.push("✓ Sufficient bathrooms");
    } else {
      explanations.push(`✗ Fewer bathrooms than preferred (${apartment.bathrooms} vs ${userPreferences.bathrooms})`);
    }
    
    // Amenities match
    if (userPreferences.amenities && apartment.amenities) {
      const matchedAmenities = userPreferences.amenities.filter(amenity => 
        apartment.amenities.includes(amenity)
      );
      
      const amenityScore = Math.min(15, matchedAmenities.length * 3);
      score += amenityScore;
      
      if (matchedAmenities.length > 0) {
        explanations.push(`✓ Has ${matchedAmenities.length} of your preferred amenities`);
      } else {
        explanations.push("✗ Missing your preferred amenities");
      }
    }
    
    // Pet friendly
    if (userPreferences.petFriendly && apartment.petFriendly) {
      score += 10;
      explanations.push("✓ Pet friendly");
    } else if (userPreferences.petFriendly && !apartment.petFriendly) {
      explanations.push("✗ Not pet friendly");
    }
    
    // Normalize score
    const normalizedScore = Math.min(Math.max(Math.round(score), 0), maxScore);
    
    // Create explanation object
    const explanation: MatchExplanation = {
      score: normalizedScore.toString(),
      breakdown: explanations,
      matchDetails: {
        location: apartment.location === userPreferences.location,
        price: apartment.price >= priceMin && apartment.price <= priceMax,
        bedrooms: apartment.bedrooms >= (userPreferences.bedrooms || 0),
        bathrooms: apartment.bathrooms >= (userPreferences.bathrooms || 0),
        petFriendly: !userPreferences.petFriendly || apartment.petFriendly
      }
    };
    
    // Cache the explanation in Redis
    await setCache(cacheKey, explanation);
    
    // Update Redux store with properly typed explanation
    // The type mismatch is here - we need to make sure the types align with what explanationsSlice expects
    dispatch(setExplanation({ 
      key: apartment.id, 
      explanation: explanation // This should match the expected type in the slice
    }));
    
    return normalizedScore;
  } catch (error) {
    console.error('Error calculating match score:', error);
    return 0;
  }
};
