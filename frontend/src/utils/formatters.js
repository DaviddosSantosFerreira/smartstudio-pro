export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

export const formatTime = (time) => {
  return time;
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('pt-BR');
};

export const formatPercent = (value) => {
  return `${value.toFixed(1)}%`;
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

