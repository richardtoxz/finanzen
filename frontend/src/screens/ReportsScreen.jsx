// TODO: Conectar à API quando os endpoints de Relatórios forem implementados
import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const ReportsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Este mês');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Dados para o gráfico de pizza
  const pieData = [
    { name: 'Transporte', value: 35, color: '#1e40af' },
    { name: 'Compras', value: 25, color: '#3b82f6' },
    { name: 'Lazer', value: 20, color: '#06b6d4' },
    { name: 'Alimentação', value: 20, color: '#c4b5fd' }
  ];

  // Dados para o gráfico de barras
  const barData = [
    { month: 'Jan', receitas: 6000, despesas: 3000 },
    { month: 'Fev', receitas: 12000, despesas: 8000 },
    { month: 'Mar', receitas: 11000, despesas: 7500 },
    { month: 'Abr', receitas: 7500, despesas: 12000 }
  ];

  return (
    <div className="p-6 flex-1 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-sm text-gray-500 mt-1">Acompanhe o progresso</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Receitas Totais</h3>
          <p className="text-2xl font-bold mt-1">R$ 12.000</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Despesas Totais</h3>
          <p className="text-2xl font-bold mt-1">R$ 8.500</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Saldo Final</h3>
          <p className="text-2xl font-bold mt-1">R$ 3.500</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Meta de Economia</h3>
            </div>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
              Alcançada
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="block w-full bg-white border border-gray-300 px-3 py-2 pr-8 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 appearance-none cursor-pointer"
          >
            <option>Este mês</option>
            <option>Mês anterior</option>
            <option>Últimos 3 meses</option>
            <option>Este ano</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full bg-white border border-gray-300 px-3 py-2 pr-8 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 appearance-none cursor-pointer"
          >
            <option>Todas</option>
            <option>Alimentação</option>
            <option>Transporte</option>
            <option>Lazer</option>
            <option>Compras</option>
          </select>
        </div>
      </div>

      {/* Gráfico de Pizza */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <div className="flex justify-center">
          <div className="w-80 h-80">
            <ResponsiveContainer width="100%" height="100%">
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
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <div className="grid grid-cols-2 gap-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de Barras */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold mb-6">Receitas e despesas</h3>
        
        <div className="flex gap-6 mb-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-600 mr-2" />
            <span className="text-sm text-gray-700">Despesas</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-300 mr-2" />
            <span className="text-sm text-gray-700">Receitas</span>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Bar dataKey="despesas" fill="#1e40af" radius={[2, 2, 0, 0]} />
              <Bar dataKey="receitas" fill="#c4b5fd" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsScreen;