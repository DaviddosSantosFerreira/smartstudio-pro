import api from './api';

export const professionalService = {
  getAll: async () => {
    const response = await api.get('/professionals');
    return response.data;
  },

  getActive: async () => {
    const response = await api.get('/professionals/active');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/professionals/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/professionals', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/professionals/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/professionals/${id}`);
    return response.data;
  }
};

