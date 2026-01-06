// Mock Data for Static Frontend Version

export const mockUser = {
  _id: "1",
  email: "demo@homefit.com",
  fullName: "Demo User",
  type: "user",
  imagePath: null,
  isApproved: true,
};

export const mockAdmin = {
  _id: "admin1",
  email: "admin@homefit.com",
  fullName: "Admin User",
  type: "admin",
  imagePath: null,
  isApproved: true,
};

export const mockBroker = {
  _id: "broker1",
  email: "broker@homefit.com",
  fullName: "Demo Broker",
  type: "broker",
  imagePath: null,
  isApproved: true,
  licenseNumber: "BR123456",
  companyName: "HomeFit Realty",
};

export const mockApartments = [
  {
    _id: "apt1",
    type: "Apartment",
    bedrooms: "2",
    price: 2500,
    neighborhood: "Downtown",
    amenities: ["Gym", "Parking Space", "Balcony", "In-Unit Laundry", "Dishwasher"],
    style: "Modern",
    floor: "Mid-level Floor",
    moveInDate: new Date("2024-02-01"),
    parking: "Yes",
    transport: "Good",
    sqft: "850",
    safety: "High",
    pets: "Yes",
    view: "City View",
    leaseCapacity: "12 months",
    roommates: "No",
    imageUrls: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    location: {
      coordinates: [-71.0598, 42.3601],
      address: "123 Main St, Boston, MA 02108"
    },
    brokerEmail: "broker@homefit.com",
    broker: "broker1",
    isActive: true,
    approvalStatus: "approved",
    createdAt: new Date("2024-01-15"),
  },
  {
    _id: "apt2",
    type: "Condo",
    bedrooms: "1",
    price: 2000,
    neighborhood: "Back Bay",
    amenities: ["Gym", "Balcony", "Air Conditioning"],
    style: "Contemporary",
    floor: "Top Floor",
    moveInDate: new Date("2024-02-15"),
    parking: "No",
    transport: "Excellent",
    sqft: "650",
    safety: "High",
    pets: "No",
    view: "Street View",
    leaseCapacity: "12 months",
    roommates: "Yes",
    imageUrls: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    location: {
      coordinates: [-71.0814, 42.3496],
      address: "456 Newbury St, Boston, MA 02115"
    },
    brokerEmail: "broker@homefit.com",
    broker: "broker1",
    isActive: true,
    approvalStatus: "approved",
    createdAt: new Date("2024-01-10"),
  },
  {
    _id: "apt3",
    type: "Studio",
    bedrooms: "0",
    price: 1800,
    neighborhood: "Fenway",
    amenities: ["Gym", "Parking Space", "In-Unit Laundry"],
    style: "Modern",
    floor: "Ground Floor",
    moveInDate: new Date("2024-03-01"),
    parking: "Yes",
    transport: "Good",
    sqft: "500",
    safety: "Average",
    pets: "Yes",
    view: "Garden View",
    leaseCapacity: "6 months",
    roommates: "No",
    imageUrls: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    location: {
      coordinates: [-71.0997, 42.3456],
      address: "789 Boylston St, Boston, MA 02115"
    },
    brokerEmail: "broker@homefit.com",
    broker: "broker1",
    isActive: true,
    approvalStatus: "approved",
    createdAt: new Date("2024-01-05"),
  },
  {
    _id: "apt4",
    type: "Apartment",
    bedrooms: "3",
    price: 3500,
    neighborhood: "Cambridge",
    amenities: ["Gym", "Parking Space", "Balcony", "In-Unit Laundry", "Dishwasher", "Air Conditioning"],
    style: "Luxury",
    floor: "Top Floor",
    moveInDate: new Date("2024-01-20"),
    parking: "Yes",
    transport: "Excellent",
    sqft: "1200",
    safety: "High",
    pets: "Yes",
    view: "Water View",
    leaseCapacity: "12 months",
    roommates: "No",
    imageUrls: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aaa4f5b5?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    location: {
      coordinates: [-71.1106, 42.3736],
      address: "321 Mass Ave, Cambridge, MA 02139"
    },
    brokerEmail: "broker@homefit.com",
    broker: "broker1",
    isActive: true,
    approvalStatus: "approved",
    createdAt: new Date("2024-01-12"),
  },
  {
    _id: "apt5",
    type: "Townhouse",
    bedrooms: "2",
    price: 2800,
    neighborhood: "Somerville",
    amenities: ["Parking Space", "Balcony", "In-Unit Laundry", "Dishwasher"],
    style: "Traditional",
    floor: "Ground Floor",
    moveInDate: new Date("2024-02-10"),
    parking: "Yes",
    transport: "Good",
    sqft: "950",
    safety: "High",
    pets: "Yes",
    view: "Park View",
    leaseCapacity: "12 months",
    roommates: "No",
    imageUrls: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
    ],
    location: {
      coordinates: [-71.1000, 42.3876],
      address: "555 Highland Ave, Somerville, MA 02144"
    },
    brokerEmail: "broker@homefit.com",
    broker: "broker1",
    isActive: true,
    approvalStatus: "approved",
    createdAt: new Date("2024-01-18"),
  },
];

export const mockPreference = {
  _id: "pref1",
  userId: "1",
  priceRange: "$2000-$3000",
  bedrooms: "2",
  neighborhood: "Downtown",
  amenities: ["Gym", "Parking Space", "Balcony"],
  style: "Modern",
  floor: "Mid-level Floor",
  moveInDate: new Date("2024-02-01"),
  parking: "Yes",
  transport: "Good",
  sqft: "800-1000",
  safety: "High",
  pets: "Yes",
  view: "City View",
  leaseCapacity: "12 months",
  roommates: "No",
  locationPreference: {
    center: [-71.0598, 42.3601],
    radius: 5
  }
};

export const mockSavedApartments = [mockApartments[0]._id, mockApartments[3]._id];

export const mockInquiries = [
  {
    _id: "inq1",
    apartmentId: "apt1",
    userEmail: "demo@homefit.com",
    brokerEmail: "broker@homefit.com",
    message: "I'm interested in viewing this apartment. When is it available?",
    status: "pending",
    createdAt: new Date("2024-01-20"),
  }
];

export const mockTours = [
  {
    _id: "tour1",
    apartmentId: "apt1",
    userEmail: "demo@homefit.com",
    brokerEmail: "broker@homefit.com",
    tourDate: "2024-02-05",
    tourTime: "14:00",
    status: "pending",
    createdAt: new Date("2024-01-20"),
  }
];

export const mockBrokerStats = {
  totalListings: 5,
  activeListings: 5,
  newInquiries: 1,
  pendingApprovals: 0,
};

export const mockAdminStats = {
  totalUsers: 10,
  totalBrokers: 3,
  pendingBrokers: 1,
  totalListings: 25,
};

