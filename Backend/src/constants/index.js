// ── HTTP Status Codes ─────────────────────────────────────────────────────────
export const HTTP = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY: 429,
  SERVER_ERROR: 500,
}

// ── User Roles ────────────────────────────────────────────────────────────────
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
}

// ── Task Status ───────────────────────────────────────────────────────────────
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
}

// ── Task Priority ─────────────────────────────────────────────────────────────
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
}

// ── Socket Events ─────────────────────────────────────────────────────────────
export const SOCKET_EVENTS = {
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  NOTIFICATION: 'notification',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
}

// ── Pagination Defaults ───────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
}
