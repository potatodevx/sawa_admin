"use client";

import { createContext, useContext, useState } from "react";
import type {
  ActivityItem,
  CommunityItem,
  CoupleItem,
  DashboardStats,
  PromptItem,
  UserItem,
} from "../lib/types";

interface AdminDataContextValue {
  prompts: PromptItem[];
  users: UserItem[];
  couples: CoupleItem[];
  activities: ActivityItem[];
  communities: CommunityItem[];
  stats: DashboardStats;
  addPrompt: (payload: Omit<PromptItem, "id" | "createdAt" | "active">) => void;
  togglePrompt: (id: string) => void;
}

const initialPrompts: PromptItem[] = [
  {
    id: "p1",
    title: "Night Walk Confession",
    category: "Connection",
    question:
      "What is one thing you still want your partner to know about you?",
    tags: ["intimacy", "deep-talk"],
    active: true,
    createdAt: "2026-03-17T18:00:00.000Z",
  },
  {
    id: "p2",
    title: "Weekend Ritual",
    category: "Fun",
    question: "Design a 30-minute ritual you can do every Sunday together.",
    tags: ["ritual", "planning"],
    active: true,
    createdAt: "2026-03-16T11:20:00.000Z",
  },
  {
    id: "p3",
    title: "Micro Appreciation",
    category: "Gratitude",
    question:
      "Name one small thing your partner did this week that made you feel seen.",
    tags: ["gratitude"],
    active: false,
    createdAt: "2026-03-11T09:30:00.000Z",
  },
];

const initialUsers: UserItem[] = [
  {
    id: "u1",
    name: "Aarav Nair",
    phone: "+91 95500 11220",
    city: "Chennai",
    status: "active",
    joinedAt: "2026-02-20T08:00:00.000Z",
  },
  {
    id: "u2",
    name: "Meera Iyer",
    phone: "+91 95500 11221",
    city: "Bengaluru",
    status: "active",
    joinedAt: "2026-01-12T07:20:00.000Z",
  },
  {
    id: "u3",
    name: "Kavin Raj",
    phone: "+91 95500 11222",
    city: "Hyderabad",
    status: "inactive",
    joinedAt: "2026-02-28T17:20:00.000Z",
  },
  {
    id: "u4",
    name: "Nila Dev",
    phone: "+91 95500 11223",
    city: "Pune",
    status: "flagged",
    joinedAt: "2026-03-01T12:20:00.000Z",
  },
];

const initialCouples: CoupleItem[] = [
  {
    id: "c1",
    pairName: "Aarav + Meera",
    city: "Chennai",
    compatibilityScore: 88,
    streakDays: 46,
    status: "engaged",
  },
  {
    id: "c2",
    pairName: "Ravi + Tanya",
    city: "Bengaluru",
    compatibilityScore: 73,
    streakDays: 19,
    status: "new",
  },
  {
    id: "c3",
    pairName: "Yash + Dia",
    city: "Hyderabad",
    compatibilityScore: 64,
    streakDays: 3,
    status: "inactive",
  },
];

const initialActivities: ActivityItem[] = [
  {
    id: "a1",
    title: "New prompt published",
    actor: "Admin Team",
    type: "prompt_created",
    happenedAt: "2026-03-19T12:00:00.000Z",
  },
  {
    id: "a2",
    title: "Couple completed weekly check-in",
    actor: "Aarav + Meera",
    type: "couple_matched",
    happenedAt: "2026-03-19T10:45:00.000Z",
  },
  {
    id: "a3",
    title: "Community launched",
    actor: "Community Ops",
    type: "community_created",
    happenedAt: "2026-03-19T09:15:00.000Z",
  },
  {
    id: "a4",
    title: "Safety report opened",
    actor: "Trust Team",
    type: "report_opened",
    happenedAt: "2026-03-19T08:05:00.000Z",
  },
];

const initialCommunities: CommunityItem[] = [
  {
    id: "m1",
    name: "Coffee Dates Collective",
    category: "Interests",
    members: 420,
    growthRate: 12,
  },
  {
    id: "m2",
    name: "Long-Distance League",
    category: "Support",
    members: 315,
    growthRate: 8,
  },
  {
    id: "m3",
    name: "Newly Married Circle",
    category: "Life Stage",
    members: 198,
    growthRate: 14,
  },
];

const AdminDataContext = createContext<AdminDataContextValue | undefined>(
  undefined,
);

function computeStats(
  users: UserItem[],
  couples: CoupleItem[],
  prompts: PromptItem[],
  communities: CommunityItem[],
): DashboardStats {
  return {
    totalUsers: users.length,
    totalCouples: couples.length,
    totalCommunities: communities.length,
    totalPrompts: prompts.length,
    activeToday:
      users.filter((u) => u.status === "active").length +
      couples.filter((c) => c.status !== "inactive").length,
  };
}

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [prompts, setPrompts] = useState<PromptItem[]>(initialPrompts);
  const [users] = useState<UserItem[]>(initialUsers);
  const [couples] = useState<CoupleItem[]>(initialCouples);
  const [activities, setActivities] =
    useState<ActivityItem[]>(initialActivities);
  const [communities] = useState<CommunityItem[]>(initialCommunities);

  const addPrompt: AdminDataContextValue["addPrompt"] = (payload) => {
    const createdPrompt: PromptItem = {
      ...payload,
      id: `p${Date.now()}`,
      active: true,
      createdAt: new Date().toISOString(),
    };

    setPrompts((prev) => [createdPrompt, ...prev]);
    setActivities((prev) => [
      {
        id: `a${Date.now()}`,
        title: `Prompt added: ${createdPrompt.title}`,
        actor: "Admin Team",
        type: "prompt_created",
        happenedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const togglePrompt = (id: string) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    );
  };

  const value: AdminDataContextValue = {
    prompts,
    users,
    couples,
    activities,
    communities,
    stats: computeStats(users, couples, prompts, communities),
    addPrompt,
    togglePrompt,
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within AdminDataProvider");
  }
  return context;
}
