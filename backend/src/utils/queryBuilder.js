/**
 * MongoDB query builder utilities
 */

/**
 * Build MongoDB query from filter parameters for apartment search
 * @param {Object} filters - Filter parameters
 * @returns {Object} - MongoDB query object
 */
function buildApartmentQuery(filters) {
  let query = {};
  const andConditions = [];

  // Apply price filter
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    query.price = {};
    if (filters.minPrice !== null) query.price.$gte = filters.minPrice;
    if (filters.maxPrice !== null) query.price.$lte = filters.maxPrice;
  }

  // Apply bedroom filter
  if (filters.bedrooms && filters.bedrooms.length > 0) {
    const bedroomConditions = [];
    
    // Handle Studio
    if (filters.bedrooms.includes('Studio')) {
      bedroomConditions.push({ bedrooms: '0' });
      bedroomConditions.push({ bedrooms: 'Studio' });
      bedroomConditions.push({ bedrooms: '0 Bedrooms' });
      bedroomConditions.push({ bedrooms: { $regex: /^studio/i } });
    }
    
    // For numeric bedrooms
    filters.bedrooms.forEach(bed => {
      if (bed !== 'Studio') {
        if (bed === '3+') {
          // Match 3, 4, 5, etc. bedrooms
          bedroomConditions.push({ bedrooms: { $regex: /^[3-9]/ } });
          bedroomConditions.push({ bedrooms: { $regex: /^[1-9][0-9]+/ } });
        } else {
          // Match exact number
          bedroomConditions.push({ bedrooms: bed });
          bedroomConditions.push({ bedrooms: { $regex: new RegExp(`^${bed}\\s`, 'i') } });
          bedroomConditions.push({ bedrooms: { $regex: new RegExp(`^${bed}BHK`, 'i') } });
        }
      }
    });
    
    if (bedroomConditions.length > 0) {
      andConditions.push({ $or: bedroomConditions });
    }
  }
  
  // Apply bathroom filter - Note: apartment schema uses 'bathrooms' but data might vary
  if (filters.bathrooms && filters.bathrooms.length > 0) {
    const bathroomConditions = [];
    
    filters.bathrooms.forEach(bath => {
      if (bath === '3+') {
        bathroomConditions.push({ bathrooms: { $regex: /^[3-9]/ } });
        bathroomConditions.push({ bathrooms: { $regex: /^[1-9][0-9]+/ } });
      } else {
        bathroomConditions.push({ bathrooms: bath });
        bathroomConditions.push({ bathrooms: { $regex: new RegExp(`^${bath}\\s`, 'i') } });
      }
    });
    
    if (bathroomConditions.length > 0) {
      andConditions.push({ $or: bathroomConditions });
    }
  }
  
  // Apply neighborhood filter
  if (filters.neighborhoods && filters.neighborhoods.length > 0) {
    // Use case-insensitive regex matching for neighborhoods
    const neighborhoodConditions = filters.neighborhoods.map(n => ({
      neighborhood: { $regex: new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
    }));
    andConditions.push({ $or: neighborhoodConditions });
  }
  
  // Apply amenities filter - check if any of the selected amenities exist in the apartment's amenities array
  if (filters.amenities && filters.amenities.length > 0) {
    // For each selected amenity, check if it exists in the apartment's amenities array
    // Use $elemMatch to match array elements with regex
    const amenityConditions = filters.amenities.map(amenity => {
      // Escape special regex characters but allow flexible matching
      const escaped = amenity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Match the amenity with variations (case-insensitive, handles spaces/dashes)
      const pattern = escaped.replace(/[\s-]/g, '[\\s-]*');
      
      return {
        amenities: { 
          $elemMatch: { $regex: new RegExp(pattern, 'i') }
        }
      };
    });
    
    // At least one amenity must match (OR condition for selected amenities)
    andConditions.push({ $or: amenityConditions });
  }

  // Combine all AND conditions with existing query
  if (andConditions.length > 0) {
    if (Object.keys(query).length > 0) {
      // Merge price filter with other conditions
      const baseQuery = { ...query };
      query = {
        ...baseQuery,
        $and: andConditions
      };
    } else {
      // Only AND conditions, merge directly
      if (andConditions.length === 1) {
        query = { ...andConditions[0] };
      } else {
        query = { $and: andConditions };
      }
    }
  }

  return query;
}

module.exports = {
  buildApartmentQuery
};

