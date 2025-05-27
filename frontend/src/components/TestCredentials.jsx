import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const TEST_CREDENTIALS = [
  { name: 'Enzo Silva', email: 'enzo@teste.com', password: 'Teste123!' },
  { name: 'Maria Santos', email: 'maria@demo.com', password: 'Demo456@' },
  { name: 'João Costa', email: 'joao@exemplo.com', password: 'Exemplo789#' }
];

const TestCredentials = ({ onCopyCredentials }) => {
  const [copied, setCopied] = useState(null);
  const handleCopy = (cred, index) => {
    onCopyCredentials(cred); setCopied(index); setTimeout(() => setCopied(null), 2000);
  };
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-sm font-medium text-blue-900 mb-3">🔑 Credenciais de Teste</h3>
      <p className="text-xs text-blue-700 mb-3">Clique para usar automaticamente:</p>
      <div className="space-y-2">
        {TEST_CREDENTIALS.map((cred, i) => (
          <button key={i} onClick={() => handleCopy(cred, i)} className="w-full p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{cred.name}</p>
                <p className="text-xs text-gray-600">{cred.email}</p>
                <p className="text-xs text-gray-500 font-mono">{cred.password}</p>
              </div>
              <div className="text-blue-600 group-hover:text-blue-800">
                {copied === i ? <Check size={16} /> : <Copy size={16} />}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestCredentials;