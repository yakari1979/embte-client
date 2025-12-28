import axios from 'axios';
import Cookies from 'js-cookie';

// URL de ton serveur Backend (vérifie bien le port 3001)
// const API_URL = 'http://localhost:3001/api';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// 1. On récupère l'URL depuis le fichier .env
// Si elle n'existe pas, on garde localhost par sécurité
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

// 2. L'URL pour les appels API (ex: http://localhost:3001/api)
const API_URL = `${SERVER_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTEUR : Ajoute le token à CHAQUE requête ---
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- SERVICES D'AUTHENTIFICATION ---
export const authService = {
  // Se connecter
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // S'inscrire (Client)
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Se déconnecter
  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user_role'); // On garde le rôle en cookie pour aider le middleware plus tard
    window.location.href = '/auth/login';
  },

  // Récupérer le profil utilisateur
  getProfile: async () => {
    const response = await api.get('/auth/me'); // Faudra s'assurer que cette route existe ou utiliser le token décodé
    return response.data;
  }
};


export const clientService = {
  // Envoyer la commande
  createOrder: async (data: any) => {
    const response = await api.post('/client/order', data);
    return response.data;
  },
  
  // Récupérer mon statut
  getMyProject: async () => {
    const response = await api.get('/client/my-project');
    return response.data;
  },
  getLogistics: async () => {
    const response = await api.get('/client/logistics'); // Adapte le chemin selon ton fichier route (/client ou /api/client)
    return response.data;
  }
};

// ... admin

export const adminService = {
  // Récupérer les données du dashboard
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Valider un projet
  validateProject: async (projectId: string, status: 'PLANNED' | 'CANCELLED') => {
    const response = await api.put(`/admin/projects/${projectId}/status`, { status });
    return response.data;
  },

  getProjectDetails: async (id: string) => {
    const response = await api.get(`/admin/projects/${id}`);
    return response.data;
  },

  getUsersByRole: async (role: 'CLIENT' | 'MANAGER' | 'WORKER') => {
    const response = await api.get(`/admin/users?role=${role}`);
    return response.data;
  },

  getActiveProjects: async () => {
    const response = await api.get('/admin/projects-active');
    return response.data;
  },

  assignManager: async (projectId: string, managerId: string) => {
    const response = await api.put(`/admin/projects/${projectId}/assign`, { managerId });
    return response.data;
  },

  createManager: async (data: any) => {
    const response = await api.post('/admin/managers', data);
    return response.data;
  },

  getUserDetails: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  getAllContacts: async () => {
    const response = await api.get('/admin/contacts');
    return response.data;
  },

  markContactAsRead: async (id: string) => {
    const response = await api.put(`/admin/contacts/${id}/read`);
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },
  getAllLogistics: async () => {
    const response = await api.get('/admin/logistics');
    return response.data;
  },

  updateSupplyStatus: async (requestId: string, status: string) => {
    const response = await api.put(`/admin/logistics/${requestId}/status`, { status });
    return response.data;
  },
  getProjectInventory: async (projectId: string) => {
    const response = await api.get(`/admin/projects/${projectId}/inventory`);
    return response.data;
  }
};

export const managerService = {
  getDashboard: async () => {
    const response = await api.get('/manager/dashboard');
    return response.data;
  },

  getTeams: async () => {
    const response = await api.get('/manager/teams');
    return response.data;
  },
  createWorker: async (data: any) => {
    const response = await api.post('/manager/workers', data);
    return response.data;
  },
  getReports: async () => {
    const response = await api.get('/manager/reports');
    return response.data;
  },

  validateReport: async (reportId: string) => {
    const response = await api.put(`/manager/reports/${reportId}/validate`);
    return response.data;
  },

  updateProgress: async (projectId: string, progress: number) => {
    const response = await api.put(`/manager/projects/${projectId}/progress`, { progress });
    return response.data;
  },
  // Nouvelle fonction dédiée au Manager
  getProjectDetails: async (projectId: string) => {
    const response = await api.get(`/manager/projects/${projectId}`);
    return response.data;
  },
  createTask: async (data: any) => {
    const response = await api.post('/manager/tasks', data);
    return response.data;
  },

  getProjectTasks: async (projectId: string) => {
    const response = await api.get(`/manager/projects/${projectId}/tasks`);
    return response.data;
  },

  updateTaskStatus: async (taskId: string, status: string) => {
    const response = await api.put(`/manager/tasks/${taskId}`, { status });
    return response.data;
  },
  getLogistics: async (projectId: string) => {
    const response = await api.get(`/manager/projects/${projectId}/logistics`);
    return response.data;
  },
  requestSupply: async (data: any) => {
    const response = await api.post('/manager/supply-request', data);
    return response.data;
  },
  receiveSupply: async (requestId: string) => {
    const response = await api.put(`/manager/supply-request/${requestId}/receive`);
    return response.data;
  },
  getFullInventory: async (projectId: string) => {
    const response = await api.get(`/manager/projects/${projectId}/inventory-full`);
    return response.data;
  },

  addItem: async (data: any) => {
    const response = await api.post('/manager/inventory/add', data);
    return response.data;
  },

  recordUsage: async (data: any) => {
    const response = await api.post('/manager/inventory/usage', data);
    return response.data;
  }
};

export const workerService = {
  getDashboard: async () => {
    const response = await api.get('/worker/dashboard');
    return response.data;
  },
  // Envoi avec fichiers (FormData obligatoire)
  sendReport: async (formData: FormData) => {
    const response = await api.post('/worker/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getMyReports: async () => {
    const response = await api.get('/worker/reports');
    return response.data;
  }
};

export const monitoringService = {
  logConnection: async (data: any) => {
    // Cette requête est silencieuse (on ne bloque pas si elle échoue)
    try {
        await api.post('/monitoring/log', data);
    } catch (e) {
        console.warn("Tracking failed", e);
    }
  },
  
  getLogs: async () => {
    const response = await api.get('/monitoring/logs');
    return response.data;
  }
};

// ... pour le contacter
export const publicService = {
  sendContact: async (data: any) => {
    const response = await api.post('/contact', data);
    return response.data;
  }
};

export default api;