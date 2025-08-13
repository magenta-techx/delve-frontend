// Global type definitions

export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
