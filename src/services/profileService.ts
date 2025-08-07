
import { supabase } from '@/integrations/supabase/client';

export class ProfileService {
  static async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('nome, email, avatar_url')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateProfile(userId: string, updates: { nome?: string; email?: string; avatar_url?: string | null }) {
    const { data: currentProfile, error: getError } = await supabase
      .from('profiles')
      .select('nome, email')
      .eq('id', userId)
      .single();

    if (getError) throw getError;

    const profileData = {
      id: userId,
      nome: updates.nome || currentProfile.nome,
      email: updates.email || currentProfile.email,
      ...(updates.avatar_url !== undefined && { avatar_url: updates.avatar_url })
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(profileData, {
        onConflict: 'id'
      });
    
    if (error) throw error;
  }
}
