import React from 'react';
import { Settings as SettingsIcon, Bell, User, Shield } from 'lucide-react';
import Card from '../components/common/Card';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie as configurações do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Notificações" icon={Bell}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Notificações por Email</p>
                <p className="text-sm text-gray-600">Receba notificações importantes por email</p>
              </div>
              <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Lembretes de Agendamento</p>
                <p className="text-sm text-gray-600">Enviar lembretes antes dos agendamentos</p>
              </div>
              <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" defaultChecked />
            </div>
          </div>
        </Card>

        <Card title="Perfil" icon={User}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Estabelecimento</label>
              <input type="text" className="input-field" defaultValue="SmartStudio Pro" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" className="input-field" defaultValue="contato@smartstudio.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
              <input type="tel" className="input-field" defaultValue="(11) 99999-9999" />
            </div>
          </div>
        </Card>

        <Card title="Segurança" icon={Shield}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Senha Atual</label>
              <input type="password" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nova Senha</label>
              <input type="password" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Nova Senha</label>
              <input type="password" className="input-field" />
            </div>
          </div>
        </Card>

        <Card title="Sistema" icon={SettingsIcon}>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Versão do Sistema</p>
              <p className="font-semibold text-gray-900">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Última Atualização</p>
              <p className="font-semibold text-gray-900">25/01/2026</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

