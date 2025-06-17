
import { useState, useEffect } from 'react';
import { User, AuthState, AuthResponse } from '@/types/user';
import { storageUtils } from '@/utils/localStorage';
import { validateUserProfile } from '@/utils/validators';
import { dispatchUserProfileUpdate } from '@/utils/events';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const savedUser = storageUtils.getUser();
    if (savedUser) {
      setAuthState({
        user: savedUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const updateProfile = (name: string, email: string): AuthResponse => {
    try {
      // Tentar recuperar o usuário do localStorage se não estiver no estado
      let currentUser = authState.user || storageUtils.getUser();

      if (!currentUser?.id) {
        return { success: false, message: 'Usuário não encontrado. Faça login novamente.' };
      }

      // Validar dados de entrada
      const validation = validateUserProfile(name, email);
      if (!validation.isValid) {
        return { success: false, message: validation.message };
      }

      // Atualizar dados do usuário
      const updatedUser: User = { ...currentUser, name, email };
      storageUtils.setUser(updatedUser);

      // Atualizar lista de usuários
      const savedUsers = storageUtils.getUsers();
      const userIndex = savedUsers.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        savedUsers[userIndex] = { ...savedUsers[userIndex], name, email };
        storageUtils.setUsers(savedUsers);
      }

      // Atualizar estado local imediatamente
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isAuthenticated: true
      }));

      // Disparar eventos de atualização
      dispatchUserProfileUpdate(updatedUser);

      return { success: true, message: 'Perfil atualizado com sucesso!' };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, message: 'Erro ao atualizar perfil. Tente novamente.' };
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const savedUsers = storageUtils.getUsers();
      const user = savedUsers.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        const userData: User = { id: user.id, name: user.name, email: user.email };
        storageUtils.setUser(userData);
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true, message: 'Login realizado com sucesso!' };
      } else {
        return { success: false, message: 'E-mail ou senha incorretos.' };
      }
    } catch (error) {
      return { success: false, message: 'Erro interno. Tente novamente.' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const savedUsers = storageUtils.getUsers();
      
      // Verificar se e-mail já existe
      if (savedUsers.some((u: any) => u.email === email)) {
        return { success: false, message: 'Este e-mail já está cadastrado.' };
      }

      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
      };

      savedUsers.push(newUser);
      storageUtils.setUsers(savedUsers);

      // Fazer login automático
      const userData: User = { id: newUser.id, name: newUser.name, email: newUser.email };
      storageUtils.setUser(userData);
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, message: 'Cadastro realizado com sucesso!' };
    } catch (error) {
      return { success: false, message: 'Erro interno. Tente novamente.' };
    }
  };

  const logout = () => {
    storageUtils.removeUser();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
  };
};
