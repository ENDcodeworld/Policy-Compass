// 用户类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
  lastLoginAt: string;
}

// 用户资料
export interface UserProfile {
  education: EducationLevel;
  graduationYear: string;
  major: string;
  targetCities: string[];
  isFreshGraduate: boolean;
  hasEntrepreneurshipPlan: boolean;
}

// 申请进度
export interface ApplicationProgress {
  id: string;
  policyId: string;
  policyName: string;
  city: string;
  userId: string;
  status: "saved" | "applying" | "submitted" | "reviewing" | "approved" | "rejected" | "expired";
  notes: string;
  appliedAt: string;
  updatedAt: string;
  deadline: string;
}

// 政策订阅
export interface PolicySubscription {
  id: string;
  userId: string;
  type: "city" | "category" | "keyword";
  value: string;
  enabled: boolean;
  notifyBy: "email" | "sms" | "push";
  createdAt: string;
}

// 用户评价
export interface UserReview {
  id: string;
  policyId: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  tags: string[];
  helpfulCount: number;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

// FAQ类型
export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  views: number;
  helpfulCount: number;
}

// 攻略文章
export interface Article {
  id: string;
  title: string;
  category: string;
  city?: string;
  coverImage?: string;
  summary: string;
  content: string;
  author: string;
  tags: string[];
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published" | "archived";
}

// 政策数据结构（扩展版）
export interface Policy {
  id: string;
  title: string;
  city: string;
  province: string;
  category: PolicyCategory;
  categoryName: string;
  organization: string;
  publishDate: string;
  validUntil: string;
  education: EducationLevel[];
  educationName: string[];
  subsidyAmount: string;
  subsidyType: string;
  description: string;
  conditions: string[];
  benefits: string[];
  applicationProcess: { step: number; title: string; description: string }[];
  materials: string[];
  officialUrl: string;
  contactPhone: string;
  tags: string[];
  viewCount: number;
  difficulty: "easy" | "medium" | "hard";
  status?: "active" | "pending" | "expired";
  dataSource?: string;
  lastVerifiedAt?: string;
  isRealData?: boolean;
}

// 匹配的政策
export interface MatchedPolicy extends Policy {
  matchScore: number;
  matchReasons: string[];
}

// 城市数据
export interface CityData {
  name: string;
  province: string;
  isHot: boolean;
  policyCount: number;
  officialWebsite?: string;
  description?: string;
}

// 枚举类型
export type EducationLevel = "junior_college" | "undergraduate" | "master" | "phd";
export type PolicyCategory = "employment" | "housing" | "startup" | "household" | "living";

// 数据映射
export const EDUCATION_MAP: Record<EducationLevel, string> = {
  junior_college: "大专",
  undergraduate: "本科",
  master: "硕士",
  phd: "博士",
};

export const CATEGORY_MAP: Record<PolicyCategory, { name: string; color: string }> = {
  employment: { name: "就业补贴", color: "blue" },
  housing: { name: "住房补贴", color: "emerald" },
  startup: { name: "创业扶持", color: "purple" },
  household: { name: "落户政策", color: "rose" },
  living: { name: "生活补贴", color: "amber" },
};

export const DIFFICULTY_MAP: Record<string, { label: string; color: string }> = {
  easy: { label: "简单", color: "emerald" },
  medium: { label: "中等", color: "amber" },
  hard: { label: "困难", color: "rose" },
};

export const APPLICATION_STATUS_MAP: Record<string, { label: string; color: string }> = {
  saved: { label: "已保存", color: "slate" },
  applying: { label: "申请中", color: "blue" },
  submitted: { label: "已提交", color: "indigo" },
  reviewing: { label: "审核中", color: "amber" },
  approved: { label: "已通过", color: "emerald" },
  rejected: { label: "未通过", color: "rose" },
  expired: { label: "已过期", color: "slate" },
};
