import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Trash2,
  Scale,
  ChevronRight,
  X,
  MapPin,
  Banknote,
  GraduationCap,
  Gauge,
  Calendar,
  Star,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import PolicyCard from "@/components/PolicyCard";
import { DIFFICULTY_MAP } from "@/types";
import { formatDate } from "@/utils/storage";

export default function Favorites() {
  const { getFavoritePolicies, toggleFavorite } = useAppStore();
  const favorites = getFavoritePolicies();
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const toggleCompareSelect = (policyId: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(policyId)) {
        return prev.filter((id) => id !== policyId);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, policyId];
    });
  };

  const selectedPolicies = favorites.filter((p) =>
    selectedForCompare.includes(p.id)
  );

  const handleRemove = (policyId: string) => {
    toggleFavorite(policyId);
    setSelectedForCompare((prev) => prev.filter((id) => id !== policyId));
  };

  const compareFields = [
    { label: "所在城市", key: "city", icon: MapPin },
    { label: "补贴金额", key: "subsidyAmount", icon: Banknote, highlight: true },
    { label: "适用学历", key: "educationName", icon: GraduationCap },
    { label: "申请难度", key: "difficulty", icon: Gauge },
    { label: "有效期至", key: "validUntil", icon: Calendar },
  ];

  const getFieldValue = (policy: any, key: string) => {
    switch (key) {
      case "educationName":
        return policy.educationName.join("、");
      case "difficulty":
        return DIFFICULTY_MAP[policy.difficulty]?.label || "-";
      case "validUntil":
        return policy.validUntil === "长期有效"
          ? "长期有效"
          : formatDate(policy.validUntil);
      default:
        return policy[key] || "-";
    }
  };

  return (
    <div className="py-8 animate-fade-in">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 font-serif mb-2">
              我的收藏
            </h1>
            <p className="text-slate-500">
              收藏你感兴趣的政策，方便随时查看和对比
            </p>
          </div>
          {favorites.length >= 2 && (
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                if (compareMode) setSelectedForCompare([]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                compareMode
                  ? "bg-primary-100 text-primary-700"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-primary-300"
              }`}
            >
              <Scale className="w-4 h-4" />
              {compareMode ? "退出对比" : "政策对比"}
            </button>
          )}
        </div>

        {compareMode && selectedPolicies.length >= 2 && (
          <div className="card p-6 mb-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary-600" />
                政策对比
                <span className="text-sm font-normal text-slate-500">
                  （已选 {selectedPolicies.length} 项，最多4项）
                </span>
              </h3>
              <button
                onClick={() => setSelectedForCompare([])}
                className="text-sm text-slate-500 hover:text-rose-500 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                清空选择
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 w-32">
                      对比项
                    </th>
                    {selectedPolicies.map((policy) => (
                      <th
                        key={policy.id}
                        className="text-center py-3 px-4 min-w-[200px]"
                      >
                        <div className="relative">
                          <button
                            onClick={() => toggleCompareSelect(policy.id)}
                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="font-semibold text-slate-800 text-sm line-clamp-2">
                            {policy.title}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareFields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <tr
                        key={field.key}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <Icon className="w-4 h-4 text-slate-400" />
                            {field.label}
                          </div>
                        </td>
                        {selectedPolicies.map((policy) => (
                          <td
                            key={policy.id}
                            className="text-center py-4 px-4"
                          >
                            <span
                              className={`text-sm ${
                                field.highlight
                                  ? "text-accent-600 font-bold"
                                  : "text-slate-700"
                              }`}
                            >
                              {getFieldValue(policy, field.key)}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-slate-600">
                        操作
                      </span>
                    </td>
                    {selectedPolicies.map((policy) => (
                      <td
                        key={policy.id}
                        className="text-center py-4 px-4"
                      >
                        <Link
                          to={`/policies/${policy.id}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
                        >
                          查看详情
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {favorites.length > 0 ? (
          <>
            {compareMode && (
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6 flex items-center justify-between">
                <span className="text-sm text-primary-700">
                  已选择 <span className="font-bold">{selectedForCompare.length}</span> / 4 项政策进行对比
                </span>
                {selectedPolicies.length < 2 && (
                  <span className="text-sm text-primary-600">
                    请至少选择2项政策进行对比
                  </span>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {favorites.map((policy, idx) => (
                <div
                  key={policy.id}
                  className="relative animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {compareMode && (
                    <button
                      onClick={() => toggleCompareSelect(policy.id)}
                      className={`absolute top-3 left-3 z-10 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        selectedForCompare.includes(policy.id)
                          ? "bg-primary-500 border-primary-500 text-white"
                          : "bg-white border-slate-300 hover:border-primary-400"
                      }`}
                    >
                      {selectedForCompare.includes(policy.id) && (
                        <span className="text-xs">✓</span>
                      )}
                    </button>
                  )}
                  <PolicyCard policy={policy} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 card">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              还没有收藏的政策
            </h3>
            <p className="text-slate-500 mb-6">
              去政策库逛逛，收藏你感兴趣的政策吧
            </p>
            <Link to="/policies" className="btn-primary inline-flex items-center gap-2">
              <Star className="w-4 h-4" />
              浏览政策库
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
