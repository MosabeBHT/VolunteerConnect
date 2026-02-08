"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, userStorage, type User } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user on mount — check cookie-based auth with backend
  useEffect(() => {
    const loadUser = async () => {
      const savedUser = userStorage.get();

      if (savedUser) {
        setUser(savedUser);
      }

      // Verify auth with backend (cookie is sent automatically)
      try {
        const response = await api.getMe();
        setUser(response.data);
        userStorage.set(response.data);
      } catch (error) {
        // Not authenticated or token invalid
        userStorage.remove();
        setUser(null);
      }
      
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      
      if (response.success) {
        const { user } = response.data;
        
        // Save to state and localStorage (cookie is set by server)
        setUser(user);
        userStorage.set(user);

        // Check for redirect parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('redirect');
        
        if (redirectPath) {
          router.push(redirectPath);
          return;
        }

        // Default redirect based on role
        if (user.role === 'VOLUNTEER') {
          router.push('/dashboard/volunteer');
        } else if (user.role === 'NGO') {
          router.push('/dashboard/ngo');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (data: any) => {
    try {
      const response = await api.register(data);
      
      if (response.success) {
        const { user } = response.data;
        
        // Save to state and localStorage (cookie is set by server)
        setUser(user);
        userStorage.set(user);

        // Check for redirect parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('redirect');
        
        if (redirectPath) {
          router.push(redirectPath);
          return;
        }

        // Default redirect based on role
        if (user.role === 'VOLUNTEER') {
          router.push('/dashboard/volunteer');
        } else if (user.role === 'NGO') {
          // Check if profile is complete (has mission and vision)
          const hasCompleteProfile = user.ngoProfile?.mission && user.ngoProfile?.vision;
          if (hasCompleteProfile) {
            router.push('/dashboard/ngo');
          } else {
            router.push('/dashboard/ngo/complete-profile');
          }
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    // Call logout endpoint to clear the HTTP-only cookie
    try {
      await api.logout();
    } catch (e) {
      // Ignore errors — clear local state regardless
    }

    // Clear state and localStorage
    setUser(null);
    userStorage.remove();

    // Redirect to home
    router.push('/');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    userStorage.set(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
