import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  showPasswordToggle,
  isPasswordVisible, 
  onTogglePasswordVisibility,
  ...props
}) => {
  const actualType = type === 'password' && isPasswordVisible ? 'text' : type;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={actualType}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all ${error ? 'border-red-300' : 'border-gray-200'}`}
          placeholder={type === 'password' ? '••••••••' : ''}
          {...props}
        />
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
          >
            {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;