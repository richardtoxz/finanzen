import { useState, useMemo } from 'react';
import { Menu, X, PlusSquare, MinusSquare, Target, FileText, Layers, Settings, LogOut, Home, BarChart3, User, Car, Coffee, Plane, ShoppingBag, Shield, Edit2, Trash2, Plus } from 'lucide-react';
import { formatCurrency, parseCurrency } from '../utils/formatCurrency';
import ReportsScreen from './ReportsScreen';
import GoalsScreen from './GoalsScreen';
import BudgetsScreen from './BudgetsScreen';
import SettingsScreen from './SettingsScreen';

const commonClasses = {
    modalBackdrop: "fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4",
    modalContent: "bg-white rounded-xl shadow-2xl w-full border-0",
    input: "block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200",
    primaryBtn: "bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl",
    selectArrow: <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 pointer-events-none"><svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.14-.446 1.576 0 .436.445.408 1.197 0 1.615l-3.734 3.704c-.533.529-1.394.529-1.928 0L5.516 9.163c-.409-.418-.436-1.17 0-1.615z" /></svg></div>
};

const SidebarItem = ({ icon, text, active, onClick, className = '' }) => (
    <div onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-black text-white shadow-lg' : 'hover:bg-gray-100'} ${className}`}>
        {icon}
        <span className="text-sm font-medium">{text}</span>
    </div>
);

const DeleteAlert = ({ onConfirm, onCancel }) => (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white border border-red-200 rounded-xl shadow-2xl p-6 z-60 min-w-[380px]">
        <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            </div>
            <div className="ml-4 flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Tem certeza que deseja excluir?</h3>
                <p className="text-sm text-gray-500 mt-1">Esta ação não pode ser desfeita.</p>
                <div className="flex space-x-3 mt-4">
                    <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-xl hover:bg-red-700 transition-colors duration-200">Excluir</button>
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
);

const TransactionModal = ({ showModal, onClose, transactionType, setTransactionType, onSave, categories }) => {
    const [data, setData] = useState({ valor: '', date: new Date().toISOString().split('T')[0], description: '', category: '' });

    if (!showModal) return null;

    const handleSave = () => {
        if (!data.valor || !data.date || !data.category) return alert('Por favor, preencha todos os campos obrigatórios.');
        onSave({ ...data, valor: parseCurrency(data.valor), type: transactionType });
        setData({ valor: '', date: new Date().toISOString().split('T')[0], description: '', category: '' });
    };

    // Filtrar categorias baseado no tipo de transação
    const availableCategories = categories.filter(c => {
        if (transactionType === 'Receita') {
            return c.usedIn.includes('Receitas');
        } else {
            return c.usedIn.includes('Despesas');
        }
    });

    return (
        <div className={commonClasses.modalBackdrop} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={`${commonClasses.modalContent} max-w-md p-8`}>
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Nova {transactionType}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200"><X size={24} /></button>
                </header>
                <div className="inline-flex rounded-xl border border-gray-200 mb-8 p-1 bg-gray-50">
                    {['Receita', 'Despesa'].map(t => (
                        <button key={t} className={`px-6 py-2 text-sm rounded-lg transition-all duration-200 ${transactionType === t ? 'bg-white shadow-md font-semibold' : 'hover:bg-white/50'}`} onClick={() => setTransactionType(t)}>{t}</button>
                    ))}
                </div>
                <div className="space-y-6 mb-8">
                    <div><label className="block text-sm font-semibold text-gray-700 mb-3">Valor</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 font-medium">R$</span><input type="text" value={data.valor} onChange={e => setData(d => ({ ...d, valor: e.target.value }))} className={`${commonClasses.input} pl-12`} placeholder="0,00" /></div></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-3">Data</label><input type="date" name="date" value={data.date} onChange={e => setData(d => ({ ...d, date: e.target.value }))} className={commonClasses.input} /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-3">Categoria</label><div className="relative"><select name="category" value={data.category} onChange={e => setData(d => ({ ...d, category: e.target.value }))} className={`${commonClasses.input} appearance-none bg-white`}>
                        <option value="" disabled>Selecione uma categoria</option>
                        {availableCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>{commonClasses.selectArrow}</div></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-3">Descrição</label><input type="text" name="description" value={data.description} onChange={e => setData(d => ({ ...d, description: e.target.value }))} maxLength={30} className={commonClasses.input} placeholder="(Máx 30 caracteres)" /></div>
                </div>
                <button className={`${commonClasses.primaryBtn} w-full`} onClick={handleSave}>Salvar Transação</button>
            </div>
        </div>
    );
};

const CategoriesModal = ({ show, onClose, categories, setCategories }) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryUsage, setNewCategoryUsage] = useState(['Despesas']);
    const [editing, setEditing] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    if (!show) return null;

    const handleAction = (action) => (event) => event.key === 'Enter' && action();
    const handleAdd = () => {
        if (!newCategoryName.trim()) return;
        setCategories(prev => [...prev, { 
            id: Date.now(), 
            name: newCategoryName.trim(), 
            type: 'custom', 
            usedIn: newCategoryUsage 
        }]);
        setNewCategoryName('');
        setNewCategoryUsage(['Despesas']);
    };
    const handleSave = () => {
        if (!editing?.name.trim()) return;
        setCategories(prev => prev.map(c => c.id === editing.id ? { ...c, name: editing.name.trim(), usedIn: editing.usedIn } : c));
        setEditing(null);
    };
    const confirmDelete = () => {
        setCategories(prev => prev.filter(c => c.id !== deletingId));
        setDeletingId(null);
    };

    const handleUsageChange = (usage, checked, isEditing = false) => {
        if (isEditing) {
            setEditing(prev => ({
                ...prev,
                usedIn: checked 
                    ? [...prev.usedIn, usage]
                    : prev.usedIn.filter(u => u !== usage)
            }));
        } else {
            setNewCategoryUsage(prev => 
                checked 
                    ? [...prev, usage]
                    : prev.filter(u => u !== usage)
            );
        }
    };

    const usageOptions = ['Receitas', 'Despesas', 'Metas', 'Orçamento'];

    return (
        <div className={commonClasses.modalBackdrop}>
            {deletingId && <DeleteAlert onConfirm={confirmDelete} onCancel={() => setDeletingId(null)} />}
            <div className={`${commonClasses.modalContent} max-w-5xl max-h-[85vh] flex flex-col`}>
                <header className="p-8 flex justify-between items-center border-b border-gray-100"><h2 className="text-3xl font-bold">Gerenciar Categorias</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200"><X size={24} /></button></header>
                <div className="p-8 bg-gray-50/50">
                    <h3 className="font-semibold mb-4 text-lg">Nova Categoria</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                value={newCategoryName} 
                                onChange={(e) => setNewCategoryName(e.target.value)} 
                                onKeyPress={handleAction(handleAdd)} 
                                placeholder="Nome da categoria" 
                                className={`${commonClasses.input} flex-1`} 
                            />
                            <button onClick={handleAdd} className={commonClasses.primaryBtn}>
                                <Plus size={16} /> Adicionar
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Usar em:</label>
                            <div className="flex flex-wrap gap-3">
                                {usageOptions.map(option => (
                                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newCategoryUsage.includes(option)}
                                            onChange={(e) => handleUsageChange(option, e.target.checked)}
                                            className="rounded border-gray-300 text-black focus:ring-black"
                                        />
                                        <span className="text-sm">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow-y-auto px-8 pb-8">
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nome</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Áreas usadas</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.map(cat => (
                                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                        <td className="px-6 py-4">
                                            {editing?.id === cat.id ? (
                                                <input 
                                                    type="text" 
                                                    value={editing.name} 
                                                    onChange={(e) => setEditing({ ...editing, name: e.target.value })} 
                                                    onKeyPress={handleAction(handleSave)} 
                                                    className={`${commonClasses.input} text-sm py-2`} 
                                                    autoFocus 
                                                />
                                            ) : (
                                                <span className="font-medium">{cat.name}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editing?.id === cat.id ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {usageOptions.map(option => (
                                                        <label key={option} className="flex items-center gap-1 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={editing.usedIn.includes(option)}
                                                                onChange={(e) => handleUsageChange(option, e.target.checked, true)}
                                                                className="rounded border-gray-300 text-black focus:ring-black text-xs"
                                                            />
                                                            <span className="text-xs">{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-600">{cat.usedIn.join(', ')}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-3">
                                                {editing?.id === cat.id ? (
                                                    <>
                                                        <button onClick={handleSave} className="text-green-600 hover:text-green-700 font-semibold" title="Salvar">✓</button>
                                                        <button onClick={() => setEditing(null)} className="text-red-600 hover:text-red-700 font-semibold" title="Cancelar">✕</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => setEditing({ ...cat })} className="text-gray-600 hover:text-black transition-colors duration-200" title="Editar">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => setDeletingId(cat.id)} className="text-gray-600 hover:text-red-600 transition-colors duration-200" title="Excluir">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FinanceApp = ({ user, onLogout }) => {
    const [currentView, setCurrentView] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCategoriesModal, setShowCategoriesModal] = useState(false);
    const [transactionType, setTransactionType] = useState('Receita');
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [categories, setCategories] = useState([
        { id: 1, name: 'Alimentação', type: 'default', usedIn: ['Despesas', 'Orçamento', 'Metas'] },
        { id: 2, name: 'Transporte', type: 'default', usedIn: ['Despesas', 'Orçamento', 'Metas'] },
        { id: 3, name: 'Lazer', type: 'default', usedIn: ['Despesas', 'Metas', 'Orçamento'] },
        { id: 4, name: 'Compras', type: 'default', usedIn: ['Despesas', 'Orçamento', 'Metas'] },
        { id: 5, name: 'Salário', type: 'default', usedIn: ['Receitas'] },
        { id: 6, name: 'Viagem', type: 'default', usedIn: ['Metas'] },
        { id: 7, name: 'Freelance', type: 'default', usedIn: ['Receitas'] },
        { id: 8, name: 'Investimentos', type: 'default', usedIn: ['Receitas'] }
    ]);
    const [currentMonth, setCurrentMonth] = useState('Mês atual');

    const summary = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'Receita')
            .reduce((acc, t) => acc + t.valor, 0);
        
        const expense = transactions
            .filter(t => t.type === 'Despesa')
            .reduce((acc, t) => acc + t.valor, 0);
        
        return { 
            income: income,
            expense: expense,
            balance: income - expense
        };
    }, [transactions]);

    const handleAddTransaction = (newTransactionData) => {
        setTransactions(prev => [{ id: Date.now(), ...newTransactionData }, ...prev]);
        setShowModal(false);
    };

    const categoryIcons = { 'Alimentação': <Coffee size={20} />, 'Transporte': <Car size={20} />, 'Lazer': <User size={20} />, 'Compras': <ShoppingBag size={20} />, 'Salário': <PlusSquare size={20} />, 'Viagem': <Plane size={20} />, 'Reserva de emergencia': <Shield size={20} />, 'Curso Novo': <Target size={20} />, 'Freelance': <PlusSquare size={20} />, 'Investimentos': <PlusSquare size={20} />, 'default': <Layers size={20} /> };
    const getCategoryIcon = (name) => categoryIcons[name] || categoryIcons['default'];

    const isModalOpen = showModal || showCategoriesModal;

    const renderContent = () => {
        switch (currentView) {
            case 'reports': 
                return <ReportsScreen transactions={transactions} categories={categories} />;
            case 'goals': 
                return <GoalsScreen categories={categories} goals={goals} setGoals={setGoals} />;
            case 'budgets': 
                return <BudgetsScreen categories={categories} />;
            case 'settings': 
                return <SettingsScreen user={user} />;
            default: 
                return (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <header className="border-b border-gray-100 p-6 flex flex-col lg:flex-row justify-between items-center bg-white">
                            <div className="flex space-x-2 lg:space-x-6 overflow-x-auto w-full lg:w-auto py-2 scrollbar-hide">
                                {['Mês atual', 'Mês anterior', 'Ano'].map(m => (
                                    <button 
                                        key={m} 
                                        className={`px-4 py-3 font-semibold text-sm whitespace-nowrap rounded-xl transition-all duration-200 ${currentMonth === m ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`} 
                                        onClick={() => setCurrentMonth(m)}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                            <button className={`${commonClasses.primaryBtn} w-full lg:w-auto mt-4 lg:mt-0 text-sm`} onClick={() => setShowModal(true)}>
                                Nova Transação
                            </button>
                        </header>
                        <main className="p-8 flex-1 overflow-y-auto bg-gray-50/30">
                            <h1 className="text-3xl lg:text-5xl font-bold mb-2">Olá 😃 {user?.name}</h1>
                            <p className="text-lg text-gray-600 mb-12">Pronto pra cuidar da sua grana? 💸</p>
                            
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold mb-2">Seu resumo de {currentMonth.toLowerCase()}</h2>
                                <p className="text-gray-600 mb-6">Veja como andam suas finanças</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <h3 className="text-sm font-medium text-gray-600 mb-2">Saldo Atual</h3>
                                        <p className="text-3xl font-bold">{formatCurrency(summary.balance / 100)}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <h3 className="text-sm font-medium text-gray-600 mb-2">Total de receitas</h3>
                                        <p className="text-3xl font-bold text-green-600">{formatCurrency(summary.income / 100)}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <h3 className="text-sm font-medium text-gray-600 mb-2">Total de despesas</h3>
                                        <p className="text-3xl font-bold text-red-600">{formatCurrency(summary.expense / 100)}</p>
                                    </div>
                                </div>
                            </section>
                            
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold mb-2">Últimas movimentações</h2>
                                <p className="text-gray-600 mb-6">Visualize suas transações mais recentes</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {transactions.length > 0 ?
                                        transactions.slice(0, 4).map(t => (
                                            <div key={t.id} className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 sm:gap-4">
                                                <div className="bg-gray-100 p-2 sm:p-3 rounded-xl flex-shrink-0">
                                                    {getCategoryIcon(t.category)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold truncate">{t.category}</p>
                                                    <p className="text-sm text-gray-500 truncate">{new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                                                </div>
                                                <p className={`font-bold ${t.type === 'Receita' ? 'text-green-600' : 'text-red-600'} whitespace-nowrap flex-shrink-0`}>
                                                    {t.type === 'Receita' ? '' : '-'}{formatCurrency(t.valor / 100)}
                                                </p>
                                            </div>
                                        ))
                                        :
                                        <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100">
                                            <p className="text-gray-500 text-lg">Nenhuma transação registrada.</p>
                                        </div>
                                    }
                                </div>
                            </section>
                            
                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-2">Suas metas</h2>
                                <p className="text-gray-600 mb-6">Acompanhe o progresso</p>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {goals.length > 0 ? 
                                            goals.map(g => (
                                                <div key={g.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="bg-gray-100 p-3 rounded-xl">{getCategoryIcon(g.title)}</div>
                                                            <div>
                                                                <p className="font-bold text-lg">{g.title}</p>
                                                                <p className="text-sm text-gray-600">{`${formatCurrency(g.currentValue)} / ${formatCurrency(g.targetValue)}`}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">{g.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                                        <div className="bg-black h-3 rounded-full transition-all duration-300" style={{ width: `${g.progress}%` }}></div>
                                                    </div>
                                                </div>
                                            ))
                                            : 
                                            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100">
                                                <p className="text-gray-500 text-lg mb-4">Nenhuma meta definida.</p>
                                                <button 
                                                    onClick={() => setCurrentView('goals')} 
                                                    className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200"
                                                >
                                                    Criar Primeira Meta
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </section>
                        </main>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
            <div className={`fixed lg:static inset-y-0 left-0 w-72 lg:w-64 bg-white border-r border-gray-100 p-6 flex flex-col z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
                <div className="flex justify-between items-center mb-8">
                    <div className="py-2 px-1 font-bold text-2xl">Finanzen</div>
                    <button className="lg:hidden p-2 text-gray-400 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                <div className="text-xs text-gray-400 font-semibold pl-1 mb-4 uppercase tracking-wider">Discover</div>
                <nav className="space-y-2 flex-1 overflow-y-auto">
                    <SidebarItem icon={<Home size={18} />} text="Visão Geral" active={currentView === 'overview'} onClick={() => setCurrentView('overview')} />
                    <SidebarItem icon={<PlusSquare size={18} />} text="Adicionar receita" onClick={() => { setTransactionType('Receita'); setShowModal(true); }} />
                    <SidebarItem icon={<MinusSquare size={18} />} text="Adicionar despesa" onClick={() => { setTransactionType('Despesa'); setShowModal(true); }} />
                    <SidebarItem icon={<Target size={18} />} text="Metas" active={currentView === 'goals'} onClick={() => setCurrentView('goals')} />
                    <SidebarItem icon={<FileText size={18} />} text="Orçamentos" active={currentView === 'budgets'} onClick={() => setCurrentView('budgets')} />
                    <SidebarItem icon={<BarChart3 size={18} />} text="Relatórios" active={currentView === 'reports'} onClick={() => setCurrentView('reports')} />
                    <SidebarItem icon={<Layers size={18} />} text="Gerenciar Categorias" onClick={() => setShowCategoriesModal(true)} />
                    <SidebarItem icon={<Settings size={18} />} text="Configurações" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
                </nav>
                <SidebarItem icon={<LogOut size={18} />} text="Sair" className="mt-6 border-t border-gray-100 pt-4" onClick={onLogout} />
            </div>
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isModalOpen ? 'filter blur-sm pointer-events-none' : ''}`}>
                <div className="lg:hidden flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
                        <Menu size={24} />
                    </button>
                    <div className="font-bold text-xl">Finanzen</div>
                </div>
                {renderContent()}
            </div>
            <TransactionModal 
                showModal={showModal} 
                onClose={() => setShowModal(false)} 
                transactionType={transactionType} 
                setTransactionType={setTransactionType} 
                onSave={handleAddTransaction} 
                categories={categories} 
            />
            <CategoriesModal 
                show={showCategoriesModal} 
                onClose={() => setShowCategoriesModal(false)} 
                categories={categories} 
                setCategories={setCategories} 
            />
        </div>
    );
};

export default FinanceApp;