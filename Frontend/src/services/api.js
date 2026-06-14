/**
 * TaskFlow API Service — connected to the Node.js/Express backend.
 * Set VITE_API_URL in frontend/.env:  VITE_API_URL=http://localhost:4000/api
 */
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'Request failed')
  }
  if (res.status === 204) return null
  return res.json()
}

export const authService = {
  register: (fullname, email, password) =>
    request('/auth/register', { method: 'POST', body: { fullname, email, password } }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  updateMe: (data) => request('/auth/me', { method: 'PATCH', body: data }),
  forgotPassword: (email) =>
    request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (token, password) =>
    request(`/auth/reset-password/${token}`, { method: 'POST', body: { password } }),
}

export const taskService = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== 'all'))
    ).toString()
    return request(`/tasks${qs ? '?' + qs : ''}`)
  },
  get: (id) => request(`/tasks/${id}`),
  create: (payload) => request('/tasks', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/tasks/${id}`, { method: 'PUT', body: payload }),
  updateStatus: (id, status) =>
    request(`/tasks/${id}/status`, { method: 'PATCH', body: { status } }),
  delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
}

export const dashboardService = {
  stats: () => request('/dashboard/stats'),
  analytics: () => request('/dashboard/analytics'),
  team: () => request('/dashboard/team'),
}
