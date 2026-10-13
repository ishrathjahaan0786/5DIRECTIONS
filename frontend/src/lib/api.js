/**
 * 5Directions Unified API Client
 * - Uses relative paths for clean Vercel rewrite routing & Vite local dev proxy
 * - Configures credentials: 'include' for HttpOnly server-managed cookies
 * - Real persistent authentication & role-based endpoints
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''
const API_BASE = BACKEND_URL ? `${BACKEND_URL.replace(/\/$/, '')}/api` : '/api'

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include' // sends HttpOnly session cookies automatically
  })

  let data = null
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json()
    } catch {
      data = null
    }
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    const errorMsg = (data && data.message) || response.statusText || 'Request failed'
    const error = new Error(errorMsg)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: (endpoint, body, options) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),

  // Auth Endpoints
  auth: {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (payload) => api.post('/auth/register', payload),
    logout: () => api.post('/auth/logout', {}),
    getMe: () => api.get('/auth/me'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword })
  },

  // Agentic AI Resilience Endpoints
  agent: {
    investigate: (payload) => api.post('/agent/investigate', payload),
    approvePlan: (planId, isSimulated = false) => api.post('/agent/approve-plan', { planId, isSimulated }),
    rejectPlan: (planId) => api.post('/agent/reject-plan', { planId }),
    getPlans: () => api.get('/agent/plans'),
    getActivity: (sessionId) => api.get(`/agent/activity/${sessionId}`)
  },

  // Business Domain Endpoints
  materials: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString()
      return api.get(`/materials${q ? `?${q}` : ''}`)
    },
    getById: (id) => api.get(`/materials/${id}`)
  },

  suppliers: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString()
      return api.get(`/suppliers${q ? `?${q}` : ''}`)
    },
    getById: (id) => api.get(`/suppliers/${id}`)
  },

  orders: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString()
      return api.get(`/orders${q ? `?${q}` : ''}`)
    },
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post('/orders', data)
  },

  disruptions: {
    getAll: () => api.get('/disruptions'),
    getOverview: () => api.get('/disruptions/overview')
  }
}

export default api
