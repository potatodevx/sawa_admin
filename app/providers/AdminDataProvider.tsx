"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type {
  ActivityItem,
  CityStat,
  CommunityItem,
  CoupleItem,
  DashboardStats,
  PromptItem,
  UserItem,
  ReportItem,
  ChartDataPoint,
  ActivityLog,
} from "../lib/types";

export interface AddCommunityInput {
  name: string;
  description?: string;
  city: string;
  tags?: string[];
  coverImageUrl?: string;
  hostCoupleId?: string | null;
}

export interface UpdateCommunityInput {
  name?: string;
  description?: string;
  city?: string;
  tags?: string[];
  coverImageUrl?: string;
}

interface AdminContextType {
  stats: DashboardStats;
  users: UserItem[];
  couples: CoupleItem[];
  communities: CommunityItem[];
  activities: ActivityItem[];
  prompts: PromptItem[];
  reports: ReportItem[];
  chartData: ChartDataPoint[];
  cityDistribution: CityStat[];
  userLogs: ActivityLog[];
  communityLogs: ActivityLog[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  // Actions
  addPrompt: (title: string, category: string) => Promise<void>;
  togglePrompt: (id: string) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  deleteCouple: (id: string) => Promise<void>;
  banCouple: (id: string, reason?: string) => Promise<void>;
  unbanCouple: (id: string) => Promise<void>;
  deleteCommunity: (id: string) => Promise<void>;
  addCommunity: (data: AddCommunityInput) => Promise<void>;
  updateCommunity: (id: string, data: UpdateCommunityInput) => Promise<void>;
  resolveReport: (id: string, status: 'resolved' | 'dismissed') => Promise<void>;
  processJoinRequest: (
    communityId: string,
    requestId: string,
    decision: 'accept' | 'reject',
  ) => Promise<void>;
  sendNotification: (title: string, message: string, recipientIds?: string[]) => Promise<void>;
  refresh: () => Promise<void>;
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
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [userLogs, setUserLogs] = useState<ActivityLog[]>([]);
  const [communityLogs, setCommunityLogs] = useState<ActivityLog[]>([]);
  const [cityDistribution, setCityDistribution] = useState<CityStat[]>([]);
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

      // 401 → token expired/invalid; force re-login
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        setToken(null);
        setIsAuthenticated(false);
        return;
      }

      const json = await res.json();
      if (json.success) {
        setStats(json.data.stats);
        setUsers(json.data.users);
        setCouples(json.data.couples);
        setCommunities(json.data.communities);
        setActivities(json.data.activities);
        setPrompts(json.data.prompts);
        setReports(json.data.reports || []);
        setChartData(json.data.chartData || []);
        setUserLogs(json.data.userLogs || []);
        setCommunityLogs(json.data.communityLogs || []);
        setCityDistribution(json.data.cityDistribution || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

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

  const deleteCouple = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/couples/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      console.error("Delete Couple Error:", err);
    }
  };

  const banCouple = async (id: string, reason?: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/couples/${id}/ban`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: reason || null }),
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      console.error("Ban Couple Error:", err);
    }
  };

  const unbanCouple = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/couples/${id}/unban`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      console.error("Unban Couple Error:", err);
    }
  };

  const processJoinRequest = async (
    communityId: string,
    requestId: string,
    decision: 'accept' | 'reject',
  ) => {
    if (!token) return;
    try {
      const res = await fetch(
        `${API_URL}/communities/${communityId}/requests/${requestId}/${decision}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.ok) fetchAllData(token);
    } catch (err) {
      console.error("Process Join Request Error:", err);
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

  const updateCommunity = async (id: string, data: UpdateCommunityInput) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/communities/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      console.error("Update Community Error:", err);
    }
  };

  const resolveReport = async (id: string, status: 'resolved' | 'dismissed') => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      console.error("Resolve Report Error:", err);
    }
  };

  const addCommunity = async (data: AddCommunityInput) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/communities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      console.error("Add Community Error:", err);
    }
  };

  const refresh = useCallback(async () => {
    if (!token) return;
    await fetchAllData(token);
  }, [token, fetchAllData]);

  const sendNotification = async (title: string, message: string, recipientIds?: string[]) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, message, recipientIds }),
      });
      if (!res.ok) throw new Error("Failed to send notification");
    } catch (err) {
      console.error("Send Notification Error:", err);
      throw err;
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
        chartData,
        cityDistribution,
        userLogs,
        communityLogs,
        isLoading,
        isAuthenticated,
        login,
        logout,
        addPrompt,
        togglePrompt,
        deletePrompt,
        deleteUser,
        deleteCouple,
        banCouple,
        unbanCouple,
        deleteCommunity,
        addCommunity,
        updateCommunity,
        resolveReport,
        processJoinRequest,
        sendNotification,
        refresh,
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
