import { create } from "zustand";
import { Policy, UserProfile, EducationLevel, PolicyCategory } from "@/types";
import { policies } from "@/data/policies";
import { favoritesStorage, searchHistoryStorage, assessmentHistoryStorage, themeStorage } from "@/utils/storage";
import { matchPolicies } from "@/utils/matcher";

interface FilterState {
  cities: string[];
  categories: PolicyCategory[];
  education: EducationLevel[];
  searchKeyword: string;
  sortBy: "viewCount" | "publishDate" | "amount";
}

interface AssessmentHistory {
  id: string;
  date: string;
  profile: UserProfile;
  matchedPolicies: { policy: Policy; score: number; reasons: string[] }[];
}

interface AppState {
  allPolicies: Policy[];
  filteredPolicies: Policy[];
  favorites: string[];
  userProfile: UserProfile | null;
  filters: FilterState;
  selectedCity: string | null;
  assessmentHistory: AssessmentHistory[];
  searchHistory: string[];
  theme: "light" | "dark";

  setSelectedCity: (city: string | null) => void;
  setSearchKeyword: (keyword: string) => void;
  toggleCityFilter: (city: string) => void;
  toggleCategoryFilter: (category: PolicyCategory) => void;
  toggleEducationFilter: (edu: EducationLevel) => void;
  setSortBy: (sort: FilterState["sortBy"]) => void;
  clearFilters: () => void;
  applyFilters: () => void;

  toggleFavorite: (policyId: string) => void;
  isFavorite: (policyId: string) => boolean;
  getFavoritePolicies: () => Policy[];

  setUserProfile: (profile: UserProfile) => void;
  getMatchedPolicies: () => { policy: Policy; score: number; reasons: string[] }[];

  addAssessmentHistory: (profile: UserProfile, matchedPolicies: { policy: Policy; score: number; reasons: string[] }[]) => void;
  clearAssessmentHistory: () => void;

  addSearchHistory: (keyword: string) => void;
  clearSearchHistory: () => void;

  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

const initialFilters: FilterState = {
  cities: [],
  categories: [],
  education: [],
  searchKeyword: "",
  sortBy: "viewCount",
};

export const useAppStore = create<AppState>((set, get) => ({
  allPolicies: policies,
  filteredPolicies: policies,
  favorites: favoritesStorage.getFavorites(),
  userProfile: null,
  filters: initialFilters,
  selectedCity: null,
  assessmentHistory: [],
  searchHistory: searchHistoryStorage.getSearchHistory() || [],
  theme: "light",

  setSelectedCity: (city) => {
    set({ selectedCity: city });
    if (city) {
      set((state) => ({
        filters: { ...state.filters, cities: [city] },
      }));
    }
    get().applyFilters();
  },

  setSearchKeyword: (keyword) => {
    set((state) => ({
      filters: { ...state.filters, searchKeyword: keyword },
    }));
    get().applyFilters();
  },

  toggleCityFilter: (city) => {
    set((state) => {
      const cities = state.filters.cities.includes(city)
        ? state.filters.cities.filter((c) => c !== city)
        : [...state.filters.cities, city];
      return { filters: { ...state.filters, cities } };
    });
    get().applyFilters();
  },

  toggleCategoryFilter: (category) => {
    set((state) => {
      const categories = state.filters.categories.includes(category)
        ? state.filters.categories.filter((c) => c !== category)
        : [...state.filters.categories, category];
      return { filters: { ...state.filters, categories } };
    });
    get().applyFilters();
  },

  toggleEducationFilter: (edu) => {
    set((state) => {
      const education = state.filters.education.includes(edu)
        ? state.filters.education.filter((e) => e !== edu)
        : [...state.filters.education, edu];
      return { filters: { ...state.filters, education } };
    });
    get().applyFilters();
  },

  setSortBy: (sort) => {
    set((state) => ({
      filters: { ...state.filters, sortBy: sort },
    }));
    get().applyFilters();
  },

  clearFilters: () => {
    set({ filters: initialFilters, selectedCity: null });
    get().applyFilters();
  },

  applyFilters: () => {
    const { allPolicies, filters } = get();
    let result = [...allPolicies];

    if (filters.cities.length > 0) {
      result = result.filter((p) => filters.cities.includes(p.city));
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    if (filters.education.length > 0) {
      result = result.filter((p) =>
        p.education.some((e) => filters.education.includes(e))
      );
    }

    if (filters.searchKeyword) {
      const keyword = filters.searchKeyword.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(keyword) ||
          p.description.toLowerCase().includes(keyword) ||
          p.tags.some((t) => t.toLowerCase().includes(keyword)) ||
          p.benefits.some((b) => b.toLowerCase().includes(keyword)) ||
          p.conditions.some((c) => c.toLowerCase().includes(keyword))
      );
    }

    switch (filters.sortBy) {
      case "viewCount":
        result.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "publishDate":
        result.sort(
          (a, b) =>
            new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );
        break;
      case "amount":
        result.sort((a, b) => {
          const aNum = parseInt(a.subsidyAmount.replace(/[^0-9]/g, "")) || 0;
          const bNum = parseInt(b.subsidyAmount.replace(/[^0-9]/g, "")) || 0;
          return bNum - aNum;
        });
        break;
    }

    set({ filteredPolicies: result });
  },

  toggleFavorite: (policyId) => {
    const isFav = get().favorites.includes(policyId);
    let newFavorites: string[];
    if (isFav) {
      newFavorites = favoritesStorage.removeFavorite(policyId);
    } else {
      newFavorites = favoritesStorage.addFavorite(policyId);
    }
    set({ favorites: newFavorites });
  },

  isFavorite: (policyId) => {
    return get().favorites.includes(policyId);
  },

  getFavoritePolicies: () => {
    const { allPolicies, favorites } = get();
    return allPolicies.filter((p) => favorites.includes(p.id));
  },

  setUserProfile: (profile) => {
    set({ userProfile: profile });
  },

  getMatchedPolicies: () => {
    const { allPolicies, userProfile } = get();
    if (!userProfile) return [];
    const matched = matchPolicies(allPolicies, userProfile);
    return matched.map((m) => ({
      policy: m,
      score: m.matchScore,
      reasons: m.matchReasons,
    }));
  },

  addAssessmentHistory: (profile, matchedPolicies) => {
    const newHistory: AssessmentHistory = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      profile,
      matchedPolicies,
    };
    set((state) => ({
      assessmentHistory: [newHistory, ...state.assessmentHistory].slice(0, 10),
    }));
    assessmentHistoryStorage.saveAssessmentHistory(get().assessmentHistory);
  },

  clearAssessmentHistory: () => {
    set({ assessmentHistory: [] });
    assessmentHistoryStorage.saveAssessmentHistory([]);
  },

  addSearchHistory: (keyword) => {
    if (!keyword.trim()) return;
    set((state) => {
      const filtered = state.searchHistory.filter((k) => k !== keyword);
      const newHistory = [keyword, ...filtered].slice(0, 20);
      searchHistoryStorage.addSearchHistory(keyword);
      return { searchHistory: newHistory };
    });
  },

  clearSearchHistory: () => {
    set({ searchHistory: [] });
    searchHistoryStorage.clearSearchHistory();
  },

  setTheme: (theme) => {
    set({ theme });
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    themeStorage.setTheme(theme);
  },

  toggleTheme: () => {
    const newTheme = get().theme === "light" ? "dark" : "light";
    get().setTheme(newTheme);
  },
}));
