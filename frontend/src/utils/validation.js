export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePasswordRules = (password) => ({
  length: password.length >= 8,
  maxLength: password.length <= 82,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  special: /[!"#$%&'()*+,\-./:;<=>?@[\]\\\]^_`{|}~]/.test(password),
  numeric: /[0-9]/.test(password),
});

export const getPasswordErrors = (password) => {
  if (!password) return 'Senha é obrigatória';
  const rules = validatePasswordRules(password);
  const errors = Object.entries(rules).filter(([, isValid]) => !isValid).map(([rule]) => {
    switch (rule) {
      case 'length': return 'mínimo 8 caracteres';
      case 'maxLength': return 'máximo 82 caracteres';
      case 'uppercase': return '1 letra maiúscula';
      case 'lowercase': return '1 letra minúscula';
      case 'special': return '1 caractere especial';
      case 'numeric': return '1 número';
      default: return '';
    }
  });
  return errors.length ? `Senha deve ter: ${errors.join(', ')}` : '';
};