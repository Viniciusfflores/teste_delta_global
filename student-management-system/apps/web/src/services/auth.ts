import api from './api';
import type{ 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse, 
  UserResponse 
} from '../@types/auth.ts';

const authService = {

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  getMe: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/auth/me');
    return response.data;
  },

};

export default authService;