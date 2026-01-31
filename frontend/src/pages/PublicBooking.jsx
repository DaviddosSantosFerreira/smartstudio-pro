import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { MapPin, Phone, Instagram, Calendar, Clock, User, ChevronRight, Check } from 'lucide-react';

export default function PublicBooking() {
  const { slug } = useParams();
  const [studio, setStudio] = useState(null);
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    serviceId: null,
    professionalId: null,
    date: '',
    time: ''
  });
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      const [studioRes, servicesRes, professionalsRes] = await Promise.all([
        api.get(`/studio/public/${slug}`),
        api.get('/services/active'),
        api.get('/professionals/active')
      ]);
      
      setStudio(studioRes.data);
      setServices(servicesRes.data || []);
      setProfessionals(professionalsRes.data || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Estúdio não encontrado');
    } finally {
      setLoading(false);
    }
  };

  // Buscar horários disponíveis do backend
  const fetchAvailableTimes = async () => {
    if (!formData.date || !formData.serviceId) {
      setAvailableTimes([]);
      return;
    }

    setLoadingTimes(true);
    try {
      const params = new URLSearchParams({
        date: formData.date,
        service_id: formData.serviceId
      });
      
      if (formData.professionalId) {
        params.append('professional_id', formData.professionalId);
      }

      const response = await api.get(`/appointments/available-times?${params}`);
      setAvailableTimes(response.data.availableTimes || []);
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      setAvailableTimes([]);
    } finally {
      setLoadingTimes(false);
    }
  };

  useEffect(() => {
    fetchAvailableTimes();
  }, [formData.date, formData.serviceId, formData.professionalId]);

  const handleServiceSelect = (serviceId) => {
    setFormData(prev => ({ ...prev, serviceId }));
    setStep(2);
  };

  const handleProfessionalSelect = (professionalId) => {
    setFormData(prev => ({ ...prev, professionalId }));
    setStep(3);
  };

  const handleDateSelect = (date) => {
    setFormData(prev => ({ ...prev, date, time: '' }));
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({ ...prev, time }));
    setStep(4);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.post('/appointments', {
        client_name: formData.clientName,
        client_phone: formData.clientPhone,
        service_id: formData.serviceId,
        professional_id: formData.professionalId,
        date: formData.date,
        time: formData.time,
        notes: 'Agendamento via página pública'
      });
      
      setBookingComplete(true);
    } catch (err) {
      console.error('Erro ao criar agendamento:', err);
      alert('Erro ao criar agendamento. Tente novamente.');
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const selectedService = services.find(s => s.id === formData.serviceId);
  const selectedProfessional = professionals.find(p => p.id === formData.professionalId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Ops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${studio?.secondary_color || '#fdf2f8'} 0%, ${studio?.primary_color}20 100%)` }}>
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Agendamento Confirmado!</h1>
          <p className="text-gray-600 mb-6">
            Seu agendamento foi realizado com sucesso. Entraremos em contato para confirmar.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
            <p><strong>Serviço:</strong> {selectedService?.name}</p>
            <p><strong>Profissional:</strong> {selectedProfessional?.name}</p>
            <p><strong>Data:</strong> {new Date(formData.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
            <p><strong>Horário:</strong> {formData.time}</p>
          </div>
          {studio?.whatsapp && (
            <a
              href={`https://wa.me/${studio.whatsapp}?text=Olá! Acabei de fazer um agendamento para ${formData.date} às ${formData.time}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Phone size={20} />
              Confirmar via WhatsApp
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${studio?.secondary_color || '#fdf2f8'}50 0%, white 100%)` }}>
      {/* Header */}
      <div className="text-center py-8 px-4">
        {studio?.logo_url ? (
          <img 
            src={studio.logo_url} 
            alt={studio.name} 
            className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 shadow-lg"
            style={{ borderColor: studio?.primary_color || '#ec4899' }}
          />
        ) : (
          <div 
            className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold"
            style={{ backgroundColor: studio?.primary_color || '#ec4899' }}
          >
            {studio?.name?.charAt(0) || 'S'}
          </div>
        )}
        <h1 className="text-2xl font-bold" style={{ color: studio?.primary_color || '#ec4899' }}>
          {studio?.name}
        </h1>
        
        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-4">
          {studio?.address && (
            <a href={`https://maps.google.com/?q=${encodeURIComponent(studio.address)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-pink-500">
              <MapPin size={20} />
            </a>
          )}
          {studio?.whatsapp && (
            <a href={`https://wa.me/${studio.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-green-500">
              <Phone size={20} />
            </a>
          )}
          {studio?.instagram && (
            <a href={`https://instagram.com/${studio.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-pink-500">
              <Instagram size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-lg mx-auto px-4 mb-6">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s ? 'text-white' : 'bg-gray-200 text-gray-500'
                }`}
                style={{ backgroundColor: step >= s ? (studio?.primary_color || '#ec4899') : undefined }}
              >
                {step > s ? <Check size={16} /> : s}
              </div>
              {s < 4 && (
                <div className={`w-12 h-1 mx-1 ${step > s ? 'bg-pink-500' : 'bg-gray-200'}`} 
                     style={{ backgroundColor: step > s ? (studio?.primary_color || '#ec4899') : undefined }} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Serviço</span>
          <span>Profissional</span>
          <span>Data/Hora</span>
          <span>Dados</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          
          {/* Step 1: Selecionar Serviço */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar size={20} style={{ color: studio?.primary_color }} />
                Escolha o Serviço
              </h2>
              <div className="space-y-3">
                {services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    className="w-full p-4 border rounded-xl text-left hover:border-pink-300 hover:bg-pink-50 transition-all flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.duration} min</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold" style={{ color: studio?.primary_color }}>
                        R$ {parseFloat(service.price).toFixed(2)}
                      </p>
                      <ChevronRight size={20} className="text-gray-400 ml-auto" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Selecionar Profissional */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} style={{ color: studio?.primary_color }} />
                Escolha o Profissional
              </h2>
              <div className="space-y-3">
                {professionals.map(prof => (
                  <button
                    key={prof.id}
                    onClick={() => handleProfessionalSelect(prof.id)}
                    className="w-full p-4 border rounded-xl text-left hover:border-pink-300 hover:bg-pink-50 transition-all flex items-center gap-4"
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: prof.color || studio?.primary_color || '#ec4899' }}
                    >
                      {prof.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{prof.name}</p>
                      <p className="text-sm text-gray-500">{prof.specialty}</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="mt-4 text-sm text-gray-500 hover:text-gray-700">
                ← Voltar
              </button>
            </div>
          )}

          {/* Step 3: Selecionar Data e Hora */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={20} style={{ color: studio?.primary_color }} />
                Escolha Data e Horário
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={formData.date}
                  onChange={(e) => handleDateSelect(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {formData.date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
                  {loadingTimes ? (
                    <div className="text-center py-4 text-gray-500">
                      Carregando horários...
                    </div>
                  ) : availableTimes.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      Nenhum horário disponível para esta data
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {availableTimes.map(time => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                            formData.time === time 
                              ? 'text-white border-transparent' 
                              : 'bg-white text-gray-700 hover:border-pink-300'
                          }`}
                          style={{ 
                            backgroundColor: formData.time === time ? (studio?.primary_color || '#ec4899') : undefined 
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button onClick={() => setStep(2)} className="mt-4 text-sm text-gray-500 hover:text-gray-700">
                ← Voltar
              </button>
            </div>
          )}

          {/* Step 4: Dados do Cliente */}
          {step === 4 && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} style={{ color: studio?.primary_color }} />
                Seus Dados
              </h2>

              {/* Resumo */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm">
                <p><strong>Serviço:</strong> {selectedService?.name}</p>
                <p><strong>Profissional:</strong> {selectedProfessional?.name}</p>
                <p><strong>Data:</strong> {new Date(formData.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                <p><strong>Horário:</strong> {formData.time}</p>
                <p className="mt-2 font-bold" style={{ color: studio?.primary_color }}>
                  Total: R$ {parseFloat(selectedService?.price || 0).toFixed(2)}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Digite seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone/WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.clientPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: studio?.primary_color || '#ec4899' }}
              >
                Confirmar Agendamento
              </button>

              <button type="button" onClick={() => setStep(3)} className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700">
                ← Voltar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

