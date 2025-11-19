"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { mockUsers, MockUser } from "@/lib/mock-data";
import { aiService } from "@/lib/ai-service";
import { showToast } from "@/lib/toast";

export interface User {
  id: string;
  email: string;
  role: "admin" | "athlete" | "coach" | "medic" | "nutritionist";
  firstName?: string;
  lastName?: string;
  subscription?: "free" | "pro" | "premium";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, full_name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const mockUserId = localStorage.getItem("mock_user_id");

        if (mockUserId) {
          // Load mock user
          const mockUser = mockUsers.find((u) => u.id === mockUserId);
          if (mockUser) {
            setUser({
              id: mockUser.id,
              email: mockUser.email,
              firstName: mockUser.firstName,
              lastName: mockUser.lastName,
              role: mockUser.role,
              subscription: mockUser.subscription,
            });

            const alerts = aiService.generateLoginAlerts(
              mockUser.id,
              mockUser.role
            );
            if (alerts.length > 0) {
              showToast(
                `AI generated ${alerts.length} new alert(s) for you`,
                "info"
              );
            }
          }
        } else if (token) {
          const response = await api.auth.me();
          setUser(response.data.user);
        }
      } catch (error) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("mock_user_id");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    refreshUser();
  }, []);

  const signUp = async (email: string, password: string, full_name: string) => {
    const response = await api.auth.signup(email, password, full_name);
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    setUser(response.data.user);
  };

  const signIn = async (email: string, password: string) => {
    // Check for mock users first
    const mockUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (mockUser) {
      localStorage.setItem("mock_user_id", mockUser.id);
      setUser({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
        subscription: mockUser.subscription,
      });

      const alerts = aiService.generateLoginAlerts(mockUser.id, mockUser.role);
      if (alerts.length > 0) {
        showToast(`AI generated ${alerts.length} new alert(s) for you`, "info");
      }
      return;
    }

    // Fall back to backend
    const response = await api.auth.signin(email, password);
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    setUser(response.data.user);
  };

  const signOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("mock_user_id");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
