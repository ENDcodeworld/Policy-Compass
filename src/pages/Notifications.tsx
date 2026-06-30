import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ArrowLeft,
  CheckCheck,
  Info,
  Gift,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { notificationStorage, Notification } from "@/utils/storage";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const loadNotifications = () => {
    let all = notificationStorage.getAll();
    if (filter === "unread") {
      all = all.filter((n) => !n.isRead);
    }
    setNotifications(all);
  };

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const unreadCount = notificationStorage.getUnreadCount();

  const handleMarkAsRead = (id: string) => {
    notificationStorage.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    notificationStorage.markAllAsRead();
    loadNotifications();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "policy":
        return <Gift className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
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
              <h1 className="text-xl font-bold text-slate-800">消息通知</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" />
                全部已读
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-primary-500 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "unread"
                ? "bg-primary-500 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            未读
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-2">暂无通知</p>
            <p className="text-sm text-slate-400">
              订阅城市或分类的政策更新会在这里通知你
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`card p-4 cursor-pointer hover:shadow-md transition-all ${
                  !item.isRead ? "border-l-4 border-l-primary-500" : ""
                }`}
                onClick={() => {
                  if (!item.isRead) {
                    handleMarkAsRead(item.id);
                  }
                }}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-slate-800">{item.title}</h3>
                      {!item.isRead && (
                        <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                    {item.content && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {item.content}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleString("zh-CN")}
                      </span>
                      {!item.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(item.id);
                          }}
                          className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                        >
                          标为已读
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
