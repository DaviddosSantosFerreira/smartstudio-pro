import api from './api';

export const clientService = {
  getAll: async () => {
    const response = await api.get('/clients');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  create: async (data) => {
    try {
      console.log('📤 clientService.create - Enviando dados:', data);
      const response = await api.post('/clients', data);
      console.log('✅ clientService.create - Resposta recebida:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ clientService.create - Erro:', error);
      console.error('❌ clientService.create - Response:', error.response);
      console.error('❌ clientService.create - Data:', error.response?.data);
      throw error;
    }
  },

  update: async (id, data) => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },

  search: async (term) => {
    const response = await api.get('/clients/search', { params: { term } });
    return response.data;
  }
};

