
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UserConfig {
  nome: string;
  email: string;
  moeda: string;
  notificacoes: boolean;
  backupAutomatico: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}
