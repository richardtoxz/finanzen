import { useState } from 'react';
import Input from '../components/Input';
import AuthLayout from '../layouts/AuthLayout';
import { useForm } from '../hooks/useForm';
import { validateEmail } from '../utils/validation';

const LoginScreen = ({ onLogin, onSwitchToSignup }) => {
  const { formData, handleChange, errors, validate } = useForm(
    { email: '', password: '' },
    {
      email: (val) => !val.trim()
        ? 'Email é obrigatório'
        : !validateEmail(val)
        ? 'Email inválido'
        : '',
      password: (val) => !val ? 'Senha é obrigatória' : ''
    }
  );

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setLoginError('');

    try {
      await onLogin(formData);
    } catch (error) {
      setLoginError(error.message || 'Erro ao tentar fazer login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Finanzen" subtitle="Entre na sua conta">
      {loginError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700 text-sm text-center">{loginError}</p>
        </div>
      )}

      {errors.general && !loginError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700 text-sm text-center">{errors.general}</p>
        </div>
      )}

      <div className="space-y-6">
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
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            showPasswordToggle
            isPasswordVisible={showPassword}
            onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center">
          Não tem uma conta?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:underline"
          >
            Criar conta
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginScreen;
