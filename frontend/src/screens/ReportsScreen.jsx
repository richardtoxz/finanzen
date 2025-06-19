import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';

const ReportsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mes_atual');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [reportsData, setReportsData] = useState(null);  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReportsData = async (periodo) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getReportsData(periodo);
      setReportsData(data);
    } catch (err) {
      console.error('Erro ao carregar dados dos relatórios:', err);
      setError('Erro ao carregar dados dos relatórios');
      if (err.response?.status === 401) {
        alert('Sessão expirada. Você será redirecionado para o login.');
        api.logout();
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadReportsData(selectedPeriod);
  }, [selectedPeriod]);
  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  const fallbackPieData = [
    { name: 'Carregando...', value: 100, color: '#e5e7eb' }
  ];

  const fallbackBarData = [
    { month: 'Carregando...', receitas: 0, despesas: 0 }
  ];

  const pieData = loading || error ? fallbackPieData : (reportsData?.pieChartData || []);
  const barData = loading || error ? fallbackBarData : (reportsData?.barChartData || []);

  return (
    <div className="p-6 flex-1 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-sm text-gray-500 mt-1">Acompanhe o progresso</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Receitas Totais</h3>
          <p className="text-2xl font-bold mt-1">
            {loading ? 'Carregando...' : error ? 'Erro' : 
             `R$ ${(reportsData?.summaryData?.receitas_totais || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Despesas Totais</h3>
          <p className="text-2xl font-bold mt-1">
            {loading ? 'Carregando...' : error ? 'Erro' : 
             `R$ ${(reportsData?.summaryData?.despesas_totais || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Saldo Final</h3>
          <p className="text-2xl font-bold mt-1">
            {loading ? 'Carregando...' : error ? 'Erro' : 
             `R$ ${(reportsData?.summaryData?.saldo_final || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          </p>
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
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
          <select 
            value={selectedPeriod} 
            onChange={handlePeriodChange}
            className="block w-full bg-white border border-gray-300 px-3 py-2 pr-8 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 appearance-none cursor-pointer"
          >
            <option value="mes_atual">Este mês</option>
            <option value="mes_anterior">Mês anterior</option>
            <option value="ano_atual">Este ano</option>
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
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <div className="flex justify-center">
          <div className="w-80 h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando dados...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-600">{error}</p>
              </div>
            ) : pieData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600">Nenhuma despesa encontrada para este período</p>              </div>
            ) : (
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
            )}
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