
export type Apartment = {
  id: string;
  name: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  neighborhood: string;
  address: string;
  amenities: string[];
  images: string[];
  matchScore: number;
  available: string;
};

export const generateMockApartments = (): Apartment[] => {
  return [
    {
      id: '1',
      name: 'Luxury Downtown Loft',
      price: 1950,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 750,
      neighborhood: 'Downtown',
      address: '123 Main St, Seattle, WA 98101',
      amenities: ['In-unit Washer/Dryer', 'Gym', 'Pool', 'Parking'],
      images: [],
      matchScore: 95,
      available: '2025-05-15',
    },
    {
      id: '2',
      name: 'Modern Midtown Apartment',
      price: 2200,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 950,
      neighborhood: 'Midtown',
      address: '456 Park Ave, Seattle, WA 98102',
      amenities: ['In-unit Washer/Dryer', 'Balcony', 'Doorman', 'Gym'],
      images: [],
      matchScore: 92,
      available: '2025-04-30',
    },
    {
      id: '3',
      name: 'Cozy East Side Studio',
      price: 1650,
      bedrooms: 0,
      bathrooms: 1,
      sqft: 550,
      neighborhood: 'East Side',
      address: '789 Oak St, Seattle, WA 98122',
      amenities: ['Parking', 'Air Conditioning'],
      images: [],
      matchScore: 88,
      available: '2025-05-01',
    },
    {
      id: '4',
      name: 'Spacious West End Apartment',
      price: 2600,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1100,
      neighborhood: 'West End',
      address: '101 Pine St, Seattle, WA 98121',
      amenities: ['In-unit Washer/Dryer', 'Gym', 'Pool', 'Parking', 'Balcony', 'Elevator'],
      images: [],
      matchScore: 85,
      available: '2025-04-15',
    },
    {
      id: '5',
      name: 'Riverside Penthouse',
      price: 3200,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1400,
      neighborhood: 'Riverside',
      address: '202 River Rd, Seattle, WA 98109',
      amenities: ['In-unit Washer/Dryer', 'Gym', 'Pool', 'Parking', 'Balcony', 'Doorman', 'Elevator'],
      images: [],
      matchScore: 80,
      available: '2025-05-10',
    },
    {
      id: '6',
      name: 'North Hills Townhouse',
      price: 2400,
      bedrooms: 2,
      bathrooms: 1.5,
      sqft: 1050,
      neighborhood: 'North Hills',
      address: '303 Hill Ave, Seattle, WA 98125',
      amenities: ['In-unit Washer/Dryer', 'Parking', 'Air Conditioning'],
      images: [],
      matchScore: 78,
      available: '2025-04-20',
    },
  ];
};
