
export const validateTransactionAmount = (amount: number): { isValid: boolean; error?: string } => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return { isValid: false, error: 'Valor deve ser um número válido' };
  }
  
  if (amount < 0) {
    return { isValid: false, error: 'Valor não pode ser negativo' };
  }
  
  if (amount > 999999999.99) {
    return { isValid: false, error: 'Valor muito alto' };
  }
  
  return { isValid: true };
};

export const validateTransactionDate = (date: string): { isValid: boolean; error?: string } => {
  if (!date || date.trim() === '') {
    return { isValid: false, error: 'Data é obrigatória' };
  }
  
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return { isValid: false, error: 'Data inválida' };
  }
  
  const today = new Date();
  const maxDate = new Date(today.getFullYear() + 10, today.getMonth(), today.getDate());
  
  if (parsedDate > maxDate) {
    return { isValid: false, error: 'Data muito distante no futuro' };
  }
  
  return { isValid: true };
};

export const validateCategory = (category: string): { isValid: boolean; error?: string } => {
  if (!category || category.trim() === '') {
    return { isValid: false, error: 'Categoria é obrigatória' };
  }
  
  if (category.length > 100) {
    return { isValid: false, error: 'Categoria muito longa' };
  }
  
  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potential XSS characters
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};
