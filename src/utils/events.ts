
export const USER_EVENTS = {
  PROFILE_UPDATED: 'userProfileUpdated',
} as const;

export const dispatchUserProfileUpdate = (user: any) => {
  console.log('Disparando evento userProfileUpdated com:', user);
  
  // Disparar evento customizado
  window.dispatchEvent(new CustomEvent(USER_EVENTS.PROFILE_UPDATED, { 
    detail: user 
  }));

  // Disparar evento de storage como fallback
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'financas-jk-user',
    newValue: JSON.stringify(user),
    storageArea: localStorage
  }));
};
