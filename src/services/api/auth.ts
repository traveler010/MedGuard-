import { request } from './client';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'patient' | 'doctor';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export const authApi = {
  async register(data: RegisterPayload): Promise<UserResponse> {
    return request<UserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: LoginPayload): Promise<TokenResponse> {
    const res = await request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (typeof window !== 'undefined' && res.access_token) {
      localStorage.setItem('medguard_token', res.access_token);
      localStorage.setItem('medguard_user', JSON.stringify(res.user));
    }
    return res;
  },

  async getMe(token?: string): Promise<UserResponse> {
    return request<UserResponse>('/auth/me', {
      method: 'GET',
      token,
    });
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medguard_token');
      localStorage.removeItem('medguard_user');
    }
  },
};
