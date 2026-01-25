import api from './api';

export const orientationService = {
  getSettings: async () => {
    const response = await api.get('/orientation/settings');
    return response.data;
  },

  updateSettings: async (data) => {
    const response = await api.put('/orientation/settings', data);
    return response.data;
  },

  calculateDistribution: async (monthlyRevenue) => {
    const response = await api.post('/orientation/calculate', { monthlyRevenue });
    return response.data;
  }
};

