import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface User {
  id: string;
  name: string;
}

export interface Cause {
  id: number;
  name: string;
  causes: Cause[];
}

export interface Diagram {
  id: string;
  problem: string;
  causes: Cause[];
}

// User API calls
export const userAPI = {
  getAll: () => api.get<User[]>('/users'),
};

// Diagram API calls
export const diagramAPI = {
  getByUserId: (userId: string) => api.get<Diagram[]>(`/user/${userId}/diagrams`),
  getByUserIdAndId: (userId: string, diagramId: string) => 
    api.get<Diagram>(`/user/${userId}/diagram/${diagramId}`),
  getById: (diagramId: string) => api.get<Diagram>(`/diagram/${diagramId}`),
  createDiagram: (userId: string, problem: string) =>
    api.post<Diagram>(`/user/${userId}/diagram`, { problem }),
  updateDiagram: (diagram: Diagram) =>
    api.post<Diagram>(`/diagram/${diagram.id}`, diagram),
  deleteDiagram: (diagramId: string) =>
    api.delete(`/diagram/${diagramId}`),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;

