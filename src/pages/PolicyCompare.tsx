import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  Scale,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Briefcase,
  Home,
  Rocket,
  Coffee,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { policies } from "@/data/policies";
import { Policy } from "@/types";

const CATEGORY_ICONS: Record<string, any> = {
  employment: Briefcase,
  housing: Home,
  entrepreneurship: Rocket,
  hukou: MapPin,
  life: Coffee,
};

const CATEGORY_NAMES: Record<string, string> = {
  employment: "就业补贴",
  housing: "住房补贴",
  entrepreneurship: "创业扶持",
  hukou: "落户政策",
  life: "生活福利",
};

export default function PolicyCompare() {
  const navigate = useNavigate();
  const [selectedPolicies, setSelectedPolicies] = useState<Policy[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerCity, setPickerCity] = useState("");
  const [pickerCategory, setPickerCategory] = useState("");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const cities = useMemo(() => {
    const set = new Set(policies.map(p => p.city));
    return Array.from(set).sort();
  }, []);

  const filteredPolicies = useMemo(() => {
    return policies.filter(p => {
      if (pickerCity && p.city !== pickerCity) return false;
      if (pickerCategory && p.category !== pickerCategory) return false;
      return true;
    });
  }, [pickerCity, pickerCategory]);

  const addPolicy = (policy: Policy) => {
    if (selectedPolicies.length >= 5) {
      alert("最多只能对比5条政策");
      return;
    }
    if (selectedPolicies.find(p => p.id === policy.id)) {
      alert("该政策已添加");
      return;
    }
    setSelectedPolicies([...selectedPolicies, policy]);
  };

  const removePolicy = (policyId: string) => {
    setSelectedPolicies(selectedPolicies.filter(p => p.id !== policyId));
  };

  const toggleRow = (key: string) => {
    setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const compareRows = [
    { key: "city", label: "所在城市", icon: MapPin },
    { key: "category", label: "政策分类", icon: Briefcase },
    { key: "amount", label: "补贴金额", icon: "💰" },
    { key: "difficulty", label: "申请难度", icon: "📊" },
    { key: "valid", label: "有效期", icon: "⏰" },
    { key: "conditions", label: "申请条件", icon: "📋", expandable: true },
    { key: "materials", label: "所需材料", icon: "📁", expandable: true },
    { key: "process", label: "申请流程", icon: "📝", expandable: true },
    { key: "isReal", label: "数据真实性", icon: "✅" },
  ];

  const getCellValue = (policy: Policy, key: string): any => {
    switch (key) {
      case "city":
        return `${policy.province} · ${policy.city}`;
      case "category":
        return CATEGORY_NAMES[policy.category] || policy.category;
      case "amount":
        return policy.subsidyAmount || "—";
      case "difficulty":
        return { easy: "简单", medium: "中等", hard: "困难" }[policy.difficulty] || "中等";
      case "valid":
        return policy.validUntil || "长期有效";
      case "conditions":
        return policy.conditions || [];
      case "materials":
        return policy.materials || [];
      case "process":
        return policy.applicationProcess || [];
      case "isReal":
        return policy.isRealData;
      default:
        return "—";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-slate-800">政策对比</h1>
              <span className="text-sm text-slate-500">
                已选 {selectedPolicies.length}/5 条
              </span>
            </div>
            <button
              onClick={() => setShowPicker(true)}
              className="btn-accent !py-2 !px-4 text-sm flex items-center gap-1"
              disabled={selectedPolicies.length >= 5}
            >
              <Plus className="w-4 h-4" />
              添加政策
            </button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {selectedPolicies.length < 2 ? (
          <div className="text-center py-20">
            <Scale className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">选择政策进行对比</h2>
            <p className="text-slate-500 mb-6">最多可对比 5 条政策，帮你做出更好的选择</p>
            <button
              onClick={() => setShowPicker(true)}
              className="btn-accent inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              添加政策
            </button>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 font-semibold text-slate-700 w-32 sticky left-0 bg-white z-10">
                    对比项
                  </th>
                  {selectedPolicies.map((policy) => {
                    const Icon = CATEGORY_ICONS[policy.category] || Briefcase;
                    return (
                      <th
                        key={policy.id}
                        className="text-left py-4 px-4 min-w-[200px] align-top"
                      >
                        <div className="relative">
                          <button
                            onClick={() => removePolicy(policy.id)}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-800 text-sm line-clamp-2">
                                {policy.title}
                              </h3>
                              <p className="text-xs text-slate-500">{policy.city}</p>
                            </div>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => {
                  const RowIcon = typeof row.icon === "string" ? null : row.icon;
                  const isExpanded = expandedRows[row.key];
                  
                  return (
                    <tr
                      key={row.key}
                      className="border-b border-slate-100 hover:bg-slate-50/50"
                    >
                      <td className="py-4 px-4 sticky left-0 bg-white z-10">
                        <div className="flex items-center gap-2">
                          {RowIcon ? (
                            <RowIcon className="w-4 h-4 text-slate-400" />
                          ) : (
                            <span className="text-lg">{row.icon}</span>
                          )}
                          <span className="font-medium text-slate-700 text-sm">
                            {row.label}
                          </span>
                          {row.expandable && (
                            <button
                              onClick={() => toggleRow(row.key)}
                              className="ml-auto p-1 hover:bg-slate-100 rounded"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      {selectedPolicies.map((policy) => {
                        const value = getCellValue(policy, row.key);
                        
                        if (row.key === "isReal") {
                          return (
                            <td key={policy.id} className="py-4 px-4">
                              {value ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 text-sm">
                                  <CheckCircle2 className="w-4 h-4" />
                                  真实政策
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-600 text-sm">
                                  <AlertCircle className="w-4 h-4" />
                                  示例数据
                                </span>
                              )}
                            </td>
                          );
                        }

                        if (row.expandable && Array.isArray(value)) {
                          return (
                            <td key={policy.id} className="py-4 px-4 align-top">
                              {isExpanded ? (
                                <ul className="space-y-1">
                                  {value.map((item: any, idx: number) => (
                                    <li key={idx} className="text-sm text-slate-600 flex gap-2">
                                      <span className="text-slate-400 mt-0.5">{idx + 1}.</span>
                                      <span>{typeof item === "string" ? item : item.title}</span>
                                    </li>
                                  ))}
                                  {value.length === 0 && (
                                    <span className="text-slate-400 text-sm">暂无信息</span>
                                  )}
                                </ul>
                              ) : (
                                <span className="text-sm text-slate-500">
                                  共 {value.length} 项
                                </span>
                              )}
                            </td>
                          );
                        }

                        return (
                          <td key={policy.id} className="py-4 px-4">
                            <span className="text-sm text-slate-700">{value}</span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">选择要对比的政策</h2>
                <button
                  onClick={() => setShowPicker(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-3 mt-4">
                <select
                  value={pickerCity}
                  onChange={(e) => setPickerCity(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">全部城市</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <select
                  value={pickerCategory}
                  onChange={(e) => setPickerCategory(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">全部分类</option>
                  {Object.entries(CATEGORY_NAMES).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-2">
                {filteredPolicies.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">没有找到政策</p>
                ) : (
                  filteredPolicies.map((policy) => {
                    const Icon = CATEGORY_ICONS[policy.category] || Briefcase;
                    const isSelected = selectedPolicies.some(p => p.id === policy.id);
                    return (
                      <div
                        key={policy.id}
                        onClick={() => !isSelected && addPolicy(policy)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary-50 border-primary-200"
                            : "bg-white border-slate-200 hover:border-primary-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? "bg-primary-100 text-primary-600" : "bg-slate-100 text-slate-500"
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium ${isSelected ? "text-primary-700" : "text-slate-800"}`}>
                              {policy.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                              <span>{policy.city}</span>
                              <span>·</span>
                              <span>{policy.subsidyAmount}</span>
                            </div>
                          </div>
                          {isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-primary-500" />
                          ) : (
                            <Plus className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="p-5 border-t border-slate-200">
              <button
                onClick={() => setShowPicker(false)}
                className="btn-accent w-full"
              >
                完成选择 ({selectedPolicies.length}/5)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
