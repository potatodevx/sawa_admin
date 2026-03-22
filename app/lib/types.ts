export type ActivityType = 'prompt_created' | 'user_joined' | 'couple_matched' | 'community_created' | 'report_opened';

export interface PromptItem {
  id: string;
  title: string;
  category: string;
  question: string;
  tags: string[];
  active: boolean;
  createdAt: string;
}

export interface UserItem {
  id: string;
  name: string;
  phone: string;
  city: string;
  status: 'active' | 'inactive' | 'flagged';
  joinedAt: string;
}

export interface CoupleItem {
  id: string;
  pairName: string;
  city: string;
  compatibilityScore: number;
  streakDays: number;
  status: 'new' | 'engaged' | 'inactive';
}

export interface ActivityItem {
  id: string;
  title: string;
  actor: string;
  type: ActivityType;
  happenedAt: string;
}

export interface CommunityItem {
  id: string;
  name: string;
  category: string;
  members: number;
  growthRate: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalCouples: number;
  totalCommunities: number;
  totalPrompts: number;
  activeToday: number;
  pendingReports?: number;
}

export interface ReportItem {
  id: string;
  reporter: string;
  target: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}
