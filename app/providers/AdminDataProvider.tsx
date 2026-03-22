"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type {
  ActivityItem,
  CommunityItem,
  CoupleItem,
  DashboardStats,
  PromptItem,
  UserItem,
  ReportItem,
} from "../lib/types";

interface AdminContextType {
  stats: DashboardStats;
  users: UserItem[];
  couples: CoupleItem[];
  communities: CommunityItem[];
  activities: ActivityItem[];
  prompts: PromptItem[];
  reports: ReportItem[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, pass: string) => Promise<boolean>;
  logout: () => void;
  // Actions
  addPrompt: (title: string, category: string) => Promise<void>;
  togglePrompt: (id: string) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  deleteCommunity: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCouples: 0,
    totalCommunities: 0,
    totalPrompts: 0,
    activeToday: 0,
  });
  const [users, setUsers] = useState<UserItem[]>([]);
  const [couples, setCouples] = useState<CoupleItem[]>([]);
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1/admin";

  const fetchAllData = useCallback(async (authToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/data`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const json = await res.json();
      if (json.success) {
        setStats(json.data.stats);
        setUsers(json.data.users);
        setCouples(json.data.couples);
        setCommunities(json.data.communities);
        setActivities(json.data.activities);
        setPrompts(json.data.prompts);
        setReports(json.data.reports || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchAllData(savedToken);
    } else {
      setIsLoading(false);
    }
  }, [fetchAllData]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const json = await res.json();
      if (json.success) {
        const authToken = json.data.token;
        localStorage.setItem("admin_token", authToken);
        setToken(authToken);
        setIsAuthenticated(true);
        fetchAllData(authToken);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login Error:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setIsAuthenticated(false);
    setUsers([]);
    setPrompts([]);
    setReports([]);
  };

  const addPrompt = async (title: string, category: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/prompts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, category }),
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      console.error("Add Prompt Error:", err);
    }
  };

  const togglePrompt = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/prompts/${id}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      console.error("Toggle Prompt Error:", err);
    }
  };

  const deletePrompt = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/prompts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      console.error("Delete Prompt Error:", err);
    }
  };

  const deleteUser = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      console.error("Delete User Error:", err);
    }
  };

  const deleteCommunity = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/communities/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      console.error("Delete Community Error:", err);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        stats,
        users,
        couples,
        communities,
        activities,
        prompts,
        reports,
        isLoading,
        isAuthenticated,
        login,
        logout,
        addPrompt,
        togglePrompt,
        deletePrompt,
        deleteUser,
        deleteCommunity,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminData must be used within AdminDataProvider");
  }
  return context;
}
