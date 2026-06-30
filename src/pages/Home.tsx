import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  Home as HomeIcon,
  Rocket,
  Coffee,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Star,
  ArrowRight,
  Grid3X3,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import PolicyCard from "@/components/PolicyCard";
import CityPicker from "@/components/CityPicker";
import { cities } from "@/data/cities";
import { getHotPolicies } from "@/data/policies";
import { PolicyCategory, CATEGORY_MAP } from "@/types";

const categories: { key: PolicyCategory; label: string; icon: typeof Briefcase; color: string; desc: string }[] = [
  { key: "employment", label: "就业补贴", icon: Briefcase, color: "blue", desc: "求职、见习、社保补贴" },
  { key: "housing", label: "住房补贴", icon: HomeIcon, color: "emerald", desc: "租房、购房、人才公寓" },
  { key: "startup", label: "创业扶持", icon: Rocket, color: "purple", desc: "创业资金、场地、贷款" },
  { key: "household", label: "落户政策", icon: MapPin, color: "rose", desc: "人才引进、直接落户" },
  { key: "living", label: "生活补贴", icon: Coffee, color: "amber", desc: "生活、安家、交通补助" },
];

const getCityEmoji = (cityName: string): string => {
  const emojiMap: Record<string, string> = {
    北京: "🏛️",
    上海: "🌆",
    广州: "🌸",
    深圳: "🚀",
    杭州: "🍃",
    成都: "🐼",
    武汉: "🌸",
    南京: "🏯",
    西安: "🏺",
    天津: "🌉",
    重庆: "🌃",
    苏州: "🏞️",
    青岛: "🌊",
    厦门: "🏝️",
  };
  return emojiMap[cityName] || "📍";
};

export default function Home() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [showAllCities, setShowAllCities] = useState(false);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const { setSearchKeyword, setSelectedCity } = useAppStore();
  const hotPolicies = getHotPolicies();
  const hotCities = cities.filter((c) => c.isHot);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      setSearchKeyword(searchText.trim());
      navigate("/policies");
    }
  };

  const handleCategoryClick = (category: PolicyCategory) => {
    useAppStore.getState().clearFilters();
    useAppStore.getState().toggleCategoryFilter(category);
    navigate("/policies");
  };

  const handleCityClick = (cityName: string) => {
    setSelectedCity(cityName);
    navigate("/policies");
  };

  const handleCityToggle = (cityName: string) => {
    setSelectedCities((prev) => {
      if (prev.includes(cityName)) {
        return prev.filter((c) => c !== cityName);
      }
      return [...prev, cityName];
    });
  };

  const handleViewCityPolicies = () => {
    if (selectedCities.length > 0) {
      useAppStore.getState().clearFilters();
      selectedCities.forEach((city) => {
        useAppStore.getState().toggleCityFilter(city);
      });
      navigate("/policies");
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>
        
        <div className="container relative py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-accent-300" />
              <span>已有 <span className="font-semibold text-accent-300">20万+</span> 大学生通过我们找到福利</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-serif text-balance animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              别让信息差，错过你的
              <span className="text-accent-300">专属福利</span>
            </h1>
            
            <p className="text-lg text-blue-100 mb-8 text-balance animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              聚合全国20+城市的大学生政策待遇，一键智能匹配，
              就业补贴、住房福利、创业扶持...不再错过
            </p>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2">
                <div className="flex items-center gap-2 pl-4 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="搜索政策，例如：租房补贴、落户、创业..."
                  className="flex-1 py-3 text-slate-800 placeholder-slate-400 outline-none text-base"
                />
                <button type="submit" className="btn-accent !py-2.5 !px-6 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>搜索</span>
                </button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <span className="text-blue-200 text-sm">热门搜索：</span>
              {["租房补贴", "人才落户", "创业基金", "就业见习"].map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => { setSearchText(keyword); setSearchKeyword(keyword); navigate("/policies"); }}
                  className="text-sm px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Hot Cities */}
      <section className="py-12 -mt-10 relative z-10">
        <div className="container">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-soft p-6 md:p-8 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 font-serif flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary-600" />
                  选择城市
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  覆盖全国 {cities.length} 个城市，查看当地大学生政策
                </p>
              </div>
              <button
                onClick={() => setShowAllCities(!showAllCities)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
              >
                {showAllCities ? (
                  <>
                    收起
                    <ChevronRight className="w-4 h-4 -rotate-90" />
                  </>
                ) : (
                  <>
                    全部城市
                    <Grid3X3 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {!showAllCities && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
                {hotCities.map((city, idx) => (
                  <button
                    key={city.name}
                    onClick={() => handleCityClick(city.name)}
                    className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-primary-50 dark:hover:bg-primary-900/30 border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 text-center animate-fade-in-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">
                      {getCityEmoji(city.name)}
                    </div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                      {city.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {city.policyCount}条政策
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showAllCities && (
              <div className="animate-fade-in">
                <CityPicker
                  selectedCities={selectedCities}
                  onCityToggle={handleCityToggle}
                  maxHeight="420px"
                />
                {selectedCities.length > 0 && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      已选择 <span className="font-semibold text-primary-600">{selectedCities.length}</span> 个城市
                    </div>
                    <button
                      onClick={handleViewCityPolicies}
                      className="btn-primary !py-2 !px-5 text-sm"
                    >
                      查看这些城市的政策
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 font-serif mb-2">
              政策分类导航
            </h2>
            <p className="text-slate-500">五大类别，全方位覆盖大学生福利</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className="group card p-6 text-left hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-${cat.color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 text-${cat.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-800 mb-1 group-hover:text-primary-600 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">{cat.desc}</p>
                  <span className="text-sm font-medium text-primary-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    查看全部 <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hot Policies */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 font-serif flex items-center gap-2">
                <Star className="w-6 h-6 text-accent-500 fill-accent-500" />
                热门政策
              </h2>
              <p className="text-slate-500 text-sm mt-1">大家都在关注的福利政策</p>
            </div>
            <Link to="/policies" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              查看更多 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {hotPolicies.slice(0, 4).map((policy, idx) => (
              <div key={policy.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <PolicyCard policy={policy} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment CTA */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-12 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-4">
                  <Sparkles className="w-4 h-4 text-accent-300" />
                  智能推荐
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif mb-4">
                  不知道自己能领什么福利？
                </h2>
                <p className="text-blue-100 mb-6 text-lg">
                  填写简单信息，10秒为你精准匹配所有可享受的政策待遇，
                  让福利不再擦肩而过
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/assessment" className="bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 active:scale-[0.98] transition-all shadow-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    免费智能测评
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <div className="flex items-center gap-3 text-sm text-blue-200">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-accent-400 border-2 border-primary-700 flex items-center justify-center text-xs font-bold">😀</div>
                      <div className="w-8 h-8 rounded-full bg-primary-400 border-2 border-primary-700 flex items-center justify-center text-xs font-bold">😊</div>
                      <div className="w-8 h-8 rounded-full bg-emerald-400 border-2 border-primary-700 flex items-center justify-center text-xs font-bold">🤩</div>
                    </div>
                    <span>已有20万+用户使用</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="text-sm text-blue-200 mb-4">你的专属匹配结果预览</div>
                  <div className="space-y-3">
                    {[
                      { name: "深圳市租房补贴", match: 95, amount: "15000元" },
                      { name: "广州青年人才补贴", match: 88, amount: "每年5万" },
                      { name: "杭州大学生创业资助", match: 82, amount: "最高20万" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-400/30 flex items-center justify-center text-accent-300 font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-blue-200">{item.amount}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-accent-300 font-bold">{item.match}%</div>
                          <div className="text-[10px] text-blue-300">匹配度</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-slate-50">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 font-serif mb-2">
              更多服务
            </h2>
            <p className="text-slate-500">全方位帮助你了解和申请政策福利</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: "❓", title: "常见问题", desc: "解答你的疑惑", path: "/faq" },
              { icon: "📖", title: "申请攻略", desc: "经验分享指南", path: "/articles" },
              { icon: "📋", title: "申请进度", desc: "追踪你的申请", path: "/applications" },
              { icon: "🔔", title: "政策订阅", desc: "不错过新政策", path: "/subscriptions" },
              { icon: "⚖️", title: "政策对比", desc: "多城市横向对比", path: "/compare" },
              { icon: "⚙️", title: "管理后台", desc: "政策数据管理", path: "/admin" },
            ].map((item, idx) => (
              <Link
                key={item.title}
                to={item.path}
                className="group card p-6 text-center hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${cities.length}+`, label: "覆盖城市", icon: "🏙️" },
              { value: "45+", label: "政策数据", icon: "📋" },
              { value: "20+", label: "真实政策城市", icon: "✅" },
              { value: "5大类", label: "政策分类", icon: "📂" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-gradient font-serif mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
