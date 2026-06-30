import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import PolicyCard from "@/components/PolicyCard";
import FilterBar from "@/components/FilterBar";
import { Search, X, Clock, TrendingUp } from "lucide-react";

export default function PolicyList() {
  const { filteredPolicies, filters, setSearchKeyword, clearFilters, addSearchHistory, searchHistory, clearSearchHistory } = useAppStore();
  const [searchInput, setSearchInput] = useState(filters.searchKeyword);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setSearchInput(filters.searchKeyword);
  }, [filters.searchKeyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchKeyword(searchInput);
      addSearchHistory(searchInput);
    }
  };

  const handleHistoryClick = (keyword: string) => {
    setSearchInput(keyword);
    setSearchKeyword(keyword);
    setShowHistory(false);
  };

  const hasActiveFilters =
    filters.cities.length > 0 ||
    filters.categories.length > 0 ||
    filters.education.length > 0 ||
    filters.searchKeyword !== "";

  return (
    <div className="py-8 animate-fade-in">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 font-serif mb-2">
            政策库
          </h1>
          <p className="text-slate-500">
            浏览全国各城市的大学生政策待遇，找到适合你的福利
          </p>
        </div>

        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <div className="bg-white rounded-xl shadow-card p-1.5 flex items-center gap-2 border border-slate-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
              <div className="flex items-center gap-2 pl-3 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setShowHistory(true)}
                onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                placeholder="搜索政策名称、关键词..."
                className="flex-1 py-2.5 text-slate-800 placeholder-slate-400 outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(""); setSearchKeyword(""); }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button type="submit" className="btn-primary !py-2 !px-5 text-sm">
                搜索
              </button>
            </div>

            {showHistory && searchHistory.length > 0 && !filters.searchKeyword && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    搜索历史
                  </div>
                  <button
                    onClick={clearSearchHistory}
                    className="text-sm text-slate-400 hover:text-slate-600"
                  >
                    清除
                  </button>
                </div>
                <div className="py-2 max-h-64 overflow-y-auto">
                  {searchHistory.map((keyword, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleHistoryClick(keyword)}
                      className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4 text-slate-400" />
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        <FilterBar />

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-500">
            共找到 <span className="font-semibold text-primary-600">{filteredPolicies.length}</span> 条政策
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              清除所有筛选
            </button>
          )}
        </div>

        {filteredPolicies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPolicies.map((policy, idx) => (
              <div key={policy.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <PolicyCard policy={policy} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              没有找到相关政策
            </h3>
            <p className="text-slate-500 mb-6">
              试试调整筛选条件，或者清除筛选看看全部政策
            </p>
            <button onClick={clearFilters} className="btn-primary">
              清除筛选条件
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
