import { useState } from 'react';
import { User, Check, X, Eye, EyeOff } from 'lucide-react';
import { validatePasswordRules } from '../utils/validation';

const commonClasses = {
  input: "block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200",
  primaryBtn: "bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl"
};

const FormField = ({ label, children }) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
    {children}
  </div>
);

const ValidationRule = ({ satisfied, text }) => (
  <div className={`flex items-center gap-2 ${satisfied ? 'text-green-600' : 'text-gray-400'}`}>
    {satisfied ? <Check size={16} /> : <X size={16} />}
    <span className="text-sm">{text}</span>
  </div>
);

const SettingsScreen = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRules = validatePasswordRules(formData.newPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log('Salvando configurações:', formData);
    // Aqui você implementaria a lógica de salvamento
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="border-b border-gray-100 p-6 bg-white">
        <h1 className="text-3xl lg:text-5xl font-bold mb-2">Configurações ⚙️</h1>
        <p className="text-lg text-gray-600">Gerencie suas informações pessoais</p>
      </header>

      <main className="p-8 flex-1 overflow-y-auto bg-gray-50/30">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Perfil do usuário</h2>
          <p className="text-gray-600 mb-6">Atualize suas informações pessoais e de segurança</p>
          
          <div className="max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {/* Header da seção */}
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold">Informações Pessoais</h3>
                <p className="text-gray-600">Mantenha seus dados sempre atualizados</p>
              </div>
            </div>

            {/* Formulário */}
            <div className="space-y-6">
              <FormField label="Nome completo">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={commonClasses.input}
                  placeholder="Digite seu nome completo"
                />
              </FormField>

              <FormField label="E-mail">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={commonClasses.input}
                  placeholder="seu@email.com"
                />
              </FormField>

              <div className="border-t border-gray-100 pt-8 mt-8">
                <h4 className="text-lg font-bold mb-6">Alterar Senha</h4>
                
                <FormField label="Senha atual">
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className={commonClasses.input}
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormField>

                <FormField label="Nova senha">
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={commonClasses.input}
                      placeholder="Digite sua nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.newPassword && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Requisitos da senha:</p>
                      <ValidationRule satisfied={passwordRules.length} text="Mínimo 8 caracteres" />
                      {formData.newPassword.length > 82 && (
                        <ValidationRule satisfied={passwordRules.maxLength} text="Máximo 82 caracteres" />
                      )}
                      <ValidationRule satisfied={passwordRules.uppercase} text="Pelo menos 1 letra maiúscula" />
                      <ValidationRule satisfied={passwordRules.lowercase} text="Pelo menos 1 letra minúscula" />
                      <ValidationRule satisfied={passwordRules.numeric} text="Pelo menos 1 número" />
                      <ValidationRule satisfied={passwordRules.special} text="Pelo menos 1 caractere especial" />
                    </div>
                  )}
                </FormField>

                <FormField label="Confirme a nova senha">
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={commonClasses.input}
                      placeholder="Confirme sua nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">As senhas não coincidem</p>
                  )}
                </FormField>
              </div>
            </div>

            {/* Botão de salvar */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button 
                onClick={handleSave}
                className={`${commonClasses.primaryBtn} w-full`}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SettingsScreen;