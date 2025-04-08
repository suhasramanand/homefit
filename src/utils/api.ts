// API base URL from environment variable or fallback to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
};

export const api = {
  auth: {
    register: async (userData: any) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
      return handleResponse(response);
    },
    login: async (credentials: any) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      return handleResponse(response);
    },
    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      return handleResponse(response);
    },
    check: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/check`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },
  apartments: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/apartments`);
      return handleResponse(response);
    },
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/apartments/${id}`);
      return handleResponse(response);
    },
    create: async (apartmentData: any) => {
      const response = await fetch(`${API_BASE_URL}/apartments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apartmentData),
        credentials: 'include',
      });
      return handleResponse(response);
    },
    update: async (id: string, apartmentData: any) => {
      const response = await fetch(`${API_BASE_URL}/apartments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apartmentData),
        credentials: 'include',
      });
      return handleResponse(response);
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/apartments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return handleResponse(response);
    },
    uploadImage: async (formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/apartments/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      return handleResponse(response);
    },
    getAIRecommendations: async (preferences: any) => {
      const response = await fetch(`${API_BASE_URL}/ai/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },
  user: {
    getProfile: async () => {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
    updateProfile: async (profileData: any) => {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        credentials: 'include',
      });
      return handleResponse(response);
    },
    updatePassword: async (passwords: any) => {
      const response = await fetch(`${API_BASE_URL}/users/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwords),
        credentials: 'include',
      });
      return handleResponse(response);
    },
    uploadAvatar: async (formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/users/upload-avatar`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      return handleResponse(response);
    },
    getFavorites: async () => {
      const response = await fetch(`${API_BASE_URL}/users/favorites`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
    addFavorite: async (apartmentId: string) => {
      const response = await fetch(`${API_BASE_URL}/users/favorites/${apartmentId}`, {
        method: 'POST',
        credentials: 'include',
      });
      return handleResponse(response);
    },
    removeFavorite: async (apartmentId: string) => {
      const response = await fetch(`${API_BASE_URL}/users/favorites/${apartmentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },
  admin: {
    getAllBrokers: async (status = 'all') => {
      const response = await fetch(`${API_BASE_URL}/brokers?status=${status}`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
    approveBroker: async (brokerId: string) => {
      const response = await fetch(`${API_BASE_URL}/brokers/approve/${brokerId}`, {
        method: 'PUT',
        credentials: 'include',
      });
      return handleResponse(response);
    },
    rejectBroker: async (brokerId: string, reason: string) => {
      const response = await fetch(`${API_BASE_URL}/brokers/reject/${brokerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
        credentials: 'include',
      });
      return handleResponse(response);
    },
    revokeBroker: async (brokerId: string, reason: string) => {
      const response = await fetch(`${API_BASE_URL}/brokers/revoke/${brokerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
        credentials: 'include',
      });
      return handleResponse(response);
    },
    getAllUsers: async () => {
      const response = await fetch(`${API_BASE_URL}/users`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
  }
};
