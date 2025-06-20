import React, { useState } from 'react';
import { Edit2, Trash2, X, Plane, ShoppingBag, Target, Utensils, Bus, PartyPopper, Plus } from 'lucide-react';
import GoalCard from '../components/GoalCard';
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

const GoalModal = ({ show, onClose, onSave, editingGoal, goalData, setGoalData, categories }) => {
    if (!show) return null;

    // Função simplificada para manipulação de valores monetários
    const handleTargetValueChange = (e) => {
        let input = e.target.value;

        // Remove tudo que não é número
        input = input.replace(/\D/g, '');

        // Se vazio, mantém vazio
        if (input === '') {
            setGoalData(g => ({ ...g, targetValue: '' }));
            return;
        }

        // Converte para centavos e formata
        const cents = parseInt(input);
        const formatted = (cents / 100).toFixed(2).replace('.', ',');

        setGoalData(g => ({ ...g, targetValue: formatted }));
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">{editingGoal ? 'Editar Meta' : 'Nova Meta'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        <X size={24} />
                    </button>
                </header>
                <div className="space-y-6 mb-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Valor da meta</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 font-medium">R$</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={goalData.targetValue}
                                onChange={handleTargetValueChange}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200 pl-12"
                                placeholder="0,00"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Categoria</label>
                        <div className="relative">
                            <select
                                value={goalData.category}
                                onChange={(e) => setGoalData(g => ({ ...g, category: e.target.value }))}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200 appearance-none bg-white"
                            >
                                <option value="" disabled>Selecione uma categoria</option>
                                {categories.filter(c => c.usedIn.includes('Metas')).map(c =>
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                )}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 pointer-events-none">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.14-.446 1.576 0 .436.445.408 1.197 0 1.615l-3.734 3.704c-.533.529-1.394.529-1.928 0L5.516 9.163c-.409-.418-.436-1.17 0-1.615z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Descrição</label>
                        <input
                            type="text"
                            value={goalData.description}
                            onChange={(e) => setGoalData(g => ({ ...g, description: e.target.value }))}
                            className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200"
                            placeholder="(opcional)"
                        />
                    </div>
                </div>
                <button
                    onClick={onSave}
                    className="w-full py-3 px-6 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl disabled:bg-gray-300"
                    disabled={!goalData.targetValue || !goalData.category}
                >
                    <Plus size={16} />
                    {editingGoal ? 'Salvar' : 'Criar Meta'}
                </button>
            </div>
        </div>
    );
};

const GoalsScreen = ({ categories, goals, setGoals }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [goalData, setGoalData] = useState({ title: '', targetValue: '0', currentValue: 0, category: '', description: '' });
    const [deletingId, setDeletingId] = useState(null);

    const icons = { 'Viagem': <Plane />, 'Compras': <ShoppingBag />, 'Lazer': <PartyPopper />, 'Transporte': <Bus />, 'Alimentação': <Utensils />, default: <Target /> };
    const getIcon = (cat) => icons[cat] || icons.default;

    const handleOpenModal = (goal = null) => {
        setEditingGoal(goal);
        setGoalData(goal ? {
            ...goal,
            targetValue: goal.targetValue.toFixed(2).replace('.', ',') // Formata corretamente
        } : { title: '', targetValue: '', currentValue: 0, category: '', description: '' }); // Inicia vazio
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingGoal(null);
    };

    const handleSaveGoal = () => {
    const target = parseFloat(goalData.targetValue.replace(',', '.')) || 0;

    // Validação adicional
    if (target <= 0) {
        alert('Por favor, insira um valor válido maior que zero.');
        return;
    }

    const newGoalData = {
        title: goalData.category,
        targetValue: target,
        category: goalData.category,
        description: goalData.description,
        // Não definimos currentValue e progress aqui - serão calculados automaticamente
        currentValue: 0,
        progress: 0,
        isCompleted: false
    };

    if (editingGoal) {
        setGoals(goals.map(g => (g.id === editingGoal.id ? { 
            ...g, 
            title: goalData.category,
            targetValue: target,
            category: goalData.category,
            description: goalData.description
        } : g)));
    } else {
        setGoals([...goals, { ...newGoalData, id: Date.now() }]);
    }
    handleCloseModal();
};


    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {deletingId && <DeleteAlert onConfirm={() => { setGoals(goals.filter(g => g.id !== deletingId)); setDeletingId(null); }} onCancel={() => setDeletingId(null)} />}
            <header className="border-b border-gray-100 p-6 flex justify-between items-center bg-white">
                <h1 className="text-2xl font-bold">Metas</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl"
                >
                    Nova Meta
                </button>
            </header>
            <div className="p-8 text-center bg-white">
                <h1 className="text-3xl lg:text-5xl font-bold mb-2">Suas metas financeiras</h1>
                <p className="text-lg text-gray-600">Acompanhe o seu progresso</p>
            </div>
            <main className="p-8 flex-1 overflow-y-auto bg-gray-50/30">
                {goals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {goals.map(goal => (
                            <div key={goal.id} className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1">
                                {/* Header com ícone e ações */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                            {React.cloneElement(getIcon(goal.category), { size: 20 })}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{goal.title}</h3>
                                            <p className="text-sm text-gray-500">{goal.description || 'Meta financeira'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={() => handleOpenModal(goal)}
                                            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                            title="Editar"
                                        >
                                            <Edit2 size={16} className="text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => setDeletingId(goal.id)}
                                            className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                            title="Excluir"
                                        >
                                            <Trash2 size={16} className="text-red-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Valores */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Gasto atual</span>
                                        <span className="text-lg font-bold text-gray-900">{formatCurrency(goal.currentValue)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Meta</span>
                                        <span className="text-lg font-bold text-blue-600">{formatCurrency(goal.targetValue)}</span>
                                    </div>
                                </div>

                                {/* Barra de progresso */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Progresso</span>
                                        <span className="text-sm font-bold text-blue-600">
                                            {Math.round(goal.progress || 0)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                        <div
                                            className="h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 relative overflow-hidden"
                                            style={{ width: `${Math.min(goal.progress || 0, 100)}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        </div>
                                    </div>
                                    {goal.isCompleted && (
                                        <p className="text-xs text-green-600 font-medium">🎉 Meta alcançada!</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto">
                        <p className="text-gray-500 text-lg mb-4">Nenhuma meta definida ainda</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200"
                        >
                            Criar Primeira Meta
                        </button>
                    </div>
                )}
            </main>
            <GoalModal
                show={showModal}
                onClose={handleCloseModal}
                onSave={handleSaveGoal}
                editingGoal={editingGoal}
                goalData={goalData}
                setGoalData={setGoalData}
                categories={categories}
            />
        </div>
    );
};

export default GoalsScreen;