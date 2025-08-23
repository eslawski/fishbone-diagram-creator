import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Diagram {
  id: number;
  name: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface CreateDiagramRequest {
  name: string;
  user_id: string;
  content?: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
}

export interface UpdateDiagramRequest {
  name: string;
  content?: string;
}

// User API calls
export const userAPI = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (data: CreateUserRequest) => api.post<User>('/users', data),
  update: (id: string, data: UpdateUserRequest) => api.put<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Diagram API calls
export const diagramAPI = {
  getAll: () => api.get<Diagram[]>('/diagrams'),
  getById: (id: number) => api.get<Diagram>(`/diagrams/${id}`),
  getByUserId: (userId: string) => api.get<Diagram[]>(`/users/${userId}/diagrams`),
  create: (data: CreateDiagramRequest) => api.post<Diagram>('/diagrams', data),
  update: (id: number, data: UpdateDiagramRequest) => api.put<Diagram>(`/diagrams/${id}`, data),
  delete: (id: number) => api.delete(`/diagrams/${id}`),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;

