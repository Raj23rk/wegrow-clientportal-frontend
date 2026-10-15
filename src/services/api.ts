import { User, ClientData, SessionFeedback, BusinessUpdate } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('wg:token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    async login(email: string, pass: string): Promise<{ access_token: string; user: User }> {
      const data = await request<{ access_token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, pass })
      });
      if (data.access_token) {
        localStorage.setItem('wg:token', data.access_token);
      }
      return data;
    },

    async getProfile(): Promise<User> {
      return request<User>('/auth/profile');
    },

    logout() {
      localStorage.removeItem('wg:token');
    }
  },

  clients: {
    async getAll(): Promise<ClientData[]> {
      return request<ClientData[]>('/clients');
    },

    async getById(id: string): Promise<ClientData> {
      return request<ClientData>(`/clients/${id}`);
    },

    async updateProfile(id: string, patch: Partial<ClientData>): Promise<ClientData> {
      return request<ClientData>(`/clients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch)
      });
    }
  },

  portal: {
    async addComment(clientId: string, actionId: string, text: string) {
      return request(`/portal/${clientId}/actions/${actionId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text })
      });
    },

    async submitFeedback(clientId: string, feedback: SessionFeedback) {
      return request(`/portal/${clientId}/feedback`, {
        method: 'POST',
        body: JSON.stringify(feedback)
      });
    },

    async publishUpdate(payload: {
      clientId: string;
      title: string;
      type: string;
      cat: string;
      body: string;
    }) {
      return request(`/portal/admin/publish`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },

    async markNotificationRead(clientId: string, notifId: string) {
      return request(`/portal/${clientId}/notifications/${notifId}/read`, {
        method: 'PATCH'
      });
    },

    async markAllNotificationsRead(clientId: string) {
      return request(`/portal/${clientId}/notifications/read-all`, {
        method: 'PATCH'
      });
    },

    async toggleEventRegistration(clientId: string, eventId: string): Promise<{ registered: boolean }> {
      return request<{ registered: boolean }>(`/portal/${clientId}/events/${eventId}/toggle-registration`, {
        method: 'POST'
      });
    }
  }
};
