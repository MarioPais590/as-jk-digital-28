
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthResponse } from '@/types/user';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (nome: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome: nome
          }
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.' };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { success: false, message: 'Erro interno. Tente novamente.' };
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Login realizado com sucesso!' };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro interno. Tente novamente.' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const updateProfile = async (nome: string, email: string): Promise<AuthResponse> => {
    try {
      if (!user) {
        return { success: false, message: 'Usuário não encontrado.' };
      }

      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ nome, email })
        .eq('id', user.id);

      if (profileError) {
        return { success: false, message: profileError.message };
      }

      return { success: true, message: 'Perfil atualizado com sucesso!' };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, message: 'Erro interno. Tente novamente.' };
    }
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateProfile
  };
};
