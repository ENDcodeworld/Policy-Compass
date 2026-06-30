import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Heart,
  Bell,
  FileText,
  LogOut,
  ChevronRight,
  Star,
  History,
  MapPin,
  Shield,
  Mail,
  Phone,
} from "lucide-react";
import { userStorage, applicationStorage, favoritesStorage } from "@/utils/storage";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    const currentUser = userStorage.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    setFavoritesCount(favoritesStorage.getFavorites().length);
    setApplicationsCount(applicationStorage.getApplications().length);
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("确定要退出登录吗？")) {
      userStorage.logout();
      navigate("/login");
    }
  };

  if (!user) {
    return null;
  }

  const menuItems = [
    {
      icon: Heart,
      label: "我的收藏",
      value: `${favoritesCount} 条政策`,
      path: "/favorites",
      color: "rose",
    },
    {
      icon: FileText,
      label: "申请进度",
      value: `${applicationsCount} 条记录`,
      path: "/applications",
      color: "blue",
    },
    {
      icon: Bell,
      label: "政策订阅",
      value: "管理订阅",
      path: "/subscriptions",
      color: "amber",
    },
    {
      icon: History,
      label: "测评历史",
      value: "查看记录",
      path: "/assessment",
      color: "purple",
    },
  ];

  const settingsItems = [
    {
      icon: Shield,
      label: "账号安全",
      path: "/settings/security",
    },
    {
      icon: Bell,
      label: "通知设置",
      path: "/settings/notifications",
    },
    {
      icon: Settings,
      label: "应用设置",
      path: "/settings/app",
    },
  ];

  return (
    <div className="py-8 animate-fade-in">
      <div className="container">
        <div className="bg-white rounded-3xl shadow-card overflow-hidden mb-6">
          <div className="bg-gradient-hero p-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-1">
                  {user.username}
                </h2>
                <p className="text-blue-100 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
                {user.role === "admin" && (
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs">
                    管理员
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <Link
                to="/favorites"
                className="text-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="text-2xl font-bold text-slate-800">
                  {favoritesCount}
                </div>
                <div className="text-sm text-slate-500">收藏</div>
              </Link>
              <Link
                to="/applications"
                className="text-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="text-2xl font-bold text-slate-800">
                  {applicationsCount}
                </div>
                <div className="text-sm text-slate-500">申请</div>
              </Link>
              <div className="text-center p-4 rounded-xl bg-slate-50">
                <div className="text-2xl font-bold text-slate-800">
                  {user.role === "admin" ? "管理" : "普通"}
                </div>
                <div className="text-sm text-slate-500">用户类型</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden mb-6">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">我的服务</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-${item.color}-50 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${item.color}-600`} />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{item.label}</div>
                      <div className="text-sm text-slate-500">{item.value}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden mb-6">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">设置</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="font-medium text-slate-800">{item.label}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </button>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>政策指南针 v1.0.0</p>
          <p className="mt-1">让每一位大学生都能享受应有的福利</p>
        </div>
      </div>
    </div>
  );
}
