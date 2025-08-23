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

export interface Diagram {
  id: string;
  user_id: string;
  problem: string;
  causes: string; // JSON string from backend
}

export interface DiagramWithParsedCauses {
  id: string;
  user_id: string;
  problem: string;
  causes: any; // Parsed JSON object
}

// User API calls
export const userAPI = {
  getAll: () => api.get<User[]>('/users'),
};

// Diagram API calls
export const diagramAPI = {
  getByUserId: (userId: string) => api.get<Diagram[]>(`/user/${userId}/diagrams`),
  getByUserIdAndId: (userId: string, diagramId: string) => 
    api.get<DiagramWithParsedCauses>(`/user/${userId}/diagram/${diagramId}`),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;

