
import CryptoJS from 'crypto-js';

// Simple encryption for credit card numbers (in production, use proper key management)
const ENCRYPTION_KEY = 'your-secret-key-should-be-in-env'; // In production, use proper key management

export const encryptCardNumber = (cardNumber: string): string => {
  if (!cardNumber) return '';
  return CryptoJS.AES.encrypt(cardNumber, ENCRYPTION_KEY).toString();
};

export const decryptCardNumber = (encryptedCardNumber: string): string => {
  if (!encryptedCardNumber) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedCardNumber, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error decrypting card number:', error);
    return '';
  }
};

export const maskCardNumber = (cardNumber: string): string => {
  if (!cardNumber || cardNumber.length < 4) return '';
  const lastFour = cardNumber.slice(-4);
  return `**** **** **** ${lastFour}`;
};

export const getLastFourDigits = (cardNumber: string): string => {
  if (!cardNumber) return '';
  return cardNumber.slice(-4);
};

export const validateCardNumber = (cardNumber: string): boolean => {
  // Basic Luhn algorithm validation
  const cleanNumber = cardNumber.replace(/\D/g, '');
  if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};
