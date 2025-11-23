import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { MOCK_USERS } from '@/constants/MockData';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  position: string;
  department: string;
}

interface ScanRecord {
  id: string;
  name: string;
  company: string;
  address: string;
  phone: string;
  email: string;
  position: string;
  timestamp: string;
  scanId: number;
}

interface AuthContextType {
  currentUser: User | null;
  scanHistory: ScanRecord[];
  login: (username: string, password: string) => boolean;
  register: (userData: Partial<User> & { password: string }) => boolean;
  logout: () => void;
  addScanHistory: (scan: ScanRecord) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider(props: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);

  const login = (username: string, password: string): boolean => {
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const register = (userData: Partial<User> & { password: string }): boolean => {
    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      username: userData.username || '',
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || '',
      company: userData.company || '',
      position: userData.position || '',
      department: userData.department || '',
    };
    
    MOCK_USERS.push({ ...newUser, password: userData.password });
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setScanHistory([]);
  };

  const addScanHistory = (scan: ScanRecord) => {
    setScanHistory((prev) => [scan, ...prev]);
  };

  const contextValue: AuthContextType = {
    currentUser,
    scanHistory,
    login,
    register,
    logout,
    addScanHistory,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    props.children
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}