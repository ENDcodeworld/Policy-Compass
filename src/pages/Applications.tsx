import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Trash2,
  Edit,
  Plus,
  Calendar,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { applicationStorage, userStorage } from "@/utils/storage";
import { APPLICATION_STATUS_MAP } from "@/types";

const statusIcons: Record<string, any> = {
  saved: Clock,
  applying: FileText,
  submitted: FileText,
  reviewing: AlertCircle,
  approved: CheckCircle2,
  rejected: XCircle,
  expired: AlertCircle,
};

const statusBgColors: Record<string, string> = {
  saved: "bg-slate-100 text-slate-600",
  applying: "bg-blue-100 text-blue-600",
  submitted: "bg-indigo-100 text-indigo-600",
  reviewing: "bg-amber-100 text-amber-600",
  approved: "bg-emerald-100 text-emerald-600",
  rejected: "bg-rose-100 text-rose-600",
  expired: "bg-slate-100 text-slate-500",
};

export default function Applications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = userStorage.getCurrentUser();
    setUser(currentUser);
    const apps = applicationStorage.getApplications();
    setApplications(apps);
  }, []);

  const filteredApplications = applications.filter((app) => {
    if (filterStatus === "all") return true;
    return app.status === filterStatus;
  });

  const handleDelete = (appId: string) => {
    if (window.confirm("确定要删除这条申请记录吗？")) {
      applicationStorage.deleteApplication(appId);
      setApplications(applicationStorage.getApplications());
    }
  };

  const handleUpdateStatus = (appId: string, newStatus: string) => {
    applicationStorage.updateApplicationStatus(appId, newStatus);
    setApplications(applicationStorage.getApplications());
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diff = Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const statusCounts = {
    all: applications.length,
    saved: applications.filter((a) => a.status === "saved").length,
    applying: applications.filter((a) => ["applying", "submitted", "reviewing"].includes(a.status)).length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  if (!user) {
    return (
      <div className="py-20 animate-fade-in">
        <div className="container">
          <div className="max-w-md mx-auto text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              登录后查看申请进度
            </h2>
            <p className="text-slate-500 mb-6">
              登录后可追踪你的政策申请进度
            </p>
            <Link to="/login" className="btn-primary">
              登录 / 注册
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in">
      <div className="container">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-6 h-6 text-primary-600" />
            <h1 className="text-3xl font-bold text-slate-800 font-serif">
              我的申请
            </h1>
          </div>
          <p className="text-slate-500">
            追踪你的政策申请进度，记录申请历程
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { key: "all", label: "全部", icon: FileText, color: "primary" },
            { key: "applying", label: "申请中", icon: TrendingUp, color: "blue" },
            { key: "approved", label: "已通过", icon: CheckCircle2, color: "emerald" },
            { key: "rejected", label: "未通过", icon: XCircle, color: "rose" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <button
                key={stat.key}
                onClick={() => setFilterStatus(stat.key)}
                className={`p-4 rounded-2xl bg-white shadow-card border transition-all hover:shadow-lg ${
                  filterStatus === stat.key
                    ? "border-primary-300 ring-2 ring-primary-100"
                    : "border-slate-100"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                  <span className="text-2xl font-bold text-slate-800">
                    {statusCounts[stat.key as keyof typeof statusCounts]}
                  </span>
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </button>
            );
          })}
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-card">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              还没有申请记录
            </h3>
            <p className="text-slate-500 mb-6">
              浏览政策库，找到感兴趣的政策开始申请吧
            </p>
            <Link to="/policies" className="btn-primary">
              浏览政策
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app, idx) => {
              const StatusIcon = statusIcons[app.status] || Clock;
              const statusInfo = APPLICATION_STATUS_MAP[app.status] || {
                label: app.status,
                color: "slate",
              };
              const daysLeft = getDaysUntilDeadline(app.deadline);

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusBgColors[app.status]}`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 mb-1">
                          {app.policyName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {app.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            截止 {formatDate(app.deadline)}
                          </span>
                          {daysLeft > 0 && daysLeft <= 30 && (
                            <span className="text-amber-600 font-medium">
                              还有 {daysLeft} 天
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {app.notes && (
                      <div className="bg-slate-50 rounded-xl p-4 mb-4">
                        <div className="text-sm text-slate-600">
                          <strong>备注：</strong>
                          {app.notes}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="text-sm text-slate-500">
                        更新于 {formatDate(app.updatedAt)}
                      </div>
                      <div className="flex gap-2">
                        {app.status === "saved" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "applying")}
                            className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                          >
                            开始申请
                          </button>
                        )}
                        {app.status === "applying" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "submitted")}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                          >
                            提交申请
                          </button>
                        )}
                        <Link
                          to={`/policies/${app.policyId}`}
                          className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                          查看详情
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/policies"
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            添加新申请
          </Link>
        </div>
      </div>
    </div>
  );
}
