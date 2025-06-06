import { useState } from 'react';
import OptionButton from '../components/OptionButton';
import { useForm } from '../hooks/useForm';

const OnboardingScreen = ({ user, onComplete }) => {
  // Atualize o estado inicial:
  const { formData, handleChange, setFormData } = useForm({ name: user?.name || '', objectives: [], income: '' }, {});
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

  const handleToggle = (field, id) => setFormData(prev => ({
    ...prev,
    [field]: prev[field].includes(id) ? prev[field].filter(itemId => itemId !== id) : [...prev[field], id]
  }));

  // Atualize a validação do formulário:
  const isFormValid = formData.name.trim() && formData.objectives.length > 0 && formData.income;

  // Adicione uma função para seleção única:
  const handleIncomeSelect = (id) => {
    setFormData(prev => ({ ...prev, income: id }));
  };



  const handleSubmit = () => {
    if (!isFormValid) return;
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Agora me conta um pouco sobre você</h2>
          <p className="text-gray-600">Vamos deixar sua vida financeira mais leve</p>
        </div>
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Qual seu nome?</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Digite o seu nome aqui..." className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Qual seu objetivo com o app?</label>
            <div className="cursor-pointer grid grid-cols-1 sm:grid-cols-2 gap-3">
              {objectives.map(obj => (<OptionButton key={obj.id} {...obj} selected={formData.objectives.includes(obj.id)} onToggle={(id) => handleToggle('objectives', id)} />))}
            </div>
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
          </div>

          <button onClick={handleSubmit} disabled={!isFormValid || isLoading} className={`w-full py-3 rounded-lg font-medium transition-all ${isFormValid && !isLoading ? 'bg-black text-white hover:bg-gray-800 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
            {isLoading ? 'Carregando...' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;