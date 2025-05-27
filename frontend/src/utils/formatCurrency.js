// Formats a raw string of digits or a number into BRL currency string (e.g., "1.234,56")
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0,00';
  let rawValue = String(value).replace(/\D/g, '');

  if (rawValue === '' || rawValue === '0') return '0,00';

  // Ensure we have at least 3 digits for pennies and initial integer part.
  rawValue = rawValue.padStart(1, '0'); // Pad with 0 if single digit e.g. "5" -> "05"

  const integerPart = rawValue.slice(0, -2) || '0';
  const decimalPart = rawValue.slice(-2).padStart(2,'0');

  const formattedInteger = parseInt(integerPart, 10).toLocaleString('pt-BR');

  return `${formattedInteger},${decimalPart}`;
};

// Parses a BRL currency string (e.g., "1.234,56") into a float number (e.g., 1234.56)
export const parseCurrency = (formattedValue) => {
  if (!formattedValue) return 0;
  const numericString = formattedValue.replace(/\./g, '').replace(',', '.');
  return parseFloat(numericString) || 0;
};