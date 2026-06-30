import { Policy } from "@/types";
import { policies as localPolicies } from "@/data/policies";
import { api } from "./api";

const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === "true";

export interface PolicyListResult {
  data: Policy[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PolicyQueryParams {
  city?: string;
  category?: string;
  keyword?: string;
  isRealData?: boolean;
  page?: number;
  pageSize?: number;
  sort?: string;
}

const convertToLocalPolicy = (remote: any): Policy => {
  return {
    id: remote.id,
    title: remote.title,
    city: remote.city,
    province: remote.province,
    category: remote.category,
    categoryName: remote.categoryName || remote.category_name,
    subsidyAmount: remote.subsidyAmount || remote.subsidy_amount,
    description: remote.description,
    conditions: remote.eligibility || remote.conditions || [],
    applicationProcess: remote.applicationProcess || remote.application_process || [],
    materials: remote.materials || [],
    officialUrl: remote.officialLink || remote.official_link || "",
    difficulty: remote.difficulty,
    validUntil: remote.validUntil || remote.valid_until,
    tags: remote.tags || [],
    isRealData: remote.isRealData || remote.is_real_data === 1,
    dataSource: remote.dataSource || remote.data_source,
    lastVerifiedAt: remote.lastVerifiedAt || remote.last_verified_at,
    status: remote.status,
    organization: "",
    publishDate: "",
    education: [],
    educationName: [],
    subsidyType: "",
    benefits: [],
    contactPhone: "",
    viewCount: 0,
  };
};

export const policyService = {
  async getAllPolicies(): Promise<Policy[]> {
    if (!USE_BACKEND) {
      return localPolicies;
    }
    try {
      const res = await api.policies.getList({ pageSize: 1000 });
      return (res.data || []).map(convertToLocalPolicy);
    } catch (e) {
      console.error("从后端获取政策失败，使用本地数据:", e);
      return localPolicies;
    }
  },

  async getPolicyList(params: PolicyQueryParams): Promise<PolicyListResult> {
    if (!USE_BACKEND) {
      let filtered = [...localPolicies];
      
      if (params.city) {
        filtered = filtered.filter(p => p.city === params.city);
      }
      if (params.category) {
        filtered = filtered.filter(p => p.category === params.category);
      }
      if (params.keyword) {
        const kw = params.keyword.toLowerCase();
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(kw)))
        );
      }
      if (params.isRealData !== undefined) {
        filtered = filtered.filter(p => p.isRealData === params.isRealData);
      }

      const page = params.page || 1;
      const pageSize = params.pageSize || 20;
      const total = filtered.length;
      const start = (page - 1) * pageSize;
      const data = filtered.slice(start, start + pageSize);

      return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }

    try {
      const res = await api.policies.getList(params);
      return {
        data: (res.data || []).map(convertToLocalPolicy),
        total: res.total || 0,
        page: res.page || 1,
        pageSize: res.pageSize || 20,
        totalPages: res.totalPages || 1,
      };
    } catch (e) {
      console.error("从后端获取政策列表失败:", e);
      return {
        data: localPolicies.slice(0, 20),
        total: localPolicies.length,
        page: 1,
        pageSize: 20,
        totalPages: Math.ceil(localPolicies.length / 20),
      };
    }
  },

  async getPolicyDetail(id: string): Promise<Policy | null> {
    if (!USE_BACKEND) {
      return localPolicies.find(p => p.id === id) || null;
    }
    try {
      const res = await api.policies.getDetail(id);
      return res.data ? convertToLocalPolicy(res.data) : null;
    } catch (e) {
      console.error("从后端获取政策详情失败:", e);
      return localPolicies.find(p => p.id === id) || null;
    }
  },

  async getCities(): Promise<Record<string, string[]>> {
    if (!USE_BACKEND) {
      const provinceMap: Record<string, string[]> = {};
      localPolicies.forEach(p => {
        if (!provinceMap[p.province]) {
          provinceMap[p.province] = [];
        }
        if (!provinceMap[p.province].includes(p.city)) {
          provinceMap[p.province].push(p.city);
        }
      });
      return provinceMap;
    }
    try {
      const res = await api.policies.getCities();
      return res.data || {};
    } catch (e) {
      console.error("从后端获取城市列表失败:", e);
      const provinceMap: Record<string, string[]> = {};
      localPolicies.forEach(p => {
        if (!provinceMap[p.province]) provinceMap[p.province] = [];
        if (!provinceMap[p.province].includes(p.city)) provinceMap[p.province].push(p.city);
      });
      return provinceMap;
    }
  },

  async getCategories(): Promise<{ value: string; label: string }[]> {
    if (!USE_BACKEND) {
      const cats = new Map<string, string>();
      localPolicies.forEach(p => {
        cats.set(p.category, p.categoryName);
      });
      return Array.from(cats.entries()).map(([value, label]) => ({ value, label }));
    }
    try {
      const res = await api.policies.getCategories();
      return res.data || [];
    } catch (e) {
      console.error("从后端获取分类失败:", e);
      const cats = new Map<string, string>();
      localPolicies.forEach(p => cats.set(p.category, p.categoryName));
      return Array.from(cats.entries()).map(([value, label]) => ({ value, label }));
    }
  },

  isBackendMode(): boolean {
    return USE_BACKEND;
  },
};

export default policyService;
