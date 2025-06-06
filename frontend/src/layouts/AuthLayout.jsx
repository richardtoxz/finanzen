import { ArrowLeft } from 'lucide-react';

const AuthLayout = ({ title, subtitle, children, footerText, footerAction, footerActionText, onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      {onBack && (
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <h1 className="flex-1 text-center text-2xl font-bold text-gray-900">{title}</h1>
        </div>
      )}
      {!onBack && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
      )}
      {children}
      <div className="mt-8 text-center text-gray-600">
        {footerText}
        <button onClick={footerAction} className="text-black font-medium hover:underline ml-1 cursor-pointer">
          {footerActionText}
        </button>
      </div>
    </div>
  </div>
);

export default AuthLayout;