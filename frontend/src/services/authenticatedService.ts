import { api, tokenStore } from './api';
import type { AuthResponse, User } from './types';

export const authService = {
  async login(email: string, password: string) {
    const data = await api<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    tokenStore.set(data.accessToken, data.refreshToken);
    return data.user;
  },

  async register(name: string, email: string, password: string, language: string) {
    const data = await api<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, language }),
    });
    tokenStore.set(data.accessToken, data.refreshToken);
    return data.user;
  },

  async logout() {
    try {
      await api<void>('/auth/logout', { method: 'POST' });
    } finally {
      tokenStore.clear();
    }
  },

  me() {
    return api<User>('/users/me');
  },

  setLanguage(language: string) {
    return api<User>('/users/me/language', { method: 'PATCH', body: JSON.stringify({ language }) });
  },
};
