import { ApiError } from '../types/common';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://team-task-manager-576e.onrender.com';

// Helper to simulate realistic async network delay when running in Mock mode
export const simulateNetworkDelay = (ms = 250): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export class ApiClient {
  private static getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  static async get<T>(endpoint: string): Promise<T> {
    if (USE_MOCK_API) {
      await simulateNetworkDelay();
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw {
          message: errorData.message || 'Failed to fetch data',
          statusCode: response.status,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).statusCode) throw error;
      throw {
        message: 'Network error or server unreachable',
        statusCode: 500,
      } as ApiError;
    }
  }

  static async post<T, B>(endpoint: string, body: B): Promise<T> {
    if (USE_MOCK_API) {
      await simulateNetworkDelay();
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw {
          message: errorData.message || 'Operation failed',
          statusCode: response.status,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).statusCode) throw error;
      throw {
        message: 'Network error or server unreachable',
        statusCode: 500,
      } as ApiError;
    }
  }

  static async put<T, B>(endpoint: string, body: B): Promise<T> {
    if (USE_MOCK_API) {
      await simulateNetworkDelay();
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw {
          message: errorData.message || 'Update failed',
          statusCode: response.status,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).statusCode) throw error;
      throw {
        message: 'Network error or server unreachable',
        statusCode: 500,
      } as ApiError;
    }
  }

  static async patch<T, B>(endpoint: string, body: B): Promise<T> {
    if (USE_MOCK_API) {
      await simulateNetworkDelay();
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw {
          message: errorData.message || 'Patch failed',
          statusCode: response.status,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).statusCode) throw error;
      throw {
        message: 'Network error or server unreachable',
        statusCode: 500,
      } as ApiError;
    }
  }

  static async delete<T>(endpoint: string): Promise<T> {
    if (USE_MOCK_API) {
      await simulateNetworkDelay();
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw {
          message: errorData.message || 'Deletion failed',
          statusCode: response.status,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).statusCode) throw error;
      throw {
        message: 'Network error or server unreachable',
        statusCode: 500,
      } as ApiError;
    }
  }
}
