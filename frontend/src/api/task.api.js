import api from './index';

export const taskAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return api.get(`/tasks?${params}`);
  },
  
  getById: (id) => api.get(`/tasks/${id}`),
  
  create: (taskData) => api.post('/tasks', taskData),
  
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  
  delete: (id) => api.delete(`/tasks/${id}`),
  
  getStats: () => api.get('/tasks/stats'),
};
