"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface User {
  email: string;
  role: string;
  paymentStatus?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🔥 INIT (Single Source of Truth)
  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          setLoading(false);
          return;
        }

        const res = await fetchWithAuth(`${API_URL}/auth/profile`);

        if (!res.ok) throw new Error("Invalid token");

        const userData = await res.json();

        setToken(storedToken);
        setUser(userData);

      } catch (err) {
        console.error("Auth init failed:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // 🔥 HANDLE SESSION EVENTS (expiry + unauthorized)
  useEffect(() => {
    const handleLogoutFlow = () => {
      logout();
      window.location.href = "/login?reason=unauthorized";
    };

    window.addEventListener("session-expired", handleLogoutFlow);
    window.addEventListener("unauthorized", handleLogoutFlow);

    return () => {
      window.removeEventListener("session-expired", handleLogoutFlow);
      window.removeEventListener("unauthorized", handleLogoutFlow);
    };
  }, []);

  // 🔥 MULTI-TAB SYNC
  useEffect(() => {
    const syncLogout = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        logout();
        window.location.href = "/login?reason=unauthorized";
      }
    };

    window.addEventListener("storage", syncLogout);

    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, []);

  // 🔥 INACTIVITY TIMER (15 min)
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        window.dispatchEvent(new Event("session-expired"));
      }, 15 * 60 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);

  // 🔥 LOGIN
  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user_email", user.email); // optional minimal storage

    setToken(token);
    setUser(user);
  };

  // 🔥 LOGOUT (guarded)
  const logout = () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    localStorage.removeItem("token");
    localStorage.removeItem("user_email");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 HOOK
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};