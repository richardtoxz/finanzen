import { useState } from 'react';
import Input from '../components/Input';
import AuthLayout from '../layouts/AuthLayout';
import { useForm } from '../hooks/useForm';
import { validateEmail } from '../utils/validation';

const LoginScreen = ({ onLogin, onSwitchToSignup }) => {
  const { formData, handleChange, errors, setErrors, validate } = useForm({ email: '', password: '' }, {
    email: (val) => !val.trim() ? 'Email é obrigatório' : !validateEmail(val) ? 'Email inválido' : '',
    password: (val) => !val ? 'Senha é obrigatória' : ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      // Aqui você fará a chamada para sua API de autenticação
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || 'Email ou senha incorretos.' });
        return;
      }

      // Login bem-sucedido
      onLogin({
        email: data.user.email,
        name: data.user.name,
        token: data.token // Se usar JWT ou similar
      });

    } catch (error) {
      setErrors({ general: 'Estamos trabalhando na conexão :)' });
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
        <Input 
          label="Email" 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          error={errors.email} 
        />
        
        <Input 
          label="Senha" 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          error={errors.password} 
          showToggle 
          showValue={showPassword} 
          toggleShow={() => setShowPassword(!showPassword)} 
        />
        
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-600">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-400 mr-2 cursor-pointer" 
            />
            Lembrar de mim
          </label>
          <button 
            type="button" 
            className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Esqueceu a senha?
          </button>
        </div>
        
        <button 
          onClick={handleSubmit} 
          disabled={isLoading} 
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </AuthLayout>
  );
};

export default LoginScreen;