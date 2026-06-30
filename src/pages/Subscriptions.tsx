import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { userStorage, subscriptionStorage } from "@/utils/storage";
import { cities, getAllProvinces, getCitiesByProvince } from "@/data/cities";
import { PolicyCategory, CATEGORY_MAP } from "@/types";

const categories = Object.entries(CATEGORY_MAP).map(([value, info]) => ({
  value: value as PolicyCategory,
  label: info.name,
}));

export default function Subscriptions() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    const user = userStorage.getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }
    loadSubscriptions();
  }, [navigate]);

  const loadSubscriptions = () => {
    setSubscriptions(subscriptionStorage.getSubscriptions());
  };

  const handleAddCitySubscription = (city: string, province: string) => {
    subscriptionStorage.addSubscription({
      type: "city",
      value: city,
      label: `${province} - ${city}`,
    });
    loadSubscriptions();
    setShowCityPicker(false);
  };

  const handleAddCategorySubscription = (category: PolicyCategory, label: string) => {
    subscriptionStorage.addSubscription({
      type: "category",
      value: category,
      label: label,
    });
    loadSubscriptions();
    setShowCategoryPicker(false);
  };

  const handleToggle = (id: string) => {
    subscriptionStorage.toggleSubscription(id);
    loadSubscriptions();
  };

  const handleRemove = (id: string) => {
    if (window.confirm("确定要取消这个订阅吗？")) {
      subscriptionStorage.removeSubscription(id);
      loadSubscriptions();
    }
  };

  const citySubs = subscriptions.filter((s) => s.type === "city");
  const categorySubs = subscriptions.filter((s) => s.type === "category");

  return (
    <div className="py-8 animate-fade-in">
      <div className="container max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">政策订阅</h1>
            <p className="text-sm text-slate-500">订阅后将及时收到相关政策更新通知</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden mb-6">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">城市订阅</h3>
            </div>
            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加城市
            </button>
          </div>

          {showCityPicker && (
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="max-h-64 overflow-y-auto space-y-3">
                {getAllProvinces().map((province) => {
                  const cityList = getCitiesByProvince(province);
                  return (
                    <div key={province}>
                      <div className="text-xs font-medium text-slate-500 mb-2">{province}</div>
                      <div className="flex flex-wrap gap-2">
                        {cityList.map((city) => {
                          const exists = citySubs.some((s) => s.value === city.name);
                          return (
                            <button
                              key={city.name}
                              onClick={() => !exists && handleAddCitySubscription(city.name, province)}
                              disabled={exists}
                              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                exists
                                  ? "bg-green-100 text-green-700 cursor-not-allowed"
                                  : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                              }`}
                            >
                              {city.name}
                              {exists && " ✓"}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {citySubs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无城市订阅</p>
              <p className="text-sm">点击上方添加关注的城市</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {citySubs.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{sub.label}</div>
                      <div className="text-sm text-slate-500">新政策自动提醒</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(sub.id)}
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      {sub.enabled ? (
                        <ToggleRight className="w-6 h-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleRemove(sub.id)}
                      className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-slate-800">分类订阅</h3>
            </div>
            <button
              onClick={() => setShowCategoryPicker(!showCategoryPicker)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 text-sm font-medium hover:bg-amber-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加分类
            </button>
          </div>

          {showCategoryPicker && (
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const exists = categorySubs.some((s) => s.value === cat.value);
                  return (
                    <button
                      key={cat.value}
                      onClick={() => !exists && handleAddCategorySubscription(cat.value, cat.label)}
                      disabled={exists}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        exists
                          ? "bg-green-100 text-green-700 cursor-not-allowed"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600"
                      }`}
                    >
                      {cat.label}
                      {exists && " ✓"}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {categorySubs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无分类订阅</p>
              <p className="text-sm">点击上方添加关注的政策分类</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {categorySubs.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{sub.label}</div>
                      <div className="text-sm text-slate-500">新政策自动提醒</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(sub.id)}
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      {sub.enabled ? (
                        <ToggleRight className="w-6 h-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleRemove(sub.id)}
                      className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">订阅说明</p>
              <p className="mt-1 text-blue-600">
                订阅城市或分类后，当有相关新政策发布时，您将第一时间收到通知。
                您可以随时开启或关闭某个订阅，也可以完全取消订阅。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
