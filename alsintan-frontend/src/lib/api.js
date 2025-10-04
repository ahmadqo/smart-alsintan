// List endpoint backend
export const API_BASE_URL =
  process.env.VITE_API_BASE_URL || "http://alsintan-backend.test/api/v1";

// Function to get absolute URL
export function absoluteUrl(path) {
  return `${API_BASE_URL}${path}`;
}

// Function to get auth token from localStorage
export function getAuthToken() {
  return localStorage.getItem("authToken");
}

// Function to set auth token in localStorage
export function setAuthToken(token) {
  localStorage.setItem("authToken", token);
}

// Function to remove auth token from localStorage
export function removeAuthToken() {
  localStorage.removeItem("authToken");
}

// Function to get auth headers
export function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Function to handle API errors
export function handleApiError(error) {
  if (error.response) {
    // Server responded with a status other than 2xx
    console.error("API Error:", error.response.data);
    throw new Error(error.response.data.message || "API Error");
  } else if (error.request) {
    // Request was made but no response received
    console.error("No response from server:", error.request);
    throw new Error("No response from server");
  } else {
    // Something else happened
    console.error("Error:", error.message);
    throw new Error(error.message);
  }
}
