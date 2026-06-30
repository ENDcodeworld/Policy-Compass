// 存储键
const STORAGE_KEYS = {
  // 用户相关
  USER: "policy_user",
  USER_PROFILE: "policy_user_profile",
  AUTH_TOKEN: "policy_auth_token",

  // 政策相关
  FAVORITES: "policy_favorites",
  ALL_POLICIES: "policy_all_policies",
  POLICY_SUBSCRIPTIONS: "policy_subscriptions",

  // 申请进度
  APPLICATIONS: "policy_applications",

  // 搜索和历史
  SEARCH_HISTORY: "policy_search_history",
  ASSESSMENT_HISTORY: "policy_assessment_history",

  // 主题
  THEME: "policy_theme",

  // FAQ和文章
  FAQ_LIST: "policy_faq_list",
  ARTICLES: "policy_articles",
  REVIEWS: "policy_reviews",
};

// 用户存储
export const userStorage = {
  getCurrentUser: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser: (user: any) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save user:", e);
    }
  },

  clearCurrentUser: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (e) {
      console.error("Failed to clear user:", e);
    }
  },

  login: (email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟登录验证
        const mockUsers = [
          { id: "1", username: "admin", email: "admin@example.com", password: "admin123", role: "admin" as const },
          { id: "2", username: "user", email: "user@example.com", password: "user123", role: "user" as const },
        ];

        const user = mockUsers.find((u) => u.email === email && u.password === password);
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          const token = "mock_token_" + Date.now();
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));
          resolve({ success: true, user: userWithoutPassword });
        } else {
          resolve({ success: false, error: "邮箱或密码错误" });
        }
      }, 500);
    });
  },

  register: (username: string, email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 检查是否已存在
        const existingUsers = JSON.parse(localStorage.getItem("policy_registered_users") || "[]");
        if (existingUsers.includes(email)) {
          resolve({ success: false, error: "该邮箱已被注册" });
          return;
        }

        // 创建新用户
        const newUser = {
          id: "u_" + Date.now(),
          username,
          email,
          role: "user" as const,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        existingUsers.push(email);
        localStorage.setItem("policy_registered_users", JSON.stringify(existingUsers));
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, "mock_token_" + Date.now());

        resolve({ success: true, user: newUser });
      }, 500);
    });
  },

  logout: () => {
    userStorage.clearCurrentUser();
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },
};

// 申请进度存储
export const applicationStorage = {
  getApplications: (): any[] => {
    try {
      const user = userStorage.getCurrentUser();
      if (!user) return [];

      const allApps = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "{}");
      return allApps[user.id] || [];
    } catch {
      return [];
    }
  },

  saveApplication: (application: any): void => {
    try {
      const user = userStorage.getCurrentUser();
      if (!user) return;

      const allApps = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "{}");
      const userApps = allApps[user.id] || [];

      const existingIndex = userApps.findIndex((a: any) => a.id === application.id);
      if (existingIndex >= 0) {
        userApps[existingIndex] = { ...application, updatedAt: new Date().toISOString() };
      } else {
        userApps.push({
          ...application,
          id: "app_" + Date.now(),
          userId: user.id,
          appliedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      allApps[user.id] = userApps;
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(allApps));
    } catch (e) {
      console.error("Failed to save application:", e);
    }
  },

  deleteApplication: (applicationId: string): void => {
    try {
      const user = userStorage.getCurrentUser();
      if (!user) return;

      const allApps = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "{}");
      const userApps = (allApps[user.id] || []).filter((a: any) => a.id !== applicationId);
      allApps[user.id] = userApps;
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(allApps));
    } catch (e) {
      console.error("Failed to delete application:", e);
    }
  },

  updateApplicationStatus: (applicationId: string, status: string, notes?: string): void => {
    try {
      const user = userStorage.getCurrentUser();
      if (!user) return;

      const allApps = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "{}");
      const userApps = allApps[user.id] || [];
      const appIndex = userApps.findIndex((a: any) => a.id === applicationId);

      if (appIndex >= 0) {
        userApps[appIndex] = {
          ...userApps[appIndex],
          status,
          notes: notes || userApps[appIndex].notes,
          updatedAt: new Date().toISOString(),
        };
        allApps[user.id] = userApps;
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(allApps));
      }
    } catch (e) {
      console.error("Failed to update application:", e);
    }
  },
};

// 政策订阅存储
export const subscriptionStorage = {
  getSubscriptions: (): any[] => {
    try {
      const user = userStorage.getCurrentUser();
      if (!user) return [];

      const allSubs = JSON.parse(localStorage.getItem(STORAGE_KEYS.POLICY_SUBSCRIPTIONS) || "{}");
      return allSubs[user.id] || [];
    } catch {
      return [];
    }
  },

  addSubscription: (subscription: any): void => {
    try {
      const user = userStorage.getCurrentUser();
      if (!user) return;

      const allSubs = JSON.parse(localStorage.getItem(STORAGE_KEYS.POLICY_SUBSCRIPTIONS) || "{}");
      const userSubs = allSubs[user.id] || [];

      // 检查是否已存在
      const exists = userSubs.some(
        (s: any) => s.type === subscription.type && s.value === subscription.value
      );

      if (!exists) {
        userSubs.push({
          ...subscription,
          id: "sub_" + Date.now(),
          userId: user.id,
          enabled: true,
          createdAt: new Date().toISOString(),
        });
        allSubs[user.id] = userSubs;
        localStorage.setItem(STORAGE_KEYS.POLICY_SUBSCRIPTIONS, JSON.stringify(allSubs));
      }
    } catch (e) {
      console.error("Failed to add subscription:", e);
    }
  },

  removeSubscription: (subscriptionId: string): void => {
    try {
      const user = userStorage.getCurrentUser();
      if (!user) return;

      const allSubs = JSON.parse(localStorage.getItem(STORAGE_KEYS.POLICY_SUBSCRIPTIONS) || "{}");
      const userSubs = (allSubs[user.id] || []).filter((s: any) => s.id !== subscriptionId);
      allSubs[user.id] = userSubs;
      localStorage.setItem(STORAGE_KEYS.POLICY_SUBSCRIPTIONS, JSON.stringify(allSubs));
    } catch (e) {
      console.error("Failed to remove subscription:", e);
    }
  },

  toggleSubscription: (subscriptionId: string): void => {
    try {
      const user = userStorage.getCurrentUser();
      if (!user) return;

      const allSubs = JSON.parse(localStorage.getItem(STORAGE_KEYS.POLICY_SUBSCRIPTIONS) || "{}");
      const userSubs = allSubs[user.id] || [];
      const subIndex = userSubs.findIndex((s: any) => s.id === subscriptionId);

      if (subIndex >= 0) {
        userSubs[subIndex].enabled = !userSubs[subIndex].enabled;
        allSubs[user.id] = userSubs;
        localStorage.setItem(STORAGE_KEYS.POLICY_SUBSCRIPTIONS, JSON.stringify(allSubs));
      }
    } catch (e) {
      console.error("Failed to toggle subscription:", e);
    }
  },
};

// 收藏存储
export const favoritesStorage = {
  getFavorites: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addFavorite: (policyId: string): string[] => {
    const favorites = favoritesStorage.getFavorites();
    if (!favorites.includes(policyId)) {
      const newFavorites = [...favorites, policyId];
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
      return newFavorites;
    }
    return favorites;
  },

  removeFavorite: (policyId: string): string[] => {
    const favorites = favoritesStorage.getFavorites();
    const newFavorites = favorites.filter((id) => id !== policyId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
    return newFavorites;
  },

  isFavorite: (policyId: string): boolean => {
    return favoritesStorage.getFavorites().includes(policyId);
  },
};

// 搜索历史
export const searchHistoryStorage = {
  getSearchHistory: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addSearchHistory: (keyword: string): void => {
    if (!keyword.trim()) return;
    try {
      const history = searchHistoryStorage.getSearchHistory();
      const filtered = history.filter((k) => k !== keyword);
      const newHistory = [keyword, ...filtered].slice(0, 20);
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save search history:", e);
    }
  },

  clearSearchHistory: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
    } catch (e) {
      console.error("Failed to clear search history:", e);
    }
  },
};

// 测评历史
export const assessmentHistoryStorage = {
  getAssessmentHistory: (): any[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveAssessmentHistory: (history: any[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save assessment history:", e);
    }
  },
};

// 主题
export const themeStorage = {
  getTheme: (): "light" | "dark" => {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      return (theme as "light" | "dark") || "light";
    } catch {
      return "light";
    }
  },

  setTheme: (theme: "light" | "dark"): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    } catch (e) {
      console.error("Failed to save theme:", e);
    }
  },
};

// FAQ存储
export const faqStorage = {
  getFAQs: (): any[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAQ_LIST);
      if (data) return JSON.parse(data);

      // 返回默认FAQ
      return defaultFAQs;
    } catch {
      return defaultFAQs;
    }
  },

  addFAQ: (faq: any): void => {
    try {
      const faqs = faqStorage.getFAQs();
      faqs.push({
        ...faq,
        id: "faq_" + Date.now(),
        views: 0,
        helpfulCount: 0,
      });
      localStorage.setItem(STORAGE_KEYS.FAQ_LIST, JSON.stringify(faqs));
    } catch (e) {
      console.error("Failed to add FAQ:", e);
    }
  },
};

// 默认FAQ数据
const defaultFAQs = [
  {
    id: "faq_1",
    category: "申请流程",
    question: "如何申请大学生政策补贴？",
    answer: "申请流程一般包括：1. 查看政策详情了解申请条件；2. 准备所需材料；3. 前往官方渠道提交申请；4. 等待审核结果；5. 审核通过后领取补贴。不同政策的申请流程可能略有不同，请仔细阅读具体政策的申请说明。",
    order: 1,
    views: 1234,
    helpfulCount: 567,
  },
  {
    id: "faq_2",
    category: "申请流程",
    question: "申请材料需要准备哪些？",
    answer: "常见的申请材料包括：身份证、毕业证/学生证、劳动合同、社保缴费证明、银行卡等。具体材料清单请查看各政策的详情页，所需材料一栏。",
    order: 2,
    views: 987,
    helpfulCount: 432,
  },
  {
    id: "faq_3",
    category: "资格条件",
    question: "我不是应届毕业生可以申请吗？",
    answer: "不同政策对毕业时间有不同的要求。部分政策只针对应届毕业生，有些政策允许毕业1-2年内申请，还有些政策对毕业时间没有限制。建议仔细阅读政策的申请条件，确认自己是否符合要求。",
    order: 3,
    views: 876,
    helpfulCount: 345,
  },
  {
    id: "faq_4",
    category: "资格条件",
    question: "非全日制学历可以申请吗？",
    answer: "大多数政策要求全日制学历。部分政策可能接受非全日制学历，但要求会有所不同。建议查看具体政策的学历要求，或咨询相关部门确认。",
    order: 4,
    views: 765,
    helpfulCount: 298,
  },
  {
    id: "faq_5",
    category: "补贴发放",
    question: "补贴一般多久能到账？",
    answer: "补贴到账时间因政策而异：一次性补贴通常在审核通过后1-3个月内发放；按月补贴会在次月发放；购房补贴等大额补贴可能分批发放。具体时间请以官方通知为准。",
    order: 5,
    views: 654,
    helpfulCount: 287,
  },
  {
    id: "faq_6",
    category: "补贴发放",
    question: "补贴金额是税前还是税后？",
    answer: "大部分政府补贴需要按规定缴纳个人所得税。如果补贴金额较大，可能需要由发放单位代扣代缴税款后发放到您账户。具体请咨询当地税务部门。",
    order: 6,
    views: 543,
    helpfulCount: 234,
  },
  {
    id: "faq_7",
    category: "其他问题",
    question: "可以同时申请多个政策吗？",
    answer: "大多数情况下可以同时申请多个不同的政策，只要您符合各政策的申请条件。但同一类型的补贴（如多个租房补贴）通常不能重复申请。建议申请前仔细了解各政策的具体规定。",
    order: 7,
    views: 432,
    helpfulCount: 198,
  },
  {
    id: "faq_8",
    category: "其他问题",
    question: "申请被拒怎么办？",
    answer: "如果申请被拒，可以：1. 查看拒绝原因；2. 如有疑问可联系政策发布部门咨询；3. 符合条件后可重新申请；4. 关注其他适用的政策。",
    order: 8,
    views: 321,
    helpfulCount: 165,
  },
];

// 文章存储
export const articleStorage = {
  getArticles: (): any[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (data) return JSON.parse(data);
      return defaultArticles;
    } catch {
      return defaultArticles;
    }
  },

  addArticle: (article: any): void => {
    try {
      const articles = articleStorage.getArticles();
      articles.unshift({
        ...article,
        id: "article_" + Date.now(),
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.error("Failed to add article:", e);
    }
  },

  likeArticle: (articleId: string): void => {
    try {
      const articles = articleStorage.getArticles();
      const articleIndex = articles.findIndex((a) => a.id === articleId);
      if (articleIndex >= 0) {
        articles[articleIndex].likes += 1;
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
      }
    } catch (e) {
      console.error("Failed to like article:", e);
    }
  },
};

// 默认文章数据
const defaultArticles = [
  {
    id: "article_1",
    title: "2024年应届毕业生就业补贴申请全攻略",
    category: "申请攻略",
    city: "全国",
    summary: "详细讲解毕业生就业补贴的申请流程、注意事项和经验分享，帮助毕业生顺利领取属于自己的福利。",
    content: "...",
    author: "政策通小助手",
    tags: ["就业补贴", "应届毕业生", "申请攻略"],
    views: 2345,
    likes: 456,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    status: "published",
  },
  {
    id: "article_2",
    title: "深圳租房补贴申请心得：从申请到到账的全过程",
    category: "申请攻略",
    city: "深圳",
    summary: "分享我在深圳申请租房补贴的真实经历，包括材料准备、申请流程、审核时间和到账情况。",
    content: "...",
    author: "深圳小王",
    tags: ["租房补贴", "深圳", "经验分享"],
    views: 1890,
    likes: 321,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
    status: "published",
  },
  {
    id: "article_3",
    title: "杭州人才引进政策深度解读",
    category: "政策解读",
    city: "杭州",
    summary: "深入分析杭州人才引进政策的各项福利，包括补贴金额、申请条件、注意事项等。",
    content: "...",
    author: "政策研究员",
    tags: ["人才引进", "杭州", "政策解读"],
    views: 1567,
    likes: 234,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
    status: "published",
  },
];

// 工具函数
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  }
  return num.toLocaleString();
};

export const getPolicyStatus = (validUntil: string): { label: string; color: string } => {
  if (validUntil === "长期有效") {
    return { label: "长期有效", color: "green" };
  }

  const endDate = new Date(validUntil);
  const now = new Date();
  const diffDays = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: "已过期", color: "red" };
  } else if (diffDays <= 30) {
    return { label: "即将到期", color: "orange" };
  } else if (diffDays <= 90) {
    return { label: "3个月内到期", color: "yellow" };
  } else {
    return { label: "有效", color: "green" };
  }
};

export const generateId = (prefix: string = ""): string => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
