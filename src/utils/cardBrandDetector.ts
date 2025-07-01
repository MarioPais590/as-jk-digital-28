
export const getCardBrand = (cardNumber: string): string => {
  // Remove espaços e caracteres não numéricos
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  if (cleanNumber.startsWith('4')) {
    return 'visa';
  } else if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) {
    return 'mastercard';
  } else if (cleanNumber.startsWith('6')) {
    return 'elo';
  } else if (cleanNumber.startsWith('3')) {
    return 'amex';
  } else {
    return 'generico';
  }
};

export const getCardBrandImage = (cardNumber: string): string => {
  const brand = getCardBrand(cardNumber);
  return `/bandeiras/${brand}.png`;
};

export const formatCardNumber = (cardNumber: string): string => {
  // Remove espaços e caracteres não numéricos
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // Se o número tem menos de 4 dígitos, retorna como está
  if (cleanNumber.length < 4) {
    return cleanNumber;
  }
  
  // Mascara o número, mostrando apenas os últimos 4 dígitos
  const lastFour = cleanNumber.slice(-4);
  const masked = '**** **** **** ' + lastFour;
  
  return masked;
};
