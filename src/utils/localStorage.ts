
import { User, UserConfig } from '@/types/user';
import { Transaction } from '@/types/financial';

export const STORAGE_KEYS = {
  USER: 'financas-jk-user',
  USERS: 'financas-jk-users',
  DATA: 'financas-jk-data',
  THEME: 'financas-jk-theme',
  USER_AVATAR: 'financas-jk-user-avatar',
} as const;

export const storageUtils = {
  // User related storage
  getUser: (): User | null => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Users list storage
  getUsers: (): User[] => {
    try {
      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  },

  setUsers: (users: User[]): void => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  // Financial data storage
  getTransactions: (): Transaction[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DATA);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setTransactions: (transactions: Transaction[]): void => {
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(transactions));
  },

  clearAllData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.DATA);
  },

  // Theme storage
  getTheme: (): boolean => {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      return theme ? JSON.parse(theme) : false;
    } catch {
      return false;
    }
  },

  setTheme: (isDark: boolean): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDark));
  },

  // Avatar storage
  getUserAvatar: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.USER_AVATAR);
  },

  setUserAvatar: (avatar: string): void => {
    localStorage.setItem(STORAGE_KEYS.USER_AVATAR, avatar);
  },

  removeUserAvatar: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_AVATAR);
  }
};
