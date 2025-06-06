import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, type = 'text', name, value, onChange, error, showToggle, showValue, toggleShow, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input type={type === 'password' && showToggle ? (showValue ? 'text' : 'password') : type} name={name} value={value} onChange={onChange}
        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all ${error ? 'border-red-300' : 'border-gray-200'}`}
        placeholder={type === 'password' ? '••••••••' : ''} {...props} />
      {showToggle && <button type="button" onClick={toggleShow} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">{showValue ? <EyeOff size={20} /> : <Eye size={20} />}</button>}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default Input;