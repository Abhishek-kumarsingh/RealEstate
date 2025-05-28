// API utility functions for frontend

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.CORS_URL
    : "http://localhost:3000";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

// Get token from localStorage
function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const { method = "GET", headers = {}, body } = options;

  // Use provided token or get from localStorage
  const token = options.token || getStoredToken();

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Network error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  register: (name: string, email: string, password: string, role = "user") =>
    apiRequest("/auth/register", {
      method: "POST",
      body: { name, email, password, role },
    }),

  getProfile: (token: string) => apiRequest("/auth/profile", { token }),

  updateProfile: (data: any, token: string) =>
    apiRequest("/auth/profile", {
      method: "PUT",
      body: data,
      token,
    }),
};

// Properties API
export const propertiesApi = {
  getAll: (params?: Record<string, string>) => {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return apiRequest(`/properties${queryString}`);
  },

  getById: (id: string) => apiRequest(`/properties/${id}`),

  create: (data: any, token: string) =>
    apiRequest("/properties", {
      method: "POST",
      body: data,
      token,
    }),

  update: (id: string, data: any, token: string) =>
    apiRequest(`/properties/${id}`, {
      method: "PUT",
      body: data,
      token,
    }),

  delete: (id: string, token: string) =>
    apiRequest(`/properties/${id}`, {
      method: "DELETE",
      token,
    }),
};

// Favorites API
export const favoritesApi = {
  getAll: (token?: string) => apiRequest("/favorites", { token }),

  add: (propertyId: string, token?: string) =>
    apiRequest("/favorites", {
      method: "POST",
      body: { propertyId },
      token,
    }),

  remove: (propertyId: string, token?: string) =>
    apiRequest(`/favorites/${propertyId}`, {
      method: "DELETE",
      token,
    }),
};

// Inquiries API
export const inquiriesApi = {
  getAll: (params?: Record<string, string>, token?: string) => {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return apiRequest(`/inquiries${queryString}`, { token });
  },

  create: (data: any, token?: string) =>
    apiRequest("/inquiries", {
      method: "POST",
      body: data,
      token,
    }),

  update: (id: string, data: any, token?: string) =>
    apiRequest(`/inquiries/${id}`, {
      method: "PUT",
      body: data,
      token,
    }),
};
