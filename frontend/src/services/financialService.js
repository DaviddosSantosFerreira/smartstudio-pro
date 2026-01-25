import api from './api';

export const financialService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/financial', { params: filters });
    return response.data;
  },

  getSummary: async (startDate, endDate) => {
    const response = await api.get('/financial/summary', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/financial', data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/financial/${id}`);
    return response.data;
  }
};

