import { createContext, useContext, useState, ReactNode } from 'react';
import { TOKEN_KEY, USER_REF } from '../constant/constant';

interface AuthData {
  accessToken: string;
  username: string;
}

interface AuthContextType {
  auth: AuthData | null;
  login: (data: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthData | null>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const username = localStorage.getItem(USER_REF);
    return token && username ? { accessToken: token, username } : null;
  });

  const login = (data: AuthData) => {
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(USER_REF, data.username);
    setAuth(data);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_REF);
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};