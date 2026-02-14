import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import type{ LoginCredentials, User} from '../@types/auth';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn(credentials: LoginCredentials): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const signOut = useCallback(() => {
    localStorage.removeItem('@App:token');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    async function loadStorageData() {
      const storageToken = localStorage.getItem('@App:token');

      if (storageToken) {
        try {
          const response = await authService.getMe();
          setUser(response.data);
        } catch (error) {
          signOut();
        }
      }
      setLoading(false);
    }

    loadStorageData();
  }, [signOut]);

  const signIn = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    
    const { user, token } = response.data;
    
    setUser(user);
    localStorage.setItem('@App:token', token);
    
    navigate('/dashboard');
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};