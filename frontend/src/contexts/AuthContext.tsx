import React, { createContext, useEffect, useState } from 'react';
import type { LoginCredentials, RegisterCredentials } from '@travel-together/shared/types/auth.types';
import type { UpdateProfileDto, User } from '@travel-together/shared/types/user.types';
import {
  clearStoredAuthToken,
  getProfile,
  getStoredAuthToken,
  login as loginRequest,
  register as registerRequest,
  setStoredAuthToken,
  updateProfile as updateProfileRequest,
} from '@/api';

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  refreshProfile: () => Promise<User | null>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  token: string | null;
  updateProfile: (updates: UpdateProfileDto) => Promise<User>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => getStoredAuthToken());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(!!token);

  const applyAuth = (nextToken: string, nextUser: User) => {
    setStoredAuthToken(nextToken);
    setToken(nextToken);
    setCurrentUser(nextUser);
  };

  const clearAuth = () => {
    clearStoredAuthToken();
    setToken(null);
    setCurrentUser(null);
  };

  const refreshProfile = async () => {
    if (!token) {
      setCurrentUser(null);
      return null;
    }

    try {
      const profile = await getProfile();
      setCurrentUser(profile);
      return profile;
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const response = await loginRequest(credentials);
    applyAuth(response.token, response.user);
    return response.user;
  };

  const register = async (credentials: RegisterCredentials) => {
    const response = await registerRequest(credentials);
    applyAuth(response.token, response.user);
    return response.user;
  };

  const updateProfile = async (updates: UpdateProfileDto) => {
    const updatedUser = await updateProfileRequest(updates);
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  const logout = () => {
    clearAuth();
  };

  useEffect(() => {
    let isMounted = true;

    const hydrateAuth = async () => {
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const profile = await getProfile();

        if (isMounted) {
          setCurrentUser(profile);
        }
      } catch {
        if (isMounted) {
          clearAuth();
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    void hydrateAuth();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!token,
        isInitializing,
        login,
        logout,
        refreshProfile,
        register,
        token,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
