// Mock API Service for Static Frontend
// This intercepts axios calls and returns mock data

import { 
  mockUser, 
  mockAdmin, 
  mockBroker, 
  mockApartments, 
  mockPreference,
  mockSavedApartments,
  mockInquiries,
  mockTours,
  mockBrokerStats,
  mockAdminStats
} from './index';

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Session storage for mock authentication
let mockSession = null;
let mockSavedApts = [...mockSavedApartments];

class MockAPI {
  // Auth endpoints
  async login(email, password) {
    await delay();
    
    if (email === 'admin@homefit.com' && password === 'admin123') {
      mockSession = { ...mockAdmin };
      return { message: 'Login successful', user: mockSession };
    }
    if (email === 'broker@homefit.com' && password === 'broker123') {
      mockSession = { ...mockBroker };
      return { message: 'Login successful', user: mockSession };
    }
    if (email === 'demo@homefit.com' && password === 'user123') {
      mockSession = { ...mockUser };
      return { message: 'Login successful', user: mockSession };
    }
    
    throw { response: { data: { error: 'Invalid email or password' } } };
  }

  async signup(data) {
    await delay();
    const newUser = {
      _id: Date.now().toString(),
      email: data.email,
      fullName: data.fullName,
      type: data.type || 'user',
      imagePath: null,
      isApproved: data.type === 'admin' ? true : (data.type === 'broker' ? false : true),
    };
    mockSession = newUser;
    return { message: 'Signup successful', user: mockSession };
  }

  async logout() {
    await delay();
    mockSession = null;
    return { message: 'Logout successful' };
  }

  async getSession() {
    await delay(100);
    if (!mockSession) {
      throw { response: { status: 401, data: { error: 'Not authenticated' } } };
    }
    return { user: mockSession };
  }

  // User endpoints
  async getUserProfile() {
    await delay();
    if (!mockSession) throw { response: { status: 401 } };
    return { user: mockSession };
  }

  async updateUserProfile(data) {
    await delay();
    if (!mockSession) throw { response: { status: 401 } };
    mockSession = { ...mockSession, ...data };
    return { message: 'Profile updated', user: mockSession };
  }

  // Apartment endpoints
  async getApartments(params = {}) {
    await delay();
    let apartments = [...mockApartments];
    
    // Apply filters
    if (params.search) {
      const search = params.search.toLowerCase();
      apartments = apartments.filter(apt => 
        apt.neighborhood.toLowerCase().includes(search) ||
        apt.type.toLowerCase().includes(search)
      );
    }
    
    if (params.bedrooms) {
      apartments = apartments.filter(apt => apt.bedrooms === params.bedrooms);
    }
    
    if (params.minPrice || params.maxPrice) {
      apartments = apartments.filter(apt => {
        if (params.minPrice && apt.price < params.minPrice) return false;
        if (params.maxPrice && apt.price > params.maxPrice) return false;
        return true;
      });
    }
    
    if (params.neighborhood) {
      apartments = apartments.filter(apt => 
        apt.neighborhood === params.neighborhood
      );
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      apartments: apartments.slice(start, end),
      total: apartments.length,
      page,
      totalPages: Math.ceil(apartments.length / limit),
    };
  }

  async getApartment(id) {
    await delay();
    const apartment = mockApartments.find(apt => apt._id === id);
    if (!apartment) {
      throw { response: { status: 404, data: { error: 'Apartment not found' } } };
    }
    return { apartment };
  }

  // Preference endpoints
  async getUserPreference() {
    await delay();
    if (!mockSession) throw { response: { status: 401 } };
    return { preference: mockPreference };
  }

  async savePreference(data) {
    await delay();
    if (!mockSession) throw { response: { status: 401 } };
    return { message: 'Preference saved', preference: { ...mockPreference, ...data } };
  }

  // Matching endpoints
  async getMatches() {
    await delay();
    // Return apartments with match scores
    const matches = mockApartments.map(apt => ({
      apartment: apt,
      matchScore: Math.floor(Math.random() * 30) + 70, // 70-100%
      explanation: "✅ Matches in: Price, Bedrooms, Neighborhood\n💎 Bonus features: Additional amenities",
    }));
    
    return { matches: matches.sort((a, b) => b.matchScore - a.matchScore) };
  }

  // Saved apartments
  async getSavedApartments() {
    await delay();
    if (!mockSession) throw { response: { status: 401 } };
    const saved = mockApartments.filter(apt => mockSavedApts.includes(apt._id));
    return { apartments: saved };
  }

  async saveApartment(apartmentId) {
    await delay();
    if (!mockSession) throw { response: { status: 401 } };
    if (!mockSavedApts.includes(apartmentId)) {
      mockSavedApts.push(apartmentId);
    }
    return { message: 'Apartment saved' };
  }

  async unsaveApartment(apartmentId) {
    await delay();
    if (!mockSession) throw { response: { status: 401 } };
    mockSavedApts = mockSavedApts.filter(id => id !== apartmentId);
    return { message: 'Apartment unsaved' };
  }

  // Broker endpoints
  async getBrokerProfile() {
    await delay();
    if (!mockSession || mockSession.type !== 'broker') {
      throw { response: { status: 403 } };
    }
    return { ...mockBroker };
  }

  async getBrokerListings() {
    await delay();
    if (!mockSession || mockSession.type !== 'broker') {
      throw { response: { status: 403 } };
    }
    return { listings: mockApartments };
  }

  async getBrokerStats() {
    await delay();
    if (!mockSession || mockSession.type !== 'broker') {
      throw { response: { status: 403 } };
    }
    return mockBrokerStats;
  }

  // Admin endpoints
  async getAdminStats() {
    await delay();
    if (!mockSession || mockSession.type !== 'admin') {
      throw { response: { status: 403 } };
    }
    return mockAdminStats;
  }

  async getAllUsers() {
    await delay();
    if (!mockSession || mockSession.type !== 'admin') {
      throw { response: { status: 403 } };
    }
    return { users: [mockUser, mockBroker, mockAdmin] };
  }

  async getAllBrokers() {
    await delay();
    if (!mockSession || mockSession.type !== 'admin') {
      throw { response: { status: 403 } };
    }
    return { brokers: [mockBroker] };
  }

  // Inquiry endpoints
  async contactBroker(data) {
    await delay();
    if (!mockSession) throw { response: { status: 401 } };
    return { message: 'Message sent successfully' };
  }

  async getInquiries() {
    await delay();
    if (!mockSession) throw { response: { status: 401 } };
    return { inquiries: mockInquiries };
  }

  // Tour endpoints
  async scheduleTour(data) {
    await delay();
    if (!mockSession) throw { response: { status: 401 } };
    const newTour = {
      _id: Date.now().toString(),
      ...data,
      status: 'pending',
      createdAt: new Date(),
    };
    mockTours.push(newTour);
    return { message: 'Tour scheduled successfully', tourId: newTour._id };
  }

  async getUserTours() {
    await delay();
    if (!mockSession) throw { response: { status: 401 } };
    const tours = mockTours.filter(t => t.userEmail === mockSession.email);
    return { tours: tours.map(tour => ({
      ...tour,
      apartmentDetails: mockApartments.find(apt => apt._id === tour.apartmentId) || {},
    })) };
  }

  // System endpoints
  async getMaintenanceStatus() {
    await delay(100);
    return {
      isInMaintenanceMode: false,
      message: '',
      estimatedTime: '',
      lastUpdated: new Date(),
    };
  }
}

const mockAPI = new MockAPI();

// Export helper to get current session
export const getMockSession = () => mockSession;
export const setMockSession = (session) => { mockSession = session; };

export default mockAPI;

