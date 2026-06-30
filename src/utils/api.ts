const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === "true";

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  unreadCount?: number;
  count?: number;
}

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const request = async <T = any>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "请求失败");
  }

  return data;
};

export const api = {
  // ========== 认证相关 ==========
  auth: {
    register: (data: { username: string; email: string; password: string; nickname?: string }) =>
      request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    
    login: (data: { username: string; password: string }) =>
      request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    
    getMe: () => request("/auth/me"),
    
    updateMe: (data: { nickname?: string; avatar?: string }) =>
      request("/auth/me", { method: "PUT", body: JSON.stringify(data) }),
    
    changePassword: (data: { oldPassword: string; newPassword: string }) =>
      request("/auth/password", { method: "PUT", body: JSON.stringify(data) }),
  },

  // ========== 政策相关 ==========
  policies: {
    getList: (params?: {
      city?: string;
      category?: string;
      keyword?: string;
      isRealData?: boolean;
      page?: number;
      pageSize?: number;
      sort?: string;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.city) searchParams.set("city", params.city);
      if (params?.category) searchParams.set("category", params.category);
      if (params?.keyword) searchParams.set("keyword", params.keyword);
      if (params?.isRealData !== undefined) searchParams.set("isRealData", String(params.isRealData));
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
      if (params?.sort) searchParams.set("sort", params.sort);
      
      return request(`/policies?${searchParams.toString()}`);
    },
    
    getDetail: (id: string) => request(`/policies/${id}`),
    
    getCities: () => request("/policies/meta/cities"),
    
    getCategories: () => request("/policies/meta/categories"),
  },

  // ========== 用户数据 ==========
  user: {
    // 收藏
    getFavorites: () => request("/user/favorites"),
    addFavorite: (policyId: string) =>
      request("/user/favorites", { method: "POST", body: JSON.stringify({ policyId }) }),
    removeFavorite: (policyId: string) =>
      request(`/user/favorites/${policyId}`, { method: "DELETE" }),
    checkFavorite: (policyId: string) => request(`/user/favorites/${policyId}/check`),

    // 申请
    getApplications: () => request("/user/applications"),
    addApplication: (data: {
      policyId: string;
      policyName: string;
      city: string;
      province: string;
      subsidyAmount?: string;
      status?: string;
      notes?: string;
      deadline?: string;
    }) =>
      request("/user/applications", { method: "POST", body: JSON.stringify(data) }),
    updateApplication: (id: number, data: { status?: string; notes?: string; deadline?: string }) =>
      request(`/user/applications/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteApplication: (id: number) =>
      request(`/user/applications/${id}`, { method: "DELETE" }),

    // 订阅
    getSubscriptions: () => request("/user/subscriptions"),
    addSubscription: (type: string, target: string) =>
      request("/user/subscriptions", { method: "POST", body: JSON.stringify({ type, target }) }),
    removeSubscription: (type: string, target: string) =>
      request("/user/subscriptions", { method: "DELETE", body: JSON.stringify({ type, target }) }),
    checkSubscription: (type: string, target: string) => {
      const params = new URLSearchParams({ type, target });
      return request(`/user/subscriptions/check?${params.toString()}`);
    },
  },

  // ========== 通知 ==========
  notifications: {
    getList: (params?: { page?: number; pageSize?: number; unreadOnly?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
      if (params?.unreadOnly) searchParams.set("unreadOnly", "true");
      return request(`/notifications?${searchParams.toString()}`);
    },
    getUnreadCount: () => request("/notifications/unread-count"),
    markAsRead: (id: number) => request(`/notifications/${id}/read`, { method: "PUT" }),
    markAllAsRead: () => request("/notifications/read-all", { method: "PUT" }),
    delete: (id: number) => request(`/notifications/${id}`, { method: "DELETE" }),
  },
};

export const config = {
  useBackend: USE_BACKEND,
  baseUrl: API_BASE_URL,
};

export default api;
