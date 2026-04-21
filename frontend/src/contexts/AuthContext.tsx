import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@shared/types';
import { createContext, useEffect, useState, type ReactNode } from 'react';
import { authApi, userApi } from '@/services/api';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  isAbortError,
  toApiError,
} from '@/services/apiClient';

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => void;
  clearError: () => void;
  refreshProfile: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

const readStoredToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

const persistSession = (auth: AuthResponse) => {
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, auth.token);
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(auth.user));

  if (auth.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, auth.refreshToken);
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
};

const clearSession = () => {
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => readStoredUser());
  const [token, setToken] = useState<string | null>(() => readStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(readStoredToken()));
  const [error, setError] = useState<string | null>(null);

  const applyAuth = (auth: AuthResponse) => {
    persistSession(auth);
    setUser(auth.user);
    setToken(auth.token);
    setError(null);
    return auth.user;
  };

  const logout = () => {
    clearSession();
    setUser(null);
    setToken(null);
    setError(null);
  };

  const refreshProfile = async (): Promise<User | null> => {
    if (!readStoredToken()) {
      setIsLoading(false);
      return null;
    }

    const controller = new AbortController();

    try {
      setIsLoading(true);
      const profile = await userApi.getProfile(controller.signal);
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
      setUser(profile);
      setToken(readStoredToken());
      setError(null);
      return profile;
    } catch (caughtError) {
      if (isAbortError(caughtError)) {
        return null;
      }

      const apiError = toApiError(caughtError);
      logout();
      setError(apiError.message);
      return null;
    } finally {
      setIsLoading(false);
      controller.abort();
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (!token) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const restoreSession = async () => {
      try {
        const profile = await userApi.getProfile(controller.signal);
        if (!isMounted) {
          return;
        }

        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
        setUser(profile);
        setError(null);
      } catch (caughtError) {
        if (!isMounted || isAbortError(caughtError)) {
          return;
        }

        const apiError = toApiError(caughtError);
        clearSession();
        setUser(null);
        setToken(null);
        setError(apiError.message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [token]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);

    try {
      const auth = await authApi.login(credentials);
      return applyAuth(auth);
    } catch (caughtError) {
      const apiError = toApiError(caughtError);
      setError(apiError.message);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);

    try {
      const auth = await authApi.register(credentials);
      return applyAuth(auth);
    } catch (caughtError) {
      const apiError = toApiError(caughtError);
      setError(apiError.message);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
