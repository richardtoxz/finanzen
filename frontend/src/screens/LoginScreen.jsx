import { useState } from 'react';
import Input from '../components/Input';
import AuthLayout from '../layouts/AuthLayout';
import { useForm } from '../hooks/useForm';
import { validateEmail } from '../utils/validation';
import { api } from '../services/api';

const LoginScreen = ({ onLogin, onSwitchToSignup }) => {
  const { formData, handleChange, errors, setErrors, validate } = useForm({ email: '', password: '' }, {
    email: (val) => !val.trim() ? 'Email é obrigatório' : !validateEmail(val) ? 'Email inválido' : '',
    password: (val) => !val ? 'Senha é obrigatória' : ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const loginData = {
        email: formData.email,
        senha: formData.password
      };
      
      const response = await api.login(loginData);
      onLogin(loginData);
    } catch (error) {
      console.error('Erro no login:', error);
      setErrors({
        general: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Finanzen" 
      subtitle="Entre na sua conta" 
      footerText="Não tem uma conta?" 
      footerAction={onSwitchToSignup} 
      footerActionText="Cadastre-se"
    >
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-xs">{errors.general}</p>
        </div>
      )}
      
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Bem-vindo de volta!</h2>
          <p className="text-gray-600">Entre para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Senha"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            showPasswordToggle
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        
      </div>
    </AuthLayout>
  );
};

export default LoginScreen;