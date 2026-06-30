import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Sparkles,
  Heart,
  Menu,
  X,
  GraduationCap,
  Sun,
  Moon,
  HelpCircle,
  BookOpen,
  ClipboardList,
  User,
  Bell,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { userStorage, notificationStorage } from "@/utils/storage";

const navLinks = [
  { path: "/", label: "首页", icon: Home },
  { path: "/policies", label: "政策库", icon: Search },
  { path: "/assessment", label: "智能测评", icon: Sparkles },
  { path: "/articles", label: "攻略", icon: BookOpen },
  { path: "/faq", label: "常见问题", icon: HelpCircle },
];

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useAppStore();
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUser(userStorage.getCurrentUser());
  }, [location.pathname]);

  useEffect(() => {
    if (userStorage.getCurrentUser()) {
      setUnreadCount(notificationStorage.getUnreadCount());
    }
  }, [location.pathname]);

  const userLinks = [
    { path: "/favorites", label: "我的收藏", icon: Heart },
    { path: "/applications", label: "申请进度", icon: ClipboardList },
    { path: user ? "/profile" : "/login", label: user ? "个人中心" : "登录", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/60 dark:border-slate-700/60">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-serif">
                政策指南针
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">
                大学生福利一站式查询
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                      : "text-slate-600 hover:text-primary-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-primary-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <nav className="hidden md:flex items-center gap-1">
            {userLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                      : "text-slate-600 hover:text-primary-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-primary-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {userStorage.isLoggedIn() && (
              <Link
                to="/notifications"
                className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="消息通知"
              >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === "light" ? "切换暗黑模式" : "切换明亮模式"}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-slate-600" />
              ) : (
                <Sun className="w-5 h-5 text-slate-300" />
              )}
            </button>

            <Link
              to="/assessment"
              className="hidden sm:inline-flex btn-accent !py-2 !px-4 text-sm"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              免费测评
            </Link>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <div className="container py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/assessment"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 mt-3 btn-accent w-full"
            >
              <Sparkles className="w-5 h-5" />
              智能匹配你的专属福利
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
