import { useState } from 'react';
import { Edit2, Trash2, X, Plus } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';


const BudgetsScreen = ({ categories }) => {
  const [budgets, setBudgets] = useState([
    {
      id: 1,
      category: 'Alimentação',
      spent: 400.00,
      budget: 600.00,
      color: '#3B82F6'
    },
    {
      id: 2,
      category: 'Lazer',
      spent: 150.00,
      budget: 400.00,
      color: '#10B981'
    },
    {
      id: 3,
      category: 'Compras',
      spent: 300.00,
      budget: 450.00,
      color: '#F59E0B'
    },
    {
      id: 4,
      category: 'Transporte',
      spent: 150.00,
      budget: 300.00,
      color: '#8B5CF6'
    }
  ]);

  const [currentMonth, setCurrentMonth] = useState('Mês atual');
  const [showNewBudgetModal, setShowNewBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [budgetForm, setBudgetForm] = useState({
    category: '',
    budget: ''
  });

  const calculatePercentage = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAddBudget = () => {
    if (!budgetForm.category || !budgetForm.budget) return;
    
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];
    const newBudgetItem = {
      id: Date.now(),
      category: budgetForm.category,
      spent: 0,
      budget: parseFloat(budgetForm.budget.replace(',', '.')),
      color: colors[budgets.length % colors.length]
    };
    
    setBudgets([...budgets, newBudgetItem]);
    setBudgetForm({ category: '', budget: '' });
    setShowNewBudgetModal(false);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setBudgetForm({
      category: budget.category,
      budget: budget.budget.toString().replace('.', ',')
    });
    setShowNewBudgetModal(true);
  };

  const handleSaveEdit = () => {
    if (!budgetForm.category || !budgetForm.budget) return;
    
    setBudgets(budgets.map(b => 
      b.id === editingBudget.id 
        ? { ...b, category: budgetForm.category, budget: parseFloat(budgetForm.budget.replace(',', '.')) }
        : b
    ));
    
    setEditingBudget(null);
    setBudgetForm({ category: '', budget: '' });
    setShowNewBudgetModal(false);
  };

  const confirmDelete = () => {
    setBudgets(budgets.filter(budget => budget.id !== deletingId));
    setDeletingId(null);
  };

  const handleCloseModal = () => {
    setShowNewBudgetModal(false);
    setEditingBudget(null);
    setBudgetForm({ category: '', budget: '' });
  };

  const formatBudgetValue = (value) => {
    const numericValue = value.replace(/[^\d,]/g, '');
    const parts = numericValue.split(',');
    if (parts.length > 2) {
      return parts[0] + ',' + parts.slice(1).join('').slice(0, 2);
    }
    return numericValue;
  };

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
            <button onClick={onConfirm} className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">Excluir</button>
            <button onClick={onCancel} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );

  const BudgetCard = ({ budget }) => {
    const percentage = calculatePercentage(budget.spent, budget.budget);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg text-gray-900">{budget.category}</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => handleEditBudget(budget)}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="Editar orçamento"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => setDeletingId(budget.id)}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Excluir orçamento"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Já gasto: <strong>{formatCurrency(budget.spent)}</strong></span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span>Orçamento: <strong>{formatCurrency(budget.budget)}</strong></span>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${percentage}%`,
                backgroundColor: budget.color
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const BudgetModal = () => {
    if (!showNewBudgetModal) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <div className="relative">
                  <select 
                    value={budgetForm.category}
                    onChange={(e) => setBudgetForm({...budgetForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 appearance-none bg-white"
                    disabled={editingBudget}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories?.map(cat => (
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
                  Valor do Orçamento *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 pointer-events-none">R$</span>
                  <input 
                    type="text"
                    value={budgetForm.budget}
                    onChange={(e) => setBudgetForm({...budgetForm, budget: formatBudgetValue(e.target.value)})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
                    placeholder="0,00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Exemplo: 500,00</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleCloseModal}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={editingBudget ? handleSaveEdit : handleAddBudget}
                disabled={!budgetForm.category || !budgetForm.budget}
                className="flex-1 py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                {editingBudget ? 'Salvar Alterações' : 'Criar Orçamento'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Alert de exclusão */}
      {deletingId && (
        <DeleteAlert 
          onConfirm={confirmDelete} 
          onCancel={() => setDeletingId(null)} 
        />
      )}
      
      {/* Header */}
      <header className="border-b border-gray-200 p-4 flex flex-col lg:flex-row justify-between items-center bg-gray-0">
        <div className="flex space-x-2 lg:space-x-4 overflow-x-auto w-full lg:w-auto py-2 scrollbar-hide">
          {['Mês atual', 'Mês anterior', 'Ano'].map(month => (
            <button 
              key={month} 
              className={`px-3 lg:px-4 py-2 font-medium text-sm whitespace-nowrap ${
                currentMonth === month 
                  ? 'border-b-2 border-black' 
                  : 'text-gray-500 hover:border-b-2 hover:border-gray-300'
              }`} 
              onClick={() => setCurrentMonth(month)}
            >
              {month}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setShowNewBudgetModal(true)}
          className="bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors w-full lg:w-auto mt-2 lg:mt-0 text-sm"
        >
          Novo Orçamento
        </button>
      </header>

      {/* Título da seção */}
      <div className="p-4 lg:p-6 bg-gray-00 border-gray-200 text-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Seus Orçamentos</h1>
        <p className="text-gray-600 mt-1">Quanto você quer gastar em cada categoria</p>
    </div>


      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {budgets.map(budget => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
        </div>
        
        {budgets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum orçamento criado ainda</p>
            <button 
              onClick={() => setShowNewBudgetModal(true)}
              className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
            >
              Criar Primeiro Orçamento
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      <BudgetModal />
    </div>
  );
};

export default BudgetsScreen;