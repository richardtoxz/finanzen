import { useState } from 'react';
import OptionButton from '../components/OptionButton';
import { useForm } from '../hooks/useForm';

const OnboardingScreen = ({ user, onComplete }) => {
  const { formData, handleChange, errors, validate } = useForm(
    { 
      objectives: [], 
      income: '' 
    }, 
    {
      objectives: (val) => val.length === 0 ? 'Selecione pelo menos um objetivo' : '',
      income: (val) => !val ? 'Selecione uma faixa de renda' : ''
    }
  );
  const [isLoading, setIsLoading] = useState(false);

  const objectives = [
    { id: 'debt', label: 'Quitar minhas dívidas', icon: '💸' },
    { id: 'emergency', label: 'Criar reserva de emergência', icon: '🛡️' },
    { id: 'income', label: 'Organizar e gerenciar receitas', icon: '📊' },
    { id: 'car', label: 'Comprar um carro', icon: '🚗' },
  ];
  const incomeRanges = [
    { id: 'up-1000', label: 'Até R$ 1.000' },
    { id: '1000-2000', label: 'Entre R$1.001 e R$2.000' },
    { id: '2000-3000', label: 'Entre R$2.001 e R$3.000' },
    { id: 'above-3000', label: 'Mais de R$3.000' },
    { id: 'no-answer', label: 'Prefiro não responder' }
  ];

  const handleToggle = (field, id) => {
    const updatedObjectives = formData[field].includes(id) 
      ? formData[field].filter(itemId => itemId !== id) 
      : [...formData[field], id];
    
    handleChange({ 
      target: { 
        name: field, 
        value: updatedObjectives 
      } 
    });
  };

  const handleIncomeSelect = (id) => {
    handleChange({ 
      target: { 
        name: 'income', 
        value: id 
      } 
    });
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onComplete({ ...user, ...formData });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finanzen</h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Bem-vindo(a), {user?.nomeUsuario}!</h2>
          <p className="text-gray-600">Vamos deixar sua vida financeira mais leve</p>
        </div>
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Qual seu objetivo com o app?</label>
            <div className="cursor-pointer grid grid-cols-1 sm:grid-cols-2 gap-3">
              {objectives.map(obj => (
                <OptionButton 
                  key={obj.id} 
                  {...obj} 
                  selected={formData.objectives.includes(obj.id)} 
                  onToggle={(id) => handleToggle('objectives', id)} 
                />
              ))}
            </div>
            {errors.objectives && (
              <p className="mt-2 text-sm text-red-600">{errors.objectives}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Qual é a sua renda média mensal?</label>
            <p className="text-xs text-gray-500 mb-4">Suas respostas ajudam a personalizar sua experiência.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {incomeRanges.map(range => (
                <OptionButton
                  key={range.id}
                  {...range}
                  selected={formData.income === range.id}
                  onToggle={() => handleIncomeSelect(range.id)}
                />
              ))}
            </div>
            {errors.income && (
              <p className="mt-2 text-sm text-red-600">{errors.income}</p>
            )}
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={isLoading} 
            className={`w-full py-3 rounded-lg font-medium transition-all ${!errors.objectives && !errors.income ? 'bg-black text-white hover:bg-gray-800 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {isLoading ? 'Carregando...' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;