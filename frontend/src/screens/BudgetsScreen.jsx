import { useState } from 'react';
import { Edit2, Trash2, X, Plus, Plane, ShoppingBag, Target, Utensils, Bus, PartyPopper, Home, Heart, Briefcase, Car, Gift } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

const DeleteAlert = ({ onConfirm, onCancel }) => (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white border border-red-200 rounded-xl shadow-2xl p-6 z-60 min-w-[380px]">
        <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
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

const BudgetModal = ({ show, onClose, onSave, editingBudget, budgetForm, setBudgetForm, categories }) => {
    if (!show) return null;

    // Função simplificada para manipulação de valores monetários
    const handleBudgetChange = (e) => {
        let input = e.target.value;

        // Remove tudo que não é número
        input = input.replace(/\D/g, '');

        // Se vazio, mantém vazio
        if (input === '') {
            setBudgetForm(f => ({ ...f, budget: '' }));
            return;
        }

        // Converte para centavos e formata
        const cents = parseInt(input);
        const formatted = (cents / 100).toFixed(2).replace('.', ',');

        setBudgetForm(f => ({ ...f, budget: formatted }));
    };

    const isFormInvalid = !budgetForm.category || !budgetForm.budget || parseFloat(budgetForm.budget.replace(',', '.')) <= 0;


    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">{editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        <X size={24} />
                    </button>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Categoria *</label>
                        <div className="relative">
                            <select
                                value={budgetForm.category}
                                onChange={(e) => setBudgetForm(f => ({ ...f, category: e.target.value }))}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200 appearance-none bg-white"
                                disabled={!!editingBudget}
                            >
                                <option value="" disabled>Selecione uma categoria</option>
                                {categories?.filter(c => c.usedIn.includes('Orçamento')).map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 pointer-events-none">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.14-.446 1.576 0 .436.445.408 1.197 0 1.615l-3.734 3.704c-.533.529-1.394.529-1.928 0L5.516 9.163c-.409-.418-.436-1.17 0-1.615z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Valor do Orçamento *</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 font-medium">R$</span>
                            <input
                                type="text"
                                value={budgetForm.budget}
                                onChange={handleBudgetChange}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200 pl-12"
                                placeholder="0,00"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-6 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isFormInvalid}
                        className="flex-1 py-3 px-6 bg-black text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-300 font-medium flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <Plus size={16} />
                        {editingBudget ? 'Salvar' : 'Criar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const BudgetsScreen = ({ categories }) => {
    const [budgets, setBudgets] = useState([]);
    const [currentMonth, setCurrentMonth] = useState('Mês atual');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [form, setForm] = useState({ category: '', budget: '' });

    // NOVA LÓGICA DE ÍCONES - Adicionar após os useState
    const icons = {
        'Viagem': <Plane size={20} />,
        'Compras': <ShoppingBag size={20} />,
        'Lazer': <PartyPopper size={20} />,
        'Transporte': <Bus size={20} />,
        'Alimentação': <Utensils size={20} />,
        'Moradia': <Home size={20} />,
        'Saúde': <Heart size={20} />,
        'Trabalho': <Briefcase size={20} />,
        'Veículo': <Car size={20} />,
        'Presentes': <Gift size={20} />,
        default: <Target size={20} />
    };
    const getIcon = (cat) => icons[cat] || icons.default;

    const handleOpenModal = (budget = null) => {
        setEditing(budget);
        setForm(budget ? {
            category: budget.category,
            budget: budget.budget.toFixed(2).replace('.', ',') // Formata corretamente
        } : { category: '', budget: '' }); // Inicia vazio
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditing(null);
        setForm({ category: '', budget: '0' });
    };

    const handleSave = () => {
        // Converte o valor formatado para número
        const parsedBudget = parseFloat(form.budget.replace(',', '.')) || 0;

        // Validação adicional
        if (parsedBudget <= 0) {
            alert('Por favor, insira um valor válido maior que zero.');
            return;
        }

        if (editing) {
            setBudgets(budgets.map(b => b.id === editing.id ? { ...b, budget: parsedBudget } : b));
        } else {
            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];
            setBudgets([...budgets, {
                id: Date.now(),
                category: form.category,
                spent: 0,
                budget: parsedBudget,
                color: colors[budgets.length % colors.length]
            }]);
        }
        handleCloseModal();
    };

    const confirmDelete = () => {
        setBudgets(budgets.filter(b => b.id !== deletingId));
        setDeletingId(null);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {deletingId && <DeleteAlert onConfirm={confirmDelete} onCancel={() => setDeletingId(null)} />}
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
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl w-full lg:w-auto mt-4 lg:mt-0 text-sm"
                >
                    Novo Orçamento
                </button>
            </header>
            <div className="p-8 text-center bg-white">
                <h1 className="text-3xl lg:text-5xl font-bold mb-2">Seus Orçamentos</h1>
                <p className="text-lg text-gray-600">Quanto você quer gastar em cada categoria</p>
            </div>
            <main className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                {budgets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {budgets.map(b => {
                            const percentage = Math.min((b.spent / b.budget) * 100, 100);
                            return (
                                <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                                                style={{ backgroundColor: b.color }}
                                            >
                                                {getIcon(b.category)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{b.category}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span>Gasto: <strong className="text-gray-700">{formatCurrency(b.spent)}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenModal(b)}
                                                className="text-gray-600 hover:text-black transition-colors duration-200"
                                                title="Editar"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => setDeletingId(b.id)}
                                                className="text-gray-600 hover:text-red-600 transition-colors duration-200"
                                                title="Excluir"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600">Orçamento Total</span>
                                            <span className="font-semibold">{formatCurrency(b.budget)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                            <div
                                                className="h-3 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%`, backgroundColor: b.color }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{percentage.toFixed(0)}% usado</span>
                                            <span>Restante: {formatCurrency(b.budget - b.spent)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto">
                        <p className="text-gray-500 text-lg mb-4">Nenhum orçamento criado ainda</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200"
                        >
                            Criar Primeiro Orçamento
                        </button>
                    </div>
                )}
            </main>
            <BudgetModal
                show={showModal}
                onClose={handleCloseModal}
                onSave={handleSave}
                editingBudget={editing}
                budgetForm={form}
                setBudgetForm={setForm}
                categories={categories}
            />
        </div>
    );
};

export default BudgetsScreen;