import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatCurrency';

const ReportsScreen = ({ transactions = [], categories = [] }) => {
  const [period, setPeriod] = useState('Este mês');
  const [category, setCategory] = useState('Todas');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let filtered = transactions;

    // Filtro por período
    switch (period) {
      case 'Este mês':
        filtered = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === now.getMonth() && 
                 transactionDate.getFullYear() === now.getFullYear();
        });
        break;
      case 'Mês anterior': {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        filtered = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === lastMonth.getMonth() && 
                 transactionDate.getFullYear() === lastMonth.getFullYear();
        });
        break;
      }
      case 'Últimos 3 meses': {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        filtered = transactions.filter(t => new Date(t.date) >= threeMonthsAgo);
        break;
      }
      case 'Este ano':
        filtered = transactions.filter(t => new Date(t.date).getFullYear() === now.getFullYear());
        break;
      default:
        break;
    }

    // Filtro por categoria
    if (category !== 'Todas') {
      filtered = filtered.filter(t => t.category === category);
    }

    return filtered;
  }, [transactions, period, category]);

  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'Receita')
      .reduce((acc, t) => acc + (t.valor / 100), 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === 'Despesa')
      .reduce((acc, t) => acc + (t.valor / 100), 0);
    
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const pieData = useMemo(() => {
    const expensesByCategory = {};
    const expenses = filteredTransactions.filter(t => t.type === 'Despesa');
    
    expenses.forEach(t => {
      const valorReais = t.valor / 100;
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + valorReais;
    });

    const colors = ['#1e40af', '#3b82f6', '#06b6d4', '#c4b5fd', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'];
    
    return Object.entries(expensesByCategory)
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const barData = useMemo(() => {
    const monthlyData = {};
    
    filteredTransactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { m: monthKey, r: 0, d: 0 };
      }
      
      const valorReais = t.valor / 100;
      
      if (t.type === 'Receita') {
        monthlyData[monthKey].r += valorReais;
      } else {
        monthlyData[monthKey].d += valorReais;
      }
    });

    return Object.values(monthlyData).sort((a, b) => {
      const dateA = new Date(`01 ${a.m.replace('.', '')}`);
      const dateB = new Date(`01 ${b.m.replace('.', '')}`);
      return dateA - dateB;
    });
  }, [filteredTransactions]);

  const summaryCards = [
    { title: "Receitas Totais", value: formatCurrency(summary.income) },
    { title: "Despesas Totais", value: formatCurrency(summary.expense) },
    { title: "Saldo Final", value: formatCurrency(summary.balance) },
    { 
      title: "Status do Período", 
      value: summary.balance >= 0 ? "Positivo" : "Negativo", 
      isStatus: true,
      statusColor: summary.balance >= 0 ? "green" : "red"
    }
  ];

  const FilterSelect = ({ label, value, onChange, options }) => (
    <div className="flex-1">
      <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
      <div className="relative">
        <select 
          value={value} 
          onChange={onChange} 
          className="block w-full bg-white border border-gray-200 px-4 py-3 pr-10 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200 appearance-none"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 pointer-events-none">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.14-.446 1.576 0 .436.445.408 1.197 0 1.615l-3.734 3.704c-.533.529-1.394.529-1.928 0L5.516 9.163c-.409-.418-.436-1.17 0-1.615z"/>
          </svg>
        </div>
      </div>
    </div>
  );

  const availableCategories = ['Todas', ...categories.filter(c => c.usedIn.includes('Despesas')).map(c => c.name)];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="border-b border-gray-100 p-6 bg-white">
        <h1 className="text-3xl lg:text-5xl font-bold mb-2">Relatórios 📊</h1>
        <p className="text-lg text-gray-600">Acompanhe o progresso das suas finanças</p>
      </header>

      <main className="p-8 flex-1 overflow-y-auto bg-gray-50/30">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Resumo do período</h2>
          <p className="text-gray-600 mb-6">Visão geral das suas movimentações</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {summaryCards.map(card => (
              <div key={card.title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
                {card.isStatus ? (
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    card.statusColor === 'green' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {card.value}
                  </span>
                ) : (
                  <p className="text-3xl font-bold">{card.value}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Filtros</h2>
          <p className="text-gray-600 mb-6">Personalize a visualização dos dados</p>
          
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <FilterSelect 
              label="Período" 
              value={period} 
              onChange={(e) => setPeriod(e.target.value)} 
              options={['Este mês', 'Mês anterior', 'Últimos 3 meses', 'Este ano']} 
            />
            <FilterSelect 
              label="Categoria" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              options={availableCategories} 
            />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-center">Despesas por Categoria</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60} 
                      outerRadius={120} 
                      paddingAngle={5} 
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center flex-wrap gap-x-6 gap-y-3 mt-6">
                  {pieData.map(item => (
                    <div key={item.name} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({formatCurrency(item.value)})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhuma despesa encontrada no período selecionado.</p>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Receitas vs Despesas</h3>
            {barData.length > 0 ? (
              <>
                <div className="flex gap-6 mb-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                    <span className="text-sm font-medium">Despesas</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                    <span className="text-sm font-medium">Receitas</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="m" 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fontSize: 12, fill: '#6b7280' }} 
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fontSize: 12, fill: '#6b7280' }} 
                      tickFormatter={(val) => `R$${val.toFixed(0)}`} 
                    />
                    <Bar dataKey="d" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="r" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhuma transação encontrada no período selecionado.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReportsScreen;