import { useState } from 'react';
import Input from '../components/Input';
import AuthLayout from '../layouts/AuthLayout';
import { useForm } from '../hooks/useForm';
import { validateEmail, validatePasswordRules, getPasswordErrors } from '../utils/validation';

const SignupScreen = ({ onSignup, onSwitchToLogin }) => {
  const { formData, handleChange, errors, validate } = useForm({ email: '', password: '', confirmPassword: '' }, {
    email: (val) => !val.trim() ? 'Email é obrigatório' : !validateEmail(val) ? 'Email inválido' : '',
    password: (val) => getPasswordErrors(val),
    confirmPassword: (val, allForm) => val !== allForm.password ? 'Senhas não coincidem' : ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignup({ email: formData.email, name: '' }); // Name is collected in onboarding
    }, 1500);
  };
  const passwordRules = validatePasswordRules(formData.password);

  return (
    <AuthLayout title="Criar conta" onBack={onSwitchToLogin} footerText="Já tem uma conta?" footerAction={onSwitchToLogin} footerActionText="Fazer login">
      <div className="space-y-5">
        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
        <div>
          <Input label="Senha" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} showToggle showValue={showPassword} toggleShow={() => setShowPassword(!showPassword)} />
          {formData.password && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Requisitos da senha:</p>
              <div className="space-y-1">
                {Object.entries(passwordRules).map(([rule, isValid]) => (
                  <div key={rule} className={`flex items-center text-xs ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${isValid ? 'bg-green-500' : 'bg-gray-300'}`} />
                    {rule === 'length' && 'Mínimo 8 caracteres'}
                    {rule === 'uppercase' && '1 letra maiúscula'}
                    {rule === 'lowercase' && '1 letra minúscula'}
                    {rule === 'special' && '1 caractere especial'}
                    {rule === 'numeric' && '1 número'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Input label="Confirmar senha" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} showToggle showValue={showConfirm} toggleShow={() => setShowConfirm(!showConfirm)} />
        <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer">
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </div>
    </AuthLayout>
  );
};

export default SignupScreen;