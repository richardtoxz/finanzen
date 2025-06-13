import { useState } from 'react';
import Input from '../components/Input';
import AuthLayout from '../layouts/AuthLayout';
import { useForm } from '../hooks/useForm';
import { validateEmail, getPasswordErrors } from '../utils/validation';

const SignupScreen = ({ onSignup, onSwitchToLogin }) => {
  const { formData, handleChange, errors, validate } = useForm(
    { 
      name: '',
      email: '', 
      password: '', 
      confirmPassword: '' 
    }, 
    {
      name: (val) => !val.trim() ? 'Nome é obrigatório' : val.length < 2 ? 'Nome deve ter pelo menos 2 caracteres' : '',
      email: (val) => !val.trim() ? 'Email é obrigatório' : !validateEmail(val) ? 'Email inválido' : '',
      password: (val) => getPasswordErrors(val),
      confirmPassword: (val, allForm) => val !== allForm.password ? 'Senhas não coincidem' : ''
    }
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSignup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
    } catch (error) {
      console.error('Erro no registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Criar Conta</h2>
          <p className="text-gray-600">Preencha seus dados para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

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

          <Input
            label="Confirmar Senha"
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            showPasswordToggle
            onTogglePassword={() => setShowConfirm(!showConfirm)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p className="text-center">
          Já tem uma conta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Entrar
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupScreen;