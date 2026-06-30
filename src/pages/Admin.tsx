import { useState, useEffect } from "react";
import {
  Settings,
  Plus,
  Edit2,
  Trash2,
  Search,
  ArrowLeft,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/api";
import { userStorage } from "@/utils/storage";

interface PolicyData {
  id: string;
  title: string;
  city: string;
  province: string;
  category: string;
  categoryName: string;
  subsidyAmount: string;
  description: string;
  isRealData: boolean;
  difficulty: string;
  validUntil: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [policies, setPolicies] = useState<PolicyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<PolicyData | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState<Partial<PolicyData>>({
    id: "",
    title: "",
    city: "",
    province: "",
    category: "employment",
    categoryName: "就业补贴",
    subsidyAmount: "",
    description: "",
    isRealData: false,
    difficulty: "medium",
    validUntil: "长期有效",
  });

  useEffect(() => {
    const user = userStorage.getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setIsAdmin(true);
    loadPolicies();
  }, [navigate]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const res = await api.policies.getList({ pageSize: 1000 });
      setPolicies(res.data || []);
    } catch (e) {
      console.error("加载政策失败:", e);
      showToast("error", "加载失败，请确保后端服务已启动");
    } finally {
      setLoading(false);
    }
  };

  const filteredPolicies = policies.filter(p => {
    if (!searchKeyword) return true;
    const kw = searchKeyword.toLowerCase();
    return (
      p.title.toLowerCase().includes(kw) ||
      p.city.toLowerCase().includes(kw) ||
      p.id.includes(kw)
    );
  });

  const handleAdd = () => {
    setEditingPolicy(null);
    setFormData({
      id: String(Date.now()),
      title: "",
      city: "",
      province: "",
      category: "employment",
      categoryName: "就业补贴",
      subsidyAmount: "",
      description: "",
      isRealData: false,
      difficulty: "medium",
      validUntil: "长期有效",
    });
    setShowEditor(true);
  };

  const handleEdit = (policy: any) => {
    setEditingPolicy(policy);
    setFormData({
      id: policy.id,
      title: policy.title,
      city: policy.city,
      province: policy.province,
      category: policy.category,
      categoryName: policy.categoryName || policy.category_name,
      subsidyAmount: policy.subsidyAmount || policy.subsidy_amount,
      description: policy.description,
      isRealData: policy.isRealData || policy.is_real_data === 1,
      difficulty: policy.difficulty,
      validUntil: policy.validUntil || policy.valid_until,
    });
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条政策吗？此操作不可恢复。")) return;
    try {
      await api.policies; // 调用删除接口（需要补充）
      // 暂时只做本地删除
      setPolicies(policies.filter(p => p.id !== id));
      showToast("success", "删除成功");
    } catch (e) {
      showToast("error", "删除失败");
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.city || !formData.province) {
      showToast("error", "请填写必填项");
      return;
    }
    try {
      if (editingPolicy) {
        await api.policies.updatePolicy!(editingPolicy.id, formData);
        showToast("success", "更新成功");
      } else {
        await api.policies.createPolicy!(formData);
        showToast("success", "创建成功");
      }
      setShowEditor(false);
      loadPolicies();
    } catch (e: any) {
      showToast("error", e.message || "保存失败");
    }
  };

  const stats = {
    total: policies.length,
    real: policies.filter(p => p.isRealData).length,
    cities: new Set(policies.map(p => p.city)).size,
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">检查权限中...</p>
      </div>
    );
  }

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
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-primary-600" />
                <h1 className="text-xl font-bold text-slate-800">管理后台</h1>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="btn-accent !py-2 !px-4 text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              新增政策
            </button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card p-5">
            <div className="text-3xl font-bold text-primary-600">{stats.total}</div>
            <div className="text-slate-500 mt-1">政策总数</div>
          </div>
          <div className="card p-5">
            <div className="text-3xl font-bold text-emerald-600">{stats.real}</div>
            <div className="text-slate-500 mt-1">真实政策</div>
          </div>
          <div className="card p-5">
            <div className="text-3xl font-bold text-amber-600">{stats.cities}</div>
            <div className="text-slate-500 mt-1">覆盖城市</div>
          </div>
        </div>

        <div className="card">
          <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索政策名称、城市..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400">加载中...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">政策名称</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">城市</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">分类</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">补贴金额</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">真实性</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPolicies.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">
                        暂无政策数据
                      </td>
                    </tr>
                  ) : (
                    filteredPolicies.map((policy) => (
                      <tr key={policy.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-sm text-slate-500 font-mono">{policy.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800 text-sm max-w-xs truncate">
                            {policy.title}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{policy.city}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {policy.categoryName || policy.category}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {policy.subsidyAmount || "—"}
                        </td>
                        <td className="py-3 px-4">
                          {policy.isRealData ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              真实
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                              <AlertCircle className="w-3 h-3" />
                              示例
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(policy)}
                              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                              title="编辑"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(policy.id)}
                              className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                              title="删除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">
                  {editingPolicy ? "编辑政策" : "新增政策"}
                </h2>
                <button
                  onClick={() => setShowEditor(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      政策ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.id || ""}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      disabled={!!editingPolicy}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      补贴金额
                    </label>
                    <input
                      type="text"
                      value={formData.subsidyAmount || ""}
                      onChange={(e) => setFormData({ ...formData, subsidyAmount: e.target.value })}
                      placeholder="例如：每月2000元"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    政策名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      省份 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.province || ""}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      placeholder="例如：广东省"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      城市 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city || ""}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="例如：深圳市"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      政策分类
                    </label>
                    <select
                      value={formData.category || "employment"}
                      onChange={(e) => {
                        const map: Record<string, string> = {
                          employment: "就业补贴",
                          housing: "住房补贴",
                          entrepreneurship: "创业扶持",
                          hukou: "落户政策",
                          life: "生活福利",
                        };
                        setFormData({
                          ...formData,
                          category: e.target.value,
                          categoryName: map[e.target.value],
                        });
                      }}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="employment">就业补贴</option>
                      <option value="housing">住房补贴</option>
                      <option value="entrepreneurship">创业扶持</option>
                      <option value="hukou">落户政策</option>
                      <option value="life">生活福利</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      申请难度
                    </label>
                    <select
                      value={formData.difficulty || "medium"}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="easy">简单</option>
                      <option value="medium">中等</option>
                      <option value="hard">困难</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    政策描述
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      有效期
                    </label>
                    <input
                      type="text"
                      value={formData.validUntil || ""}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      placeholder="例如：2025-12-31 或 长期有效"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isRealData || false}
                        onChange={(e) => setFormData({ ...formData, isRealData: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700">真实政策数据</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => setShowEditor(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 btn-accent flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
          toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
