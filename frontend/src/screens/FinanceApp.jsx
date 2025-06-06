import { useState } from 'react';
import { Menu, X, PlusSquare, MinusSquare, Target, FileText, Layers, Settings, LogOut, Home, BarChart3, User, Car, Coffee, Plane, ShoppingBag, Shield } from 'lucide-react';
import SidebarItem from '../components/SidebarItem';
import SummaryCard from '../components/SummaryCard';
import TransactionCard from '../components/TransactionCard';
import GoalCard from '../components/GoalCard';
import { formatCurrency, parseCurrency } from '../utils/formatCurrency';

const Sidebar = ({ sidebarOpen, setSidebarOpen, setTransactionType, setShowModal, onLogout }) => (
  <div className={`fixed lg:static inset-y-0 left-0 w-64 lg:w-48 bg-white border-r border-gray-200 p-4 flex flex-col z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
    <div className="flex justify-between items-center">
      <div className="py-3 px-1 font-bold text-lg cursor-pointer">Finanzen</div>
      <button className="lg:hidden p-2 rounded-md text-gray-500 cursor-pointer hover:bg-gray-100" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
    </div>
    <div className="mt-5 text-sm text-gray-500 font-medium pl-1">Discover</div>
    <div className="mt-4 space-y-1 flex-1 overflow-y-auto">
      <SidebarItem icon={<Home size={18} />} text="Visão Geral" active />
      <SidebarItem icon={<PlusSquare size={18} />} text="Adicionar receita" onClick={() => { setTransactionType('Receita'); setShowModal(true); }}/>
      <SidebarItem icon={<MinusSquare size={18} />} text="Adicionar despesa" onClick={() => { setTransactionType('Despesa'); setShowModal(true); }}/>
      <SidebarItem icon={<Target size={18} />} text="Metas" />
      <SidebarItem icon={<FileText size={18} />} text="Orçamentos" />
      <SidebarItem icon={<BarChart3 size={18} />} text="Relatórios" />
      <SidebarItem icon={<Layers size={18} />} text="Gerenciar Categorias" />
      <SidebarItem icon={<Settings size={18} />} text="Configurações" />
    </div>
    <SidebarItem icon={<LogOut size={18} />} text="Sair" className="mt-auto" onClick={onLogout} />
  </div>
);

const MainContent = ({ user, currentMonth, setCurrentMonth, showModal, setShowModal }) => (
  <div className={`flex-1 flex flex-col overflow-hidden ${showModal ? 'filter blur-sm' : ''}`}>
    <div className="border-b border-gray-200 p-2 lg:p-4 flex flex-col lg:flex-row justify-between items-center">
      <div className="flex space-x-2 lg:space-x-4 overflow-x-auto w-full lg:w-auto py-2 scrollbar-hide">
        {['Mês atual', 'Mês anterior', 'Ano'].map(month => (
          <button key={month} className={`px-3 lg:px-4 py-2 font-medium text-sm whitespace-nowrap ${currentMonth === month ? 'border-b-2 border-black cursor-pointer' : 'text-gray-500 hover:border-b-2 hover:border-gray-300 cursor-pointer'}`} onClick={() => setCurrentMonth(month)}>{month}</button>
        ))}
      </div>
      <button className="w-full lg:w-auto mt-2 lg:mt-0 bg-black text-white px-4 py-2 rounded text-sm font-medium cursor-pointer hover:bg-gray-800" onClick={() => setShowModal(true)}>Nova Transação</button>
    </div>
    <div className="p-4 lg:p-6 flex-1 overflow-y-auto">
      <h1 className="text-xl lg:text-2xl font-bold">Olá, {user?.name}! 👋 Pronto pra cuidar da sua grana?</h1>
      <div className="mt-6">
        <h2 className="text-lg lg:text-xl font-bold">Seu resumo de Abril</h2>
        <p className="text-sm text-gray-500 mt-1">Veja como andam suas finanças nesse mês</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mt-3 lg:mt-4">
          <SummaryCard title="Saldo Atual" value="R$ 5.200,00" />
          <SummaryCard title="Total de receitas" value="R$ 8.000,00" />
          <SummaryCard title="Total de despesas" value="R$ 2.800,00" />
        </div>
      </div>
      <div className="mt-6 lg:mt-8">
        <h2 className="text-lg lg:text-xl font-bold">Últimas movimentações</h2>
        <p className="text-sm text-gray-500 mt-1">Visualize suas transações mais recentes</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-3 lg:mt-4">
          <TransactionCard icon={<Coffee size={20} />} category="Alimentação" value="-R$ 45,00" date="10/04/2024" />
          <TransactionCard icon={<Car size={20} />} category="Transporte" value="-R$ 120,00" date="08/04/2024" />
          <TransactionCard icon={<User size={20} />} category="Lazer" value="-R$ 50,00" date="07/04/2024" />
          <TransactionCard icon={<User size={20} />} category="Lazer" value="-R$ 120,00" date="04/04/2024" />
        </div>
      </div>
      <div className="mt-6 lg:mt-8">
        <h2 className="text-lg lg:text-xl font-bold">Suas metas financeiras</h2>
        <p className="text-sm text-gray-500 mt-1">Acompanhe o progresso</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 mt-3 lg:mt-4">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            <GoalCard icon={<Plane size={20} />} title="Viajar" progress={60} value="R$ 3.000 / R$ 5.000" />
            <GoalCard icon={<Shield size={20} />} title="Reserva de emergencia" progress={40} value="R$ 2.000 / R$ 5.000" />
            <GoalCard icon={<ShoppingBag size={20} />} title="Compras" progress={50} value="R$ 1.000 / R$ 2.000" />
            <GoalCard icon={<Plane size={20} />} title="Curso Novo" progress={30} value="R$ 700 / R$ 2.300" label="Novo!" />
          </div>
          <div className="bg-white p-4 rounded border border-gray-200">
            <h3 className="font-medium">Orçamentos definidos</h3>
            <p className="text-sm text-gray-500 mt-1">Veja quanto já foi gasto por categoria</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {['Alimentação', 'Compras', 'Lazer', 'Transporte'].map(c => (
                <button key={c} className="bg-gray-100 py-2 px-4 rounded text-sm font-medium hover:bg-gray-200 cursor-pointer">{c}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TransactionModal = ({ 
  showModal, 
  setShowModal, 
  transactionType, 
  setTransactionType, 
  transactionData, 
  handleValorChange,
  handleTransactionChange 
}) => {
  if (!showModal) return null;

  const handleSaveTransaction = () => {
    console.log('Salvar transação:', {
      ...transactionData, 
      valor: parseCurrency(transactionData.valor), 
      type: transactionType 
    });
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
      <div className="bg-white rounded-md shadow-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-4 lg:p-6">
          <div className="flex justify-between items-center mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-bold">Nova {transactionType}</h2>
            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
          </div>
          <div className="inline-flex rounded-md overflow-hidden border border-gray-300 mb-4 lg:mb-6">
            {['Receita', 'Despesa'].map(t => (
              <button key={t} className={`px-4 lg:px-6 py-2 cursor-pointer text-sm ${transactionType === t ? 'bg-gray-200 font-medium' : 'bg-gray-50 hover:bg-gray-100'}`} onClick={() => setTransactionType(t)}>{t}</button>
            ))}
          </div>
          <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Valor</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><span className="text-gray-500">R$</span></div>
                <input type="text" name="valor" value={transactionData.valor} onChange={handleValorChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400" placeholder="0,00" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Data</label>
              <input type="date" name="date" value={transactionData.date} onChange={handleTransactionChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Categoria</label>
              <div className="relative">
                <select name="category" value={transactionData.category} onChange={handleTransactionChange} className="block w-full bg-white border border-gray-300 px-3 py-2 pr-8 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 appearance-none cursor-pointer" defaultValue="">
                  <option value="" disabled>Selecione</option>
                  <option>Alimentação</option>
                  <option>Transporte</option>
                  <option>Lazer</option>
                  <option>Compras</option>
                  <option>Salário</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                    <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.14-.446 1.576 0 .436.445.408 1.197 0 1.615l-3.734 3.704c-.533.529-1.394.529-1.928 0L5.516 9.163c-.409-.418-.436-1.17 0-1.615z"/></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Descrição</label>
              <input type="text" name="description" value={transactionData.description} onChange={handleTransactionChange} maxLength={30} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400" placeholder="(Máx 30 caracteres)" />
            </div>
          </div>
          <button className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 cursor-pointer" onClick={handleSaveTransaction}>Salvar Transação</button>
        </div>
      </div>
    </div>
  );
};

const FinanceApp = ({ user, onLogout }) => {
  const [currentMonth, setCurrentMonth] = useState('Mês atual');
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState('Receita');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactionData, setTransactionData] = useState({ valor: '0,00', date: '', description: '', category: '' });

  const handleValorChange = e => {
    const formattedValue = formatCurrency(e.target.value);
    setTransactionData(prev => ({ ...prev, valor: formattedValue }));
  };

  const handleTransactionChange = ({ target: { name, value } }) => {
    if (name === 'description' && value.length > 30) return;
    setTransactionData(prev => ({ ...prev, [name]: value }));
  };

  const resetTransactionData = () => {
    setTransactionData({ valor: '0,00', date: '', description: '', category: '' });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetTransactionData();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
      <div className="lg:hidden flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-gray-500 cursor-pointer hover:bg-gray-100">
          <Menu size={24} />
        </button>
        <div className="font-bold text-lg">Finanzen</div>
      </div>
      {sidebarOpen && <div className="fixed inset-0 backdrop-blur-sm bg-opacity-20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setTransactionType={setTransactionType}
        setShowModal={setShowModal}
        onLogout={onLogout}
      />
      
      <MainContent 
        user={user}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      
      <TransactionModal 
        showModal={showModal}
        setShowModal={handleCloseModal}
        transactionType={transactionType}
        setTransactionType={setTransactionType}
        transactionData={transactionData}
        handleValorChange={handleValorChange}
        handleTransactionChange={handleTransactionChange}
      />
    </div>
  );
};

export default FinanceApp;