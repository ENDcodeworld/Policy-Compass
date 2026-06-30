import { useState } from "react";
import {
  Briefcase,
  Home,
  Rocket,
  MapPin,
  Coffee,
  SlidersHorizontal,
  X,
  TrendingUp,
  Calendar,
  Banknote,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { PolicyCategory, EducationLevel, EDUCATION_MAP } from "@/types";
import { cities } from "@/data/cities";
import CityPicker from "@/components/CityPicker";

const categories: { key: PolicyCategory; label: string; icon: typeof Briefcase; color: string }[] = [
  { key: "employment", label: "就业补贴", icon: Briefcase, color: "blue" },
  { key: "housing", label: "住房补贴", icon: Home, color: "emerald" },
  { key: "startup", label: "创业扶持", icon: Rocket, color: "purple" },
  { key: "household", label: "落户政策", icon: MapPin, color: "rose" },
  { key: "living", label: "生活补贴", icon: Coffee, color: "amber" },
];

const educations: { key: EducationLevel; label: string }[] = [
  { key: "junior_college", label: "大专" },
  { key: "undergraduate", label: "本科" },
  { key: "master", label: "硕士" },
  { key: "phd", label: "博士" },
];

const sortOptions = [
  { key: "viewCount", label: "最热门", icon: TrendingUp },
  { key: "publishDate", label: "最新发布", icon: Calendar },
  { key: "amount", label: "补贴金额", icon: Banknote },
];

export default function FilterBar() {
  const {
    filters,
    toggleCityFilter,
    toggleCategoryFilter,
    toggleEducationFilter,
    setSortBy,
    clearFilters,
  } = useAppStore();
  const [showCityPicker, setShowCityPicker] = useState(false);

  const hasActiveFilters =
    filters.cities.length > 0 ||
    filters.categories.length > 0 ||
    filters.education.length > 0;

  const selectedCityNames = filters.cities;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card p-6 mb-6 border border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">筛选条件</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-slate-500 hover:text-rose-500 flex items-center gap-1 transition-colors"
          >
            <X className="w-4 h-4" />
            清空筛选
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <MapPin className="w-4 h-4 mr-1 text-primary-500" />
              城市
              <span className="text-xs text-slate-400 ml-1">
                ({cities.length}个城市)
              </span>
            </div>
            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
            >
              {showCityPicker ? (
              <>
                收起
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                选择城市
                <ChevronDown className="w-4 h-4" />
              </>
            )}
            </button>
          </div>

          {!showCityPicker && (
            <div className="flex flex-wrap gap-2">
              {selectedCityNames.length > 0 ? (
                selectedCityNames.map((city) => (
                  <button
                    key={city}
                    onClick={() => toggleCityFilter(city)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400 text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
                  >
                    {city}
                    <X className="w-3.5 h-3.5" />
                  </button>
                ))
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400 text-sm">
                  点击"选择城市"，从全国{cities.length}个城市中选择
                </span>
              )}
            </div>
          )}

          {showCityPicker && (
            <div className="mt-3 animate-fade-in">
              <CityPicker
                selectedCities={filters.cities}
                onCityToggle={toggleCityFilter}
                maxHeight="350px"
              />
            </div>
          )}
        </div>

        <div>
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">政策类别</div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = filters.categories.includes(cat.key);
              return (
                <button
                  key={cat.key}
                  onClick={() => toggleCategoryFilter(cat.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? `bg-${cat.color}-100 text-${cat.color}-700 ring-1 ring-${cat.color}-200`
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">学历要求</div>
          <div className="flex flex-wrap gap-2">
            {educations.map((edu) => {
              const active = filters.education.includes(edu.key);
              return (
                <button
                  key={edu.key}
                  onClick={() => toggleEducationFilter(edu.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-accent-100 text-accent-700 ring-1 ring-accent-200 dark:bg-accent-900/50 dark:text-accent-400"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  {edu.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            共找到 <span className="font-semibold text-primary-600">
              {useAppStore.getState().filteredPolicies.length}
            </span> 条政策
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">排序：</span>
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
              {sortOptions.map((opt) => {
                const Icon = opt.icon;
                const active = filters.sortBy === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setSortBy(opt.key as any)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      active
                        ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-200 shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
