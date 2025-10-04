// src/services/userService.js
// Service untuk handle API calls terkait user management

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://alsintan-backend.test/api/v1";

// Helper function untuk handle response
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const fetchLogin = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error :", error);
    throw error;
  }
};

// Helper function untuk get auth token
const getAuthToken = () => {
  const user = sessionStorage.getItem("user");
  if (user) {
    const userData = JSON.parse(user);
    return userData.token; // Sesuaikan dengan struktur token Anda
  }
  return null;
};

// Get all users
export const fetchGetUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get single user by ID
export const fetchGetUserById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Create new user
export const fetchCreateUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update user
export const fetchUpdateUser = async (id, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete user
export const fetchDeleteUserById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Change password
export const changePassword = async (id, passwordData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(passwordData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
