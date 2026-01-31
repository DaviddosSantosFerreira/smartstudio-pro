import { useState, useEffect } from 'react';
import api from '../services/api';
import { Save, Upload, Eye } from 'lucide-react';

export default function StudioSettings() {
  const [settings, setSettings] = useState({
    name: '',
    slug: '',
    logo_url: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    address: '',
    description: '',
    primary_color: '#ec4899',
    secondary_color: '#f9a8d4'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [previewLogo, setPreviewLogo] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/studio/settings');
      if (response.data && Object.keys(response.data).length > 0) {
        setSettings(response.data);
        setPreviewLogo(response.data.logo_url);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
    
    // Auto-gerar slug a partir do nome
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSettings(prev => ({ ...prev, slug }));
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await api.post('/studio/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSettings(prev => ({ ...prev, logo_url: response.data.logo_url }));
      setPreviewLogo(URL.createObjectURL(file));
      setMessage('Logo enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar logo:', error);
      setMessage('Erro ao enviar logo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.put('/studio/settings', settings);
      setMessage('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setMessage('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const getPublicUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/booking/${settings.slug}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações do Estúdio</h1>
          <p className="text-gray-600">Configure sua página pública de agendamento</p>
        </div>
        {settings.slug && (
          <a
            href={`/booking/${settings.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200"
          >
            <Eye size={20} />
            Ver Página Pública
          </a>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo / Foto</label>
            <div className="flex items-center gap-4">
              {previewLogo ? (
                <img src={previewLogo} alt="Logo" className="w-24 h-24 rounded-full object-cover border-4 border-pink-200" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <Upload size={32} className="text-gray-400" />
                </div>
              )}
              <div>
                <label className="cursor-pointer px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 inline-flex items-center gap-2">
                  <Upload size={20} />
                  Enviar Imagem
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                <p className="text-sm text-gray-500 mt-1">JPG, PNG ou GIF. Máximo 5MB.</p>
              </div>
            </div>
          </div>

          {/* Nome do Estúdio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Estúdio *</label>
            <input
              type="text"
              name="name"
              value={settings.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Ex: Laryenne Gleyce Studio"
            />
          </div>

          {/* Slug (URL) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Personalizada</label>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm mr-2">/booking/</span>
              <input
                type="text"
                name="slug"
                value={settings.slug}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="meu-estudio"
              />
            </div>
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="(11) 99999-9999"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              value={settings.whatsapp}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="5511999999999"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
            <input
              type="text"
              name="instagram"
              value={settings.instagram}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="@meuinsta"
            />
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
            <input
              type="text"
              name="address"
              value={settings.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Rua Exemplo, 123"
            />
          </div>

          {/* Cor Primária */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cor Primária</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="primary_color"
                value={settings.primary_color}
                onChange={handleChange}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={settings.primary_color}
                onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Cor Secundária */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="secondary_color"
                value={settings.secondary_color}
                onChange={handleChange}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={settings.secondary_color}
                onChange={(e) => setSettings(prev => ({ ...prev, secondary_color: e.target.value }))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              name="description"
              value={settings.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Uma breve descrição do seu estúdio..."
            />
          </div>
        </div>

        {/* URL Pública */}
        {settings.slug && (
          <div className="mt-6 p-4 bg-pink-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Sua página pública de agendamento:</p>
            <p className="text-pink-600 font-mono mt-1">{getPublicUrl()}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
}

