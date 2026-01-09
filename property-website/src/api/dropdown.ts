import apiClient from "./apiClient";

// Search locations
export const searchLocation = async (query: string, limit: number = 20) => {
  try {
    const response = await apiClient.post('/api/v1/dropdown/search-location', {
      query,
      limit,
    });
    return response.data;
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
};

// Get location details
export const getLocationDetails = async (data: {
  type: string;
  name: string;
  state: string;
  city: string;
  locality: string;
}) => {
  try {
    const response = await apiClient.post('/api/v1/dropdown/location-details', data);
    return response.data;
  } catch (error) {
    console.error('Error fetching location details:', error);
    throw error;
  }
};

// Save recent search
export const saveRecentSearch = async (data: {
  userId: string;
  name: string;
  type: string;
  displayText: string;
  state: string;
  city?: string;
  locality?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
}) => {
  try {
    const response = await apiClient.post('/api/v1/dropdown/save-recent-search', data);
    return response.data;
  } catch (error) {
    console.error('Error saving recent search:', error);
    throw error;
  }
};

// Get recent searches
export const getRecentSearches = async (userId: string, limit: number = 10) => {
  try {
    const response = await apiClient.post('/api/v1/dropdown/get-recent-searches', {
      userId,
      limit,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recent searches:', error);
    throw error;
  }
};

// Get all states
export const getAllStates = async () => {
  try {
    const response = await apiClient.get('/api/v1/dropdown/get-all-states');
    return response.data;
  } catch (error) {
    console.error('Error fetching all states:', error);
    throw error;
  }
};

// Get popular cities (updated endpoint)
export const getPopularCitiesNew = async () => {
  try {
    const response = await apiClient.get('/api/v1/dropdown/get-popular-cities');
    return response.data;
  } catch (error) {
    console.error('Error fetching popular cities:', error);
    throw error;
  }
};

// Get cities by state
export const getCitiesByState = async (state: string, limit: number = 50) => {
  try {
    const response = await apiClient.post('/api/v1/dropdown/get-cities-by-state', {
      state,
      limit,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cities by state:', error);
    throw error;
  }
};

export const getLocalities = async (city: string, state?: string, search?: string) => {
  try {
    const response = await fetch(
      "https://nextopson.com/api/v1/dropdown/localities",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state, city, search }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching localities:", error);
    return [];
  }
};