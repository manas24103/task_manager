import api from './index';

export const userAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return api.get(`/users?${params}`);
  },
  
  getById: (id) => api.get(`/users/${id}`),
  
  getProfile: () => api.get('/users/profile'),
  
  updateRole: (id, roleData) => api.put(`/users/${id}/role`, roleData),
  
  delete: (id) => api.delete(`/users/${id}`),
};
