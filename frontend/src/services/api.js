const rawBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const API_BASE = rawBase.endsWith('/api') ? rawBase : (rawBase === '' ? '/api' : `${rawBase}/api`);

/**
 * Enhanced fetch wrapper that attaches JWT token and normalizes responses
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('deeptrace_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${formattedEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Automatically handle session expiry
  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    localStorage.removeItem('deeptrace_token');
    localStorage.removeItem('deeptrace_user');
    window.dispatchEvent(new Event('auth:unauthorized'));
  }

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }
  }

  if (!response.ok) {
    const message = data?.message || `HTTP Error ${response.status}: ${response.statusText}`;
    const error = new Error(message);
    error.status = response.status;
    error.errors = data?.errors || {};
    throw error;
  }

  return data;
}

export const authApi = {
  login: (credentials) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => apiFetch('/auth/me'),
};

export const dashboardApi = {
  getMetrics: () => apiFetch('/dashboard/metrics'),
  getRecentActivity: () => apiFetch('/dashboard/recent-activity'),
};

export const campaignsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/campaigns${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiFetch(`/campaigns/${id}`),
  create: (data) =>
    apiFetch('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiFetch(`/campaigns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiFetch(`/campaigns/${id}`, {
      method: 'DELETE',
    }),
  getUsers: (id) => apiFetch(`/campaigns/${id}/users`),
  assignUser: (id, userId) =>
    apiFetch(`/campaigns/${id}/users`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    }),
  removeUser: (id, userId) =>
    apiFetch(`/campaigns/${id}/users/${userId}`, {
      method: 'DELETE',
    }),
};

export const securityEventsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/security-events${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiFetch(`/security-events/${id}`),
  create: (data) =>
    apiFetch('/security-events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiFetch(`/security-events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const usersApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/users${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiFetch(`/users/${id}`),
  create: (data) =>
    apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiFetch(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiFetch(`/users/${id}`, {
      method: 'DELETE',
    }),
};

export const auditLogsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/audit-logs${query ? `?${query}` : ''}`);
  },
};
