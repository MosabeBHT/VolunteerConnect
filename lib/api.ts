/**
 * API Configuration and Utilities
 * Handles all API calls with authentication via HTTP-only cookies
 */

// Empty string = same-origin (Next.js API routes)
const API_BASE_URL = '';

// Types
export interface User {
  id: string;
  email: string;
  role: 'VOLUNTEER' | 'NGO' | 'ADMIN';
  createdAt: string;
  volunteerProfile?: VolunteerProfile;
  ngoProfile?: NGOProfile;
}

export interface VolunteerProfile {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  skills: string[];
  interests: string[];
  totalHours: number;
}

export interface NGOProfile {
  id: string;
  organizationName: string;
  email: string;
  location: string;
  description: string;
  registrationNumber: string;
  isVerified: boolean;
  mission?: string;
  vision?: string;
  phone?: string;
  website?: string;
  address?: string;
  foundedYear?: string;
  teamSize?: string;
  volunteersServed?: string;
  focusAreas?: string[];
  achievements?: string[];
  profileImage?: string;
  bannerImage?: string;
  socialMedia?: any;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: any[];
}

// Token storage is no longer needed — auth uses HTTP-only cookies
// Keep tokenStorage as a no-op for backward compatibility during transition
export const tokenStorage = {
  get: () => null,
  set: (_token: string) => {},
  remove: () => {},
};

export const userStorage = {
  get: (): User | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
  set: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }
};

// API Client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const config: RequestInit = {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      
      // Check if response is ok before parsing JSON
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          // If JSON parsing fails, create a basic error
          errorData = {
            success: false,
            message: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
        throw errorData;
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      
      // Handle network errors and other exceptions
      if (error instanceof TypeError || error?.name === 'TypeError') {
        throw {
          success: false,
          message: `Network error: ${error.message || 'Unable to connect to server'}`,
          errors: []
        } as ApiError;
      }
      
      // If error already has our structure, re-throw it
      if (error.success === false) {
        throw error;
      }
      
      // Otherwise, wrap the error
      throw {
        success: false,
        message: error.message || 'An unexpected error occurred',
        errors: error.errors || []
      } as ApiError;
    }
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    role: 'VOLUNTEER' | 'NGO';
    firstName?: string;
    lastName?: string;
    location?: string;
    organizationName?: string;
    description?: string;
    registrationNumber?: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(): Promise<{ success: boolean; data: User }> {
    return this.request<{ success: boolean; data: User }>('/api/auth/me', {
      method: 'GET',
    });
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/api/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints
  async updateProfile(data: any): Promise<any> {
    return this.request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Mission endpoints
  async getMissions(params?: {
    category?: string;
    location?: string;
    status?: string;
    search?: string;
  }): Promise<any> {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/api/missions${query}`, {
      method: 'GET',
    });
  }

  async getMissionById(id: string): Promise<any> {
    return this.request(`/api/missions/${id}`, {
      method: 'GET',
    });
  }

  async createMission(data: any): Promise<any> {
    return this.request('/api/missions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyMissions(params?: any): Promise<any> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/api/missions/my/missions${query}`, {
      method: 'GET',
    });
  }

  async updateMission(id: string, data: any): Promise<any> {
    return this.request(`/api/missions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMission(id: string): Promise<any> {
    return this.request(`/api/missions/${id}`, {
      method: 'DELETE',
    });
  }

  // Application endpoints
  async applyToMission(missionId: string, message?: string): Promise<any> {
    return this.request('/api/applications', {
      method: 'POST',
      body: JSON.stringify({ missionId, message }),
    });
  }

  async createApplication(missionId: string, message?: string): Promise<any> {
    return this.applyToMission(missionId, message);
  }

  async getMyApplications(): Promise<any> {
    return this.request('/api/applications/my', {
      method: 'GET',
    });
  }

  async withdrawApplication(applicationId: string): Promise<any> {
    return this.request(`/api/applications/${applicationId}/withdraw`, {
      method: 'PUT',
    });
  }

  async getMissionApplications(missionId: string): Promise<any> {
    return this.request(`/api/applications/mission/${missionId}`, {
      method: 'GET',
    });
  }

  async updateApplicationStatus(
    applicationId: string,
    status: 'ACCEPTED' | 'REJECTED',
    feedback?: string
  ): Promise<any> {
    return this.request(`/api/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, feedback }),
    });
  }

  // User Profile endpoints
  async getMyProfile(): Promise<any> {
    return this.request('/api/users/profile', {
      method: 'GET',
    });
  }

  async updateNGOProfile(data: any): Promise<any> {
    return this.request('/api/users/ngo-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateVolunteerProfile(data: any): Promise<any> {
    return this.request('/api/users/volunteer-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);
