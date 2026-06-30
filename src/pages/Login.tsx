import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  GraduationCap,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { userStorage } from "@/utils/storage";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "register") {
        if (password !== confirmPassword) {
          setError("两次密码输入不一致");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("密码至少6位");
          setLoading(false);
          return;
        }

        const result = await userStorage.register(username, email, password);
        if (result.success) {
          setSuccess("注册成功！正在跳转...");
          setTimeout(() => navigate("/"), 1500);
        } else {
          setError(result.error || "注册失败");
        }
      } else {
        const result = await userStorage.login(email, password);
        if (result.success) {
          setSuccess("登录成功！正在跳转...");
          setTimeout(() => navigate("/"), 1500);
        } else {
          setError(result.error || "登录失败");
        }
      }
    } catch (err) {
      setError("操作失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 font-serif mb-2">
            {mode === "login" ? "欢迎回来" : "创建账号"}
          </h1>
          <p className="text-slate-500">
            {mode === "login"
              ? "登录后享受更多个性化服务"
              : "注册后解锁全部功能"}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="flex mb-6 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                mode === "login"
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                mode === "register"
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              注册
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  用户名
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                邮箱
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                密码
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  确认密码
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请再次输入密码"
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="text-right">
                <button type="button" className="text-sm text-primary-600 hover:text-primary-700">
                  忘记密码？
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "处理中..."
              ) : mode === "login" ? (
                <>
                  <LogIn className="w-5 h-5" />
                  登录
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  注册
                </>
              )}
            </button>
          </form>

          {mode === "login" && (
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                还没有账号？{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  立即注册
                </button>
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 text-center">
              测试账号：admin@example.com / admin123
              <br />
              普通账号：user@example.com / user123
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
