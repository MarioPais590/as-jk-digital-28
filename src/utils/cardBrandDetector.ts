
import React from 'react';

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

// SVG ícones das bandeiras embutidos
const cardIcons = {
  visa: React.createElement('svg', {
    width: "24",
    height: "16", 
    viewBox: "0 0 24 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    React.createElement('rect', { key: 'bg', width: "24", height: "16", rx: "3", fill: "#1A1F71" }),
    React.createElement('path', { key: 'logo', d: "M8.5 4.5h2.3l-1.4 7h-2.3l1.4-7zM13.2 4.5c.4 0 1.2.1 1.6.4l-.3 1.5c-.3-.2-.8-.3-1.3-.3-.5 0-.8.2-.8.5 0 .3.3.4.9.7.8.4 1.2.9 1.2 1.6 0 1.2-1 2-2.6 2-.7 0-1.4-.2-1.8-.4l.3-1.6c.4.2 1 .4 1.6.4.5 0 .9-.2.9-.6 0-.3-.2-.4-.8-.7-.6-.3-1.3-.8-1.3-1.5 0-1.1 1-2 2.4-2zM18.8 4.5c.5 0 .9.3 1.1.8l1.6 6.2h-2.2l-.3-1.5h-2.5l-.5 1.5h-2l2.8-7h2zm.1 2.2l-.8 2.4h1.6l-.8-2.4zM5.5 4.5l2.2 7H5.4l-1.8-5.5-.7 3.8-.1.9c0 .5-.4.8-.9.8H0l2.5-7h2.3l.7 5.7L5.5 4.5z", fill: "white" })
  ]),
  mastercard: React.createElement('svg', {
    width: "24",
    height: "16",
    viewBox: "0 0 24 16", 
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    React.createElement('rect', { key: 'bg', width: "24", height: "16", rx: "3", fill: "#EB001B" }),
    React.createElement('circle', { key: 'c1', cx: "9", cy: "8", r: "5", fill: "#FF5F00" }),
    React.createElement('circle', { key: 'c2', cx: "15", cy: "8", r: "5", fill: "#F79E1B" }),
    React.createElement('path', { key: 'overlap', d: "M12 4.5a4.99 4.99 0 000 7 4.99 4.99 0 000-7z", fill: "#FF5F00" })
  ]),
  elo: React.createElement('svg', {
    width: "24",
    height: "16",
    viewBox: "0 0 24 16",
    fill: "none", 
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    React.createElement('rect', { key: 'bg', width: "24", height: "16", rx: "3", fill: "#FFD700" }),
    React.createElement('path', { key: 'box', d: "M6 5h12v6H6z", fill: "#000" }),
    React.createElement('text', { key: 'text', x: "12", y: "10", textAnchor: "middle", fontSize: "6", fill: "#FFD700", fontWeight: "bold" }, "ELO")
  ]),
  amex: React.createElement('svg', {
    width: "24",
    height: "16",
    viewBox: "0 0 24 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    React.createElement('rect', { key: 'bg', width: "24", height: "16", rx: "3", fill: "#006FCF" }),
    React.createElement('path', { key: 'box', d: "M4 5h16v6H4z", fill: "#fff" }),
    React.createElement('text', { key: 'text', x: "12", y: "9.5", textAnchor: "middle", fontSize: "5", fill: "#006FCF", fontWeight: "bold" }, "AMEX")
  ]),
  generico: React.createElement('svg', {
    width: "24",
    height: "16",
    viewBox: "0 0 24 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    React.createElement('rect', { key: 'bg', width: "24", height: "16", rx: "3", fill: "#6B7280", stroke: "#D1D5DB" }),
    React.createElement('rect', { key: 'stripe', x: "4", y: "6", width: "16", height: "2", fill: "#D1D5DB" }),
    React.createElement('rect', { key: 'chip', x: "4", y: "10", width: "8", height: "1", fill: "#D1D5DB" })
  ])
};

export const getCardBrandIcon = (cardNumber: string): React.ReactElement => {
  const brand = getCardBrand(cardNumber);
  return cardIcons[brand as keyof typeof cardIcons] || cardIcons.generico;
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
