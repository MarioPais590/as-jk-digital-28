
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  minLength: (value: string, length: number): boolean => {
    return value.trim().length >= length;
  }
};

export const validateUserProfile = (name: string, email: string) => {
  if (!validators.required(name)) {
    return { isValid: false, message: 'Nome é obrigatório.' };
  }

  if (!validators.required(email)) {
    return { isValid: false, message: 'E-mail é obrigatório.' };
  }

  if (!validators.email(email)) {
    return { isValid: false, message: 'Por favor, insira um e-mail válido.' };
  }

  return { isValid: true, message: '' };
};
