export const formatCurrency = (value) => {
  // Garante que o valor seja um número
  const numberValue = typeof value === 'string' 
    ? parseFloat(value.replace(/\./g, '').replace(',', '.')) 
    : value;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numberValue);
};

export const parseCurrency = (input) => {
  // Remove todos os caracteres não numéricos exceto vírgula e ponto
  let cleaned = input.replace(/[^\d,]/g, '').replace(',', '.');
  
  // Se não tem ponto decimal, adiciona .00
  if (!cleaned.includes('.')) {
    cleaned += '.00';
  }
  
  // Converte para float e multiplica por 100 para obter centavos
  const floatValue = parseFloat(cleaned);
  return Math.round(floatValue * 100);
};