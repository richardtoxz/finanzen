import { useState, useEffect } from 'react';
import { User, Check, X, Eye, EyeOff, Save, Loader } from 'lucide-react';
import { validatePasswordRules, validateEmail } from '../utils/validation';
import { api } from '../services/api';

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

const SettingsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileData, setProfileData] = useState({
    nomeUsuario: '',
    email: ''
  });
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    newEmail: '',
    emailVerificationCode: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailChangeStep, setEmailChangeStep] = useState(0);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRules = validatePasswordRules(formData.newPassword);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const profile = await api.getUserProfile();
        setProfileData(profile);        setFormData(prev => ({
          ...prev,
          name: profile.nomeUsuario || '',
          email: profile.email || '',
          newEmail: profile.email || ''
        }));
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setMessage({
          type: 'error',
          text: 'Erro ao carregar dados do perfil. Tente novamente.'
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequestEmailChange = async () => {
    try {
      if (!validateEmail(formData.newEmail)) {
        showMessage('error', 'Por favor, insira um e-mail válido.');
        return;
      }      setSaving(true);
      const response = await api.requestEmailChange(formData.newEmail);
      
      setEmailChangeStep(1);
      showMessage('success', 'Código de verificação enviado! (Para teste: ' + response.verification_code_for_testing + ')');
      
    } catch (error) {
      console.error('Erro ao solicitar alteração de email:', error);
      const errorMessage = error.response?.data?.detail || 'Erro ao solicitar alteração de email.';
      showMessage('error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmEmailChange = async () => {
    try {
      if (!formData.emailVerificationCode) {
        showMessage('error', 'Código de verificação é obrigatório.');
        return;
      }

      setSaving(true);
      await api.confirmEmailChange({
        novo_email: formData.newEmail,
        codigo_verificacao: formData.emailVerificationCode
      });

      setProfileData(prev => ({
        ...prev,
        email: formData.newEmail
      }));

      setFormData(prev => ({
        ...prev,
        email: formData.newEmail,
        newEmail: '',
        emailVerificationCode: ''
      }));

      setEmailChangeStep(0);
      showMessage('success', 'E-mail alterado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao confirmar alteração de email:', error);
      const errorMessage = error.response?.data?.detail || 'Erro ao confirmar alteração de email.';
      showMessage('error', errorMessage);
    } finally {
      setSaving(false);
    }
  };  const handleCancelEmailChange = () => {
    setEmailChangeStep(0);
    setFormData(prev => ({
      ...prev,
      newEmail: prev.email,
      emailVerificationCode: ''
    }));
  };
  const handleSave = async () => {
    const hasProfileChanges = formData.name !== profileData.nomeUsuario;
    const hasPasswordChanges = formData.currentPassword || formData.newPassword || formData.confirmPassword;

    if (!hasProfileChanges && !hasPasswordChanges) {
      showMessage('error', 'Nenhuma alteração foi feita.');
      return;
    }

    try {
      setSaving(true);
      let profileUpdateSuccess = false;
      let passwordUpdateSuccess = false;
      const errors = [];

      if (hasProfileChanges) {
        try {
          const updateData = {};
          
          if (formData.name !== profileData.nomeUsuario && formData.name.trim()) {
            updateData.nomeUsuario = formData.name.trim();
          }

          if (Object.keys(updateData).length > 0) {
            await api.updateUserProfile(updateData);
            setProfileData(prev => ({
              ...prev,
              ...updateData
            }));
            profileUpdateSuccess = true;
          }
        } catch (error) {
          console.error('Erro ao atualizar perfil:', error);
          const errorMessage = error.response?.data?.detail || 'Erro ao atualizar perfil.';
          errors.push(errorMessage);
        }
      }

      if (hasPasswordChanges) {
        try {
          if (!formData.currentPassword) {
            errors.push('Senha atual é obrigatória.');
          } else if (!formData.newPassword) {
            errors.push('Nova senha é obrigatória.');
          } else if (formData.newPassword !== formData.confirmPassword) {
            errors.push('A confirmação da senha não confere.');
          } else {
            const allRulesSatisfied = Object.values(passwordRules).every(rule => rule);
            if (!allRulesSatisfied) {
              errors.push('A nova senha não atende aos requisitos de segurança.');
            } else {
              await api.updateUserPassword({
                senha_atual: formData.currentPassword,
                nova_senha: formData.newPassword
              });

              setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              }));
              passwordUpdateSuccess = true;
            }
          }
        } catch (error) {
          console.error('Erro ao alterar senha:', error);
          const errorMessage = error.response?.data?.detail || 'Erro ao alterar senha. Verifique se a senha atual está correta.';
          errors.push(errorMessage);
        }
      }

      if (errors.length > 0) {
        showMessage('error', errors.join(' '));
      } else {
        const successMessages = [];
        if (profileUpdateSuccess) successMessages.push('Perfil atualizado');
        if (passwordUpdateSuccess) successMessages.push('Senha alterada');
        
        if (successMessages.length > 0) {
          showMessage('success', `${successMessages.join(' e ')} com sucesso!`);
        }
      }
      
    } catch (error) {
      console.error('Erro geral ao salvar:', error);
      showMessage('error', 'Erro inesperado ao salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-gray-100 p-6 bg-white">
          <h1 className="text-2xl lg:text-5xl font-bold mb-2">Configurações</h1>
          <p className="text-lg text-gray-600">Gerencie suas informações pessoais</p>
        </header>
        <main className="p-8 flex-1 overflow-y-auto bg-gray-50/30 flex items-center justify-center">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader className="animate-spin" size={24} />
            <span className="text-lg">Carregando seus dados...</span>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="border-b border-gray-100 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-2">Configurações</h1>
        <p className="text-sm text-gray-500">Gerencie suas informações pessoais</p>
      </header>

      <main className="p-8 flex-1 overflow-y-auto bg-gray-50/30">
        {message.text && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 max-w-md ${
            message.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? <Check size={18} /> : <X size={18} />}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Perfil do usuário</h2>
          <p className="text-gray-600 mb-6">Atualize suas informações pessoais e de segurança</p>

          <div className="max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold">Informações Pessoais</h3>
                <p className="text-gray-600">Mantenha seus dados sempre atualizados</p>
              </div>
            </div>

            <div className="space-y-6">
              <FormField label="Nome completo">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={commonClasses.input}
                  placeholder="Digite seu nome completo"
                  disabled={saving}
                />
              </FormField>              {emailChangeStep === 0 && (
                <FormField label="E-mail">
                  <input
                    type="email"
                    name="newEmail"
                    value={formData.newEmail || formData.email}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        newEmail: e.target.value
                      }));
                    }}
                    className={commonClasses.input}
                    placeholder="seu@email.com"
                    disabled={saving}
                  />
                  {formData.newEmail && formData.newEmail !== formData.email && (
                    <div className="mt-3">
                      <button
                        onClick={handleRequestEmailChange}
                        disabled={saving || !formData.newEmail}
                        className={`${commonClasses.primaryBtn} w-full ${(saving || !formData.newEmail) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {saving ? (
                          <>
                            <Loader className="animate-spin" size={18} />
                            Enviando código...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Solicitar Alteração de E-mail
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </FormField>
              )}

              {emailChangeStep === 1 && (
                <div className="space-y-4">
                  <FormField label="Novo E-mail">
                    <input
                      type="email"
                      value={formData.newEmail}
                      className={`${commonClasses.input} bg-gray-50`}
                      disabled={true}
                    />
                    <p className="text-sm text-green-700 mt-2">
                      Digite o código de verificação para confirmar a alteração para este e-mail.
                    </p>
                  </FormField>
                  
                  <FormField label="Código de verificação">
                    <input
                      type="text"
                      name="emailVerificationCode"
                      value={formData.emailVerificationCode}
                      onChange={handleInputChange}
                      className={commonClasses.input}
                      placeholder="123456"
                      maxLength={6}
                      disabled={saving}
                    />
                  </FormField>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleConfirmEmailChange}
                      disabled={saving || !formData.emailVerificationCode}
                      className={`${commonClasses.primaryBtn} flex-1 ${(saving || !formData.emailVerificationCode) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {saving ? (
                        <>
                          <Loader className="animate-spin" size={18} />
                          Confirmando...
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          Confirmar Alteração
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEmailChange}
                      disabled={saving}
                      className="bg-gray-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <X size={18} />
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

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
                      disabled={saving}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      disabled={saving}
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
                      disabled={saving}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      disabled={saving}
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
                      disabled={saving}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      disabled={saving}
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

            <div className="mt-8 pt-6 border-t border-gray-100">
              <button 
                onClick={handleSave}
                disabled={saving}
                className={`${commonClasses.primaryBtn} w-full ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saving ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SettingsScreen;