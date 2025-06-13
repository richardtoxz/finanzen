import { useState } from 'react';
import {
  Edit2, Trash2, X,
  Plane, ShoppingBag, Shield, Target,
  Utensils, Bus, PartyPopper, Banknote,
  PlusIcon, BadgeDollarSign,
} from 'lucide-react';
import GoalCard from '../components/GoalCard';

const GoalsScreen = ({ categories }) => {
  const [goals, setGoals] = useState([
    { 
      id: 1, 
      name: 'Alimentação', 
      current: 1500, 
      target: 6000, 
      icon: <Utensils size={20} />, 
      percentage: 25, 
      category: 'Alimentação' 
    },
    { 
      id: 2, 
      name: 'Transporte', 
      current: 400, 
      target: 2000, 
      icon: <Bus size={20} />, 
      percentage: 20, 
      category: 'Transporte' 
    },
    { 
      id: 3, 
      name: 'Lazer', 
      current: 700, 
      target: 2000, 
      icon: <PartyPopper size={20} />, 
      percentage: 35, 
      category: 'Lazer' 
    },
    { 
      id: 4, 
      name: 'Compras', 
      current: 154, 
      target: 700, 
      icon: <ShoppingBag size={20} />, 
      percentage: 22, 
      category: 'Compras' 
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalData, setGoalData] = useState({
    name: '',
    target: '',
    current: '',
    category: '',
    description: ''
  });
  
  // Novo estado para controle de exclusão
  const [deletingGoalId, setDeletingGoalId] = useState(null);

  const handleOpenModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setGoalData({
        name: goal.name,
        target: formatCurrency(goal.target),
        current: goal.current.toString(),
        category: goal.category || '',
        description: goal.description || ''
      });
    } else {
      setEditingGoal(null);
      setGoalData({ name: '', target: '', current: '', category: '', description: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGoal(null);
    setGoalData({ name: '', target: '', current: '', category: '', description: '' });
  };

  const getIconForCategory = (category) => {
    switch (category) {
      case 'Alimentação':
        return <Utensils size={20} />;
      case 'Transporte':
        return <Bus size={20} />;
      case 'Lazer':
        return <PartyPopper size={20} />;
      case 'Compras':
        return <ShoppingBag size={20} />;
      case 'Salário':
        return <Banknote size={20} />;
      case 'Viagem':
        return <Plane size={20} />;
      default:
        return <Target size={20} />;
    }
  };

  const handleSaveGoal = () => {
    const target = parseFloat(goalData.target.replace(/[R$\s.]/g, '').replace(',', '.'));
    const current = parseFloat(goalData.current) || 0;
    const percentage = Math.round((current / target) * 100);

    if (editingGoal) {
      setGoals(prev => prev.map(goal => 
        goal.id === editingGoal.id 
          ? { 
              ...goal, 
              name: goalData.category,
              target, 
              current, 
              percentage,
              category: goalData.category,
              description: goalData.description,
              icon: getIconForCategory(goalData.category)
            }
          : goal
      ));
    } else {
      const newGoal = {
        id: Date.now(),
        name: goalData.category,
        target,
        current,
        percentage,
        category: goalData.category,
        description: goalData.description,
        icon: getIconForCategory(goalData.category)
      };
      setGoals(prev => [...prev, newGoal]);
    }
    handleCloseModal();
  };

  const handleDeleteGoal = (id) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCurrencyInput = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formatted = (Number(rawValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    setGoalData(prev => ({ ...prev, target: formatted }));
  };

  // Componente de alerta para exclusão
  const DeleteAlert = ({ onConfirm, onCancel }) => (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white border border-red-200 rounded-lg shadow-lg p-4 z-60 min-w-[380px]">
      <div className="flex items-start">
        <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-900">Tem certeza que deseja excluir?</h3>
          <p className="text-sm text-gray-500 mt-1">Esta ação não pode ser desfeita.</p>
          <div className="flex space-x-2 mt-4">
            <button onClick={onConfirm} className="cursor-pointer px-3 py-1.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">Excluir</button>
            <button onClick={onCancel} className="cursor-pointer px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );

  const inputClasses = "block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400";
  const primaryBtnClasses = "bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 flex items-center justify-center gap-2";

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Alerta de exclusão */}
      {deletingGoalId && (
        <DeleteAlert 
          onConfirm={() => {
            handleDeleteGoal(deletingGoalId);
            setDeletingGoalId(null);
          }}
          onCancel={() => setDeletingGoalId(null)}
        />
      )}
      
      <header className="border-b border-gray-200 p-4 flex flex-col lg:flex-row justify-between items-center">
        <div className="flex space-x-2 lg:space-x-4 overflow-x-auto w-full lg:w-auto py-2 scrollbar-hide">
          {['Mês atual', 'Mês anterior', 'Ano'].map(period => (
            <button 
              key={period} 
              className="px-3 lg:px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 border-black cursor-pointer"
            >
              {period}
            </button>
          ))}
        </div>
        <button 
          className={`${primaryBtnClasses} w-full lg:w-auto mt-2 lg:mt-0 text-sm cursor-pointer`}
          onClick={() => handleOpenModal()}
        >
          Nova Meta
        </button>
      </header>

      <main className="p-4 lg:p-6 flex-1 overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Suas metas financeiras</h1>
          <p className="text-gray-500">Acompanhe o seu progresso</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {goals.map(goal => (
            <div key={goal.id} className="relative group">
              <GoalCard
                icon={goal.icon}
                title={goal.name}
                progress={goal.percentage}
                value={`${formatCurrency(goal.current)} / ${formatCurrency(goal.target)}`}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <button
                  onClick={() => handleOpenModal(goal)}
                  className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50 text-blue-600 cursor-pointer"
                  title="Editar meta"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => setDeletingGoalId(goal.id)}
                  className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50 text-red-600 cursor-pointer"
                  title="Excluir meta"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg w-full max-w-md">
            <div className="p-6">
              <header className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingGoal ? 'Editar Meta' : 'Nova Meta'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </header>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor da meta
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      R$
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={goalData.target}
                      onChange={handleCurrencyInput}
                      className={`${inputClasses} pl-10`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <div className="relative">
                    <select
                      value={goalData.category}
                      onChange={(e) => setGoalData(prev => ({ ...prev, category: e.target.value }))}
                      className={`${inputClasses} appearance-none bg-white pr-10`}
                    >
                      <option value="" disabled>Selecione uma categoria</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.14-.446 1.576 0 .436.445.408 1.197 0 1.615l-3.734 3.704c-.533.529-1.394.529-1.928 0L5.516 9.163c-.409-.418-.436-1.17 0-1.615z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={goalData.description}
                    onChange={(e) => setGoalData(prev => ({ ...prev, description: e.target.value }))}
                    className={inputClasses}
                    placeholder="(opcional)"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveGoal}
                className={`${primaryBtnClasses} w-full py-3 text-white bg-black hover:bg-gray-800 cursor-pointer`}
                disabled={!goalData.target || !goalData.category}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsScreen;