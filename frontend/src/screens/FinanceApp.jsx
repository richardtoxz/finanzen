import { useState } from 'react';
import { Menu, X, PlusSquare, MinusSquare, Target, FileText, Layers, Settings, LogOut, Home, BarChart3, User, Car, Coffee, Plane, ShoppingBag, Shield, Edit2, Trash2, Plus } from 'lucide-react';
import SidebarItem from '../components/SidebarItem';
import SummaryCard from '../components/SummaryCard';
import TransactionCard from '../components/TransactionCard';
import GoalCard from '../components/GoalCard';
import ReportsScreen from './ReportsScreen';
import { formatCurrency, parseCurrency } from '../utils/formatCurrency';
import GoalsScreen from './GoalsScreen';
import BudgetsScreen from './BudgetsScreen';


const modalBackdropClasses = "fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50 p-4";
const modalContentClasses = "bg-white rounded-md shadow-lg w-full";
const inputClasses = "block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400";
const primaryBtnClasses = "bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 flex items-center justify-center gap-2";

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">{children}</div>
  </div>
);

const DeleteAlert = ({ onConfirm, onCancel }) => (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white border border-red-200 rounded-lg shadow-lg p-4 z-60 min-w-[380px]">
    <div className="flex items-start">
      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
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


const Sidebar = ({ sidebarOpen, setSidebarOpen, setTransactionType, setShowModal, onLogout, currentView, setCurrentView, setShowCategoriesModal }) => (
  <div className={`fixed lg:static inset-y-0 left-0 w-64 lg:w-48 bg-white border-r border-gray-200 p-4 flex flex-col z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
    <div className="flex justify-between items-center">
      <div className="py-3 px-1 font-bold text-lg cursor-pointer">Finanzen</div>
      <button className="lg:hidden p-2 rounded-md" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
    </div>
    <div className="mt-5 text-sm text-gray-500 font-medium pl-1">Discover</div>
    <nav className="mt-4 space-y-1 flex-1 overflow-y-auto">
      <SidebarItem icon={<Home size={18} />} text="Visão Geral" active={currentView === 'overview'} onClick={() => setCurrentView('overview')} />
      <SidebarItem icon={<PlusSquare size={18} />} text="Adicionar receita" onClick={() => { setTransactionType('Receita'); setShowModal(true); }}/>
      <SidebarItem icon={<MinusSquare size={18} />} text="Adicionar despesa" onClick={() => { setTransactionType('Despesa'); setShowModal(true); }}/>
      <SidebarItem icon={<Target size={18} />} text="Metas" active={currentView === 'goals'} onClick={() => setCurrentView('goals')} />
     <SidebarItem icon={<FileText size={18} />} text="Orçamentos" active={currentView === 'budgets'} onClick={() => setCurrentView('budgets')} />
      <SidebarItem icon={<BarChart3 size={18} />} text="Relatórios" active={currentView === 'reports'} onClick={() => setCurrentView('reports')} />
      <SidebarItem icon={<Layers size={18} />} text="Gerenciar Categorias" onClick={() => setShowCategoriesModal(true)} />
      <SidebarItem icon={<Settings size={18} />} text="Configurações" />
    </nav>
    <SidebarItem icon={<LogOut size={18} />} text="Sair" className="mt-auto" onClick={onLogout} />
  </div>
);

const OverviewContent = ({ user, currentMonth, setCurrentMonth, setShowModal, categories }) => (
  <div className="flex-1 flex flex-col overflow-hidden">
    <header className="border-b border-gray-200 p-4 flex flex-col lg:flex-row justify-between items-center">
      <div className="flex space-x-2 lg:space-x-4 overflow-x-auto w-full lg:w-auto py-2 scrollbar-hide">
        {['Mês atual', 'Mês anterior', 'Ano'].map(month => (
          <button key={month} className={`px-3 lg:px-4 py-2 font-medium text-sm whitespace-nowrap ${currentMonth === month ? 'border-b-2 border-black' : 'text-gray-500 hover:border-b-2 hover:border-gray-300'}`} onClick={() => setCurrentMonth(month)}>{month}</button>
        ))}
      </div>
      <button className={`${primaryBtnClasses} w-full lg:w-auto mt-2 lg:mt-0 text-sm`} onClick={() => setShowModal(true)}>
        Nova Transação
      </button>
    </header>
    <main className="p-4 lg:p-6 flex-1 overflow-y-auto">
      <h1 className="text-xl lg:text-2xl font-bold">Olá, {user?.name}! 👋 Pronto pra cuidar da sua grana?</h1>
      
      <section className="mt-6 lg:mt-8">
        <h2 className="text-lg lg:text-xl font-bold">Seu resumo de Abril</h2>
        <p className="text-sm text-gray-500 mt-1">Veja como andam suas finanças nesse mês</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mt-4">
          <SummaryCard title="Saldo Atual" value="R$ 5.200,00" />
          <SummaryCard title="Total de receitas" value="R$ 8.000,00" />
          <SummaryCard title="Total de despesas" value="R$ 2.800,00" />
        </div>
      </section>

      <section className="mt-6 lg:mt-8">
        <h2 className="text-lg lg:text-xl font-bold">Últimas movimentações</h2>
        <p className="text-sm text-gray-500 mt-1">Visualize suas transações mais recentes</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <TransactionCard icon={<Coffee size={20} />} category="Alimentação" value="-R$ 45,00" date="10/04/2024" />
          <TransactionCard icon={<Car size={20} />} category="Transporte" value="-R$ 120,00" date="08/04/2024" />
          <TransactionCard icon={<User size={20} />} category="Lazer" value="-R$ 50,00" date="07/04/2024" />
          <TransactionCard icon={<User size={20} />} category="Lazer" value="-R$ 120,00" date="04/04/2024" />
        </div>
      </section>

      <section className="mt-6 lg:mt-8">
        <h2 className="text-lg lg:text-xl font-bold">Suas metas financeiras</h2>
        <p className="text-sm text-gray-500 mt-1">Acompanhe o progresso</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GoalCard icon={<Plane size={20} />} title="Viajar" progress={60} value="R$ 3.000 / R$ 5.000" />
            <GoalCard icon={<Shield size={20} />} title="Reserva de emergencia" progress={40} value="R$ 2.000 / R$ 5.000" />
            <GoalCard icon={<ShoppingBag size={20} />} title="Compras" progress={50} value="R$ 1.000 / R$ 2.000" />
            <GoalCard icon={<Plane size={20} />} title="Curso Novo" progress={30} value="R$ 700 / R$ 2.300" label="Novo!" />
          </div>
          <aside className="bg-white p-4 rounded border border-gray-200">
            <h3 className="font-medium">Orçamentos definidos</h3>
            <p className="text-sm text-gray-500 mt-1">Veja quanto já foi gasto por categoria</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categories.slice(0, 4).map(c => <button key={c.id} className="bg-gray-100 py-2 px-4 rounded text-sm font-medium hover:bg-gray-200">{c.name}</button>)}
            </div>
          </aside>
        </div>
      </section>
    </main>
  </div>
);

const TransactionModal = ({ showModal, setShowModal, transactionType, setTransactionType, transactionData, handleValorChange, handleTransactionChange, categories }) => {
  if (!showModal) return null;

  const handleSaveTransaction = () => {
    console.log('Salvar transação:', { ...transactionData, valor: parseCurrency(transactionData.valor), type: transactionType });
    setShowModal(false);
  };

  const selectArrow = <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"><svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.14-.446 1.576 0 .436.445.408 1.197 0 1.615l-3.734 3.704c-.533.529-1.394.529-1.928 0L5.516 9.163c-.409-.418-.436-1.17 0-1.615z"/></svg></div>;

  return (
    <div className={modalBackdropClasses} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
      <div className={`${modalContentClasses} max-w-md`}>
        <div className="p-4 lg:p-6">
          <header className="flex justify-between items-center mb-6">
            <h2 className="text-xl lg:text-2xl font-bold">Nova {transactionType}</h2>
            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
          </header>

          <div className="inline-flex rounded-md overflow-hidden border border-gray-300 mb-6">
            {['Receita', 'Despesa'].map(t => (
              <button key={t} className={`px-4 lg:px-6 py-2 cursor-pointer text-sm ${transactionType === t ? 'bg-gray-200 font-medium' : 'bg-gray-50 hover:bg-gray-100'}`} onClick={() => setTransactionType(t)}>{t}</button>
            ))}
          </div>
          
          <div className="space-y-4 mb-6">
            <FormField label="Valor">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">R$</span>
              <input type="text" name="valor" value={transactionData.valor} onChange={handleValorChange} className={`${inputClasses} pl-10`} placeholder="0,00" />
            </FormField>
            <FormField label="Data">
              <input type="date" name="date" value={transactionData.date} onChange={handleTransactionChange} className={inputClasses} />
            </FormField>
            <FormField label="Categoria">
              <select name="category" value={transactionData.category} onChange={handleTransactionChange} className={`${inputClasses} appearance-none bg-white`} defaultValue="">
                <option value="" disabled>Selecione</option>
                {categories.map(category => <option key={category.id} value={category.name}>{category.name}</option>)}
              </select>
              {selectArrow}
            </FormField>
            <FormField label="Descrição">
              <input type="text" name="description" value={transactionData.description} onChange={handleTransactionChange} maxLength={30} className={inputClasses} placeholder="(Máx 30 caracteres)" />
            </FormField>
          </div>
          
          <button className={`${primaryBtnClasses} w-full py-3`} onClick={handleSaveTransaction}>
            Salvar Transação
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoriesModal = ({ showCategoriesModal, setShowCategoriesModal, categories, setCategories }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  if (!showCategoriesModal) return null;

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory = { id: Date.now(), name: newCategoryName.trim(), type: 'custom', usedIn: [] };
    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName('');
  };

  const handleSaveEdit = () => {
    if (!editingCategory?.name.trim()) return;
    setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? { ...cat, name: editingCategory.name.trim() } : cat));
    setEditingCategory(null);
  };
  
  const confirmDelete = () => {
    setCategories(prev => prev.filter(cat => cat.id !== deletingId));
    setDeletingId(null);
  };

  const handleKeyPress = (event, action) => {
    if (event.key === 'Enter') {
      action();
    }
  };

  const CategoryRow = ({ category }) => {
    const isEditing = editingCategory?.id === category.id;
    return (
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3">
          {isEditing ? (
            <input type="text" value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} onKeyPress={(e) => handleKeyPress(e, handleSaveEdit)} className={`${inputClasses} text-sm py-1`} autoFocus />
          ) : (
            <span className="font-medium">{category.name}</span>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">{category.usedIn.join(', ') || 'Nenhuma'}</td>
        <td className="px-4 py-3">
          <div className="flex justify-center gap-3">
            {isEditing ? (
              <>
                <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-800" title="Salvar">✓</button>
                <button onClick={() => setEditingCategory(null)} className="text-gray-600 hover:text-gray-800" title="Cancelar">✕</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditingCategory({ id: category.id, name: category.name })} className="text-blue-600 hover:text-blue-800" title="Editar"><Edit2 size={16} /></button>
                <button onClick={() => setDeletingId(category.id)} className="text-red-600 hover:text-red-800" title="Excluir"><Trash2 size={16} /></button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className={modalBackdropClasses}>
      {deletingId && <DeleteAlert onConfirm={confirmDelete} onCancel={() => setDeletingId(null)} />}
      <div className={`${modalContentClasses} max-w-2xl max-h-[80vh] flex flex-col`}>
        <header className="p-4 lg:p-6 flex justify-between items-center border-b">
          <h2 className="text-xl lg:text-2xl font-bold">Gerenciar Categorias</h2>
          <button onClick={() => setShowCategoriesModal(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
        </header>

        <div className="p-4 lg:p-6 bg-gray-50">
          <h3 className="font-medium mb-3">Nova Categoria</h3>
          <div className="flex gap-2">
            <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} onKeyPress={(e) => handleKeyPress(e, handleAddCategory)} placeholder="Nome da categoria" className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200" />
            <button onClick={handleAddCategory} className={primaryBtnClasses}><Plus size={16} /> Adicionar</button>
          </div>
        </div>

        <div className="overflow-y-auto px-4 lg:px-6 pb-6">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Áreas usadas</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map(category => <CategoryRow key={category.id} category={category} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FinanceApp = ({ user, onLogout }) => {
  const [currentMonth, setCurrentMonth] = useState('Mês atual');
  const [currentView, setCurrentView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [transactionType, setTransactionType] = useState('Receita');
  const [transactionData, setTransactionData] = useState({ valor: '0,00', date: '', description: '', category: '' });
  const [categories, setCategories] = useState([
    { id: 1, name: 'Alimentação', type: 'default', usedIn: ['Despesas', 'Orçamento'] },
    { id: 2, name: 'Transporte', type: 'default', usedIn: ['Despesas', 'Orçamento'] },
    { id: 3, name: 'Lazer', type: 'default', usedIn: ['Despesas', 'Metas'] },
    { id: 4, name: 'Compras', type: 'default', usedIn: ['Despesas', 'Orçamento'] },
    { id: 5, name: 'Salário', type: 'default', usedIn: ['Receitas'] },
    { id: 6, name: 'Viagem', type: 'default', usedIn: ['Metas'] }
  ]);

  const handleValorChange = e => setTransactionData(prev => ({ ...prev, valor: formatCurrency(e.target.value) }));
  const handleTransactionChange = ({ target: { name, value } }) => setTransactionData(prev => ({ ...prev, [name]: value }));
  const handleCloseModal = () => {
    setShowModal(false);
    setTransactionData({ valor: '0,00', date: '', description: '', category: '' }); // Reseta o formulário
  };

  const isModalOpen = showModal || showCategoriesModal;

  const renderContent = () => {
  switch (currentView) {
    case 'reports':
      return <ReportsScreen />;
    case 'goals':
      return <GoalsScreen categories={categories}/>;
    case 'budgets':
      return <BudgetsScreen categories={categories}/>;
    case 'overview':
    default:
      return (
        <OverviewContent
          user={user}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          setShowModal={setShowModal}
          categories={categories}
        />
      );
  }
};

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Overlay para fechar a sidebar em telas menores */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setTransactionType={setTransactionType}
        setShowModal={setShowModal}
        onLogout={onLogout}
        currentView={currentView}
        setCurrentView={setCurrentView}
        setShowCategoriesModal={setShowCategoriesModal}
      />
      
      {/* Área de conteúdo principal, que fica com blur quando um modal está aberto */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-filter duration-300 ${isModalOpen ? 'filter blur-sm pointer-events-none' : ''}`}>
        <div className="lg:hidden flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-gray-500"><Menu size={24} /></button>
          <div className="font-bold text-lg">Finanzen</div>
        </div>
        {renderContent()}
      </div>
      
      {/* Modais são renderizados fora da área de conteúdo principal para não serem afetados pelo blur */}
      <TransactionModal
        showModal={showModal}
        setShowModal={handleCloseModal}
        transactionType={transactionType}
        setTransactionType={setTransactionType}
        transactionData={transactionData}
        handleValorChange={handleValorChange}
        handleTransactionChange={handleTransactionChange}
        categories={categories}
      />
      <CategoriesModal
        showCategoriesModal={showCategoriesModal}
        setShowCategoriesModal={setShowCategoriesModal}
        categories={categories}
        setCategories={setCategories}
      />
    </div>
  );
};

export default FinanceApp;