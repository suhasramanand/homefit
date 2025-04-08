
// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'broker' | 'admin';
  avatar?: string;
  phone?: string;
  createdAt?: string;
  lastLogin?: string;
  savedApartments?: string[];
  preferences?: UserPreferences;
  brokerVerification?: BrokerVerification;
}

export interface BrokerVerification {
  status: 'pending' | 'approved' | 'rejected';
  licenseNumber?: string;
  licenseDocument?: string;
  companyName?: string;
  businessAddress?: string;
  yearsOfExperience?: number;
  specializations?: string[];
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  bio?: string;
}

// Apartment types
export interface Apartment {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  neighborhood?: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  amenities: string[];
  images: string[];
  petFriendly: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  brokerId: string;
  brokerName?: string;
  brokerContact?: string;
  featured?: boolean;
}

// User preferences
export interface UserPreferences {
  priceRange?: [number, number];
  location?: string;
  neighborhoods?: string[];
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  petFriendly?: boolean;
  squareFeetRange?: [number, number];
}

// Explanation from match scoring
export interface MatchExplanation {
  score: string;
  breakdown: string[];
  matchDetails: {
    location: boolean;
    price: boolean;
    bedrooms: boolean;
    bathrooms: boolean;
    petFriendly: boolean;
  };
}
