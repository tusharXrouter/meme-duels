// API Response types
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Error types
export interface ApiErrorResponse {
  message: string
  status: number
  statusText: string
  errors?: Record<string, string[]>
}

// Common entity types
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface User extends BaseEntity {
  email: string
  name: string
  avatar?: string
}

// Health check response
export interface HealthCheckResponse {
  status: string
  timestamp: string
  uptime: number
}
