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
  coupleId?: string | null;
  profile?: {
    bio: string | null;
    primaryPhoto: string | null;
    answers: Array<{
      question: string;
      options: string[];
    }>;
  } | null;
}

export interface CoupleItem {
  id: string;
  pairName: string;
  city: string;
  compatibilityScore: number;
  streakDays: number;
  status: 'new' | 'engaged' | 'inactive';
  partners?: Array<{ id: string; name: string; phone: string | null }>;
}

export interface CityStat {
  city: string;
  users: number;
  couples: number;
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
  description?: string;
  city: string;
  coverImageUrl?: string;
  tags: string[];
  category: string;
  memberCount: number;
  growthRate: number;
  members: Array<{ id: string; name: string; photo: string | null }>;
  hosts: Array<{ id: string; name: string; photo: string | null }>;
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

export interface ChartDataPoint {
  name: string;
  users: number;
  couples: number;
  communities: number;
}

export interface ActivityLog {
  id: string;
  title: string;
  actor: string;
  happenedAt: string;
  type: string;
}
