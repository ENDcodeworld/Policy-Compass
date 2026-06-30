import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  ExternalLink,
  Phone,
  Eye,
  Award,
  ListChecks,
  Copy,
  Share2,
  Check,
  AlertCircle,
  Bell,
  History,
} from "lucide-react";
import { getPolicyById } from "@/data/policies";
import { useAppStore } from "@/store/useAppStore";
import { formatDate, formatNumber, getPolicyStatus } from "@/utils/storage";
import { userStorage, applicationStorage } from "@/utils/storage";

export default function PolicyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const policy = id ? getPolicyById(id) : undefined;
  const { toggleFavorite, isFavorite } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  const fav = policy ? isFavorite(policy.id) : false;

  useEffect(() => {
    if (policy && userStorage.isLoggedIn()) {
      const apps = applicationStorage.getApplications();
      setIsTracking(apps.some((a: any) => a.policyId === policy.id));
    }
  }, [policy]);

  const handleCopyMaterials = async () => {
    if (!policy) return;
    const text = `【${policy.title}】申请材料清单：

${policy.materials.map((m, i) => `${i + 1}. ${m}`).join('\n')}

申请地址：${policy.officialUrl}
咨询电话：${policy.contactPhone}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (!policy || !navigator.share) return;

    try {
      await navigator.share({
        title: policy.title,
        text: `${policy.title} - ${policy.subsidyAmount}`,
        url: window.location.href,
      });
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  const handleSetReminder = () => {
    setShowReminder(true);
    setTimeout(() => setShowReminder(false), 3000);
  };

  const handleTrackApplication = () => {
    if (!userStorage.isLoggedIn()) {
      navigate("/login");
      return;
    }
    if (!policy) return;

    if (isTracking) {
      navigate("/applications");
    } else {
      applicationStorage.saveApplication({
        policyId: policy.id,
        policyName: policy.title,
        city: policy.city,
        province: policy.province,
        subsidyAmount: policy.subsidyAmount,
        status: "saved",
        notes: "",
        deadline: policy.validUntil === "长期有效" 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          : policy.validUntil,
      });
      setIsTracking(true);
    }
  };

  if (!policy) {
    return (
      <div className="py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">政策不存在</h2>
        <p className="text-slate-500 mb-6">可能该政策已过期或被删除</p>
        <button onClick={() => navigate("/policies")} className="btn-primary">
          返回政策列表
        </button>
      </div>
    );
  }

  const status = getPolicyStatus(policy.validUntil);
  const statusColorMap: Record<string, string> = {
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    yellow: "bg-amber-100 text-amber-700 border-amber-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="py-8 animate-fade-in">
      <div className="container">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-500 hover:text-primary-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          返回
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="tag tag-green">
                  {policy.categoryName}
                </span>
                <span className="tag tag-blue flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {policy.city}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColorMap[status.color] || statusColorMap.green}`}>
                  {status.label}
                </span>
                {policy.isRealData ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    真实政策
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    示例数据
                  </span>
                )}
              </div>

              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 font-serif">
                  {policy.title}
                </h1>
                <button
                  onClick={() => toggleFavorite(policy.id)}
                  className={`p-3 rounded-xl transition-all duration-200 flex-shrink-0 ${
                    fav
                      ? "bg-rose-50 text-rose-500"
                      : "bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-400"
                  }`}
                >
                  <Heart className={`w-6 h-6 ${fav ? "fill-current" : ""}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100">
                <div className="text-center">
                  <div className="text-xs text-slate-500 mb-1">发布机构</div>
                  <div className="text-sm font-medium text-slate-700 flex items-center justify-center gap-1">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {policy.organization.length > 8
                      ? policy.organization.slice(0, 8) + "..."
                      : policy.organization}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-500 mb-1">发布时间</div>
                  <div className="text-sm font-medium text-slate-700 flex items-center justify-center gap-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {formatDate(policy.publishDate)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-500 mb-1">有效期至</div>
                  <div className="text-sm font-medium text-slate-700 flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {policy.validUntil === "长期有效"
                      ? "长期有效"
                      : formatDate(policy.validUntil)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-500 mb-1">浏览量</div>
                  <div className="text-sm font-medium text-slate-700 flex items-center justify-center gap-1">
                    <Eye className="w-4 h-4 text-slate-400" />
                    {formatNumber(policy.viewCount)}
                  </div>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">{policy.description}</p>
            </div>

            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent-500" />
                待遇说明
              </h2>
              <div className="bg-gradient-to-r from-accent-50 to-amber-50 rounded-2xl p-6 mb-6">
                <div className="text-sm text-slate-500 mb-2">补贴金额</div>
                <div className="text-3xl font-bold text-accent-600 mb-2">
                  {policy.subsidyAmount}
                </div>
                <div className="text-sm text-slate-500">{policy.subsidyType}</div>
              </div>
              <ul className="space-y-3">
                {policy.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-primary-600" />
                申请条件
              </h2>
              <ul className="space-y-3">
                {policy.conditions.map((condition, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-slate-600 pt-0.5">{condition}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-sm text-slate-500">适用学历：</span>
                {policy.educationName.map((edu) => (
                  <span key={edu} className="tag tag-amber">
                    {edu}
                  </span>
                ))}
              </div>
            </div>

            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                申请流程
              </h2>
              <div className="relative">
                <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-slate-200" />
                <div className="space-y-6">
                  {policy.applicationProcess.map((step) => (
                    <div key={step.step} className="relative flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0 z-10 shadow-lg">
                        {step.step}
                      </div>
                      <div className="pt-1.5">
                        <h3 className="font-semibold text-slate-800 mb-1">
                          {step.title}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card p-6 md:p-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-500" />
                  所需材料
                </h2>
                <button
                  onClick={handleCopyMaterials}
                  className="btn-secondary flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      一键复制
                    </>
                  )}
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {policy.materials.map((material, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                  >
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-700">{material}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6 sticky top-24">
              <div className="bg-gradient-hero rounded-xl p-5 text-white mb-5">
                <div className="text-sm text-blue-100 mb-1">补贴金额</div>
                <div className="text-2xl font-bold mb-1">{policy.subsidyAmount}</div>
                <div className="text-sm text-blue-200">{policy.subsidyType}</div>
              </div>

              <button
                onClick={handleTrackApplication}
                className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 mb-3 ${
                  isTracking
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "btn-primary"
                }`}
              >
                <History className="w-5 h-5" />
                {isTracking ? "查看申请进度" : "跟踪申请进度"}
              </button>

              <button
                onClick={() => toggleFavorite(policy.id)}
                className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 mb-3 ${
                  fav
                    ? "bg-rose-50 text-rose-600 border border-rose-200"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Heart className={`w-5 h-5 ${fav ? "fill-current" : ""}`} />
                {fav ? "已收藏" : "收藏政策"}
              </button>

              <button
                onClick={handleShare}
                className="w-full py-3 rounded-xl font-medium transition-all bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-2 mb-3"
              >
                <Share2 className="w-5 h-5" />
                分享给好友
              </button>

              <a
                href={policy.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                前往官方申请
              </a>

              <div className="mt-5 pt-5 border-t border-slate-100">
                <div className="text-sm font-medium text-slate-700 mb-3">
                  官方咨询渠道
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    咨询电话：{policy.contactPhone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    {policy.officialUrl}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-100">
                <div className="text-sm font-medium text-slate-700 mb-3">
                  政策标签
                </div>
                <div className="flex flex-wrap gap-2">
                  {policy.tags.map((tag) => (
                    <span key={tag} className="tag tag-blue">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-100">
                <div className="text-sm font-medium text-slate-700 mb-2">
                  数据来源
                </div>
                <p className="text-xs text-slate-500 mb-2">
                  {policy.dataSource}
                </p>
                {policy.lastVerifiedAt && (
                  <p className="text-xs text-slate-400">
                    最后核实时间：{formatDate(policy.lastVerifiedAt)}
                  </p>
                )}
              </div>

              {policy.validUntil !== "长期有效" && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <button
                    onClick={handleSetReminder}
                    className="w-full py-3 rounded-xl font-medium transition-all bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 flex items-center justify-center gap-2"
                  >
                    <Bell className="w-5 h-5" />
                    申请截止提醒
                  </button>
                  {showReminder && (
                    <p className="text-xs text-amber-600 mt-2 text-center">
                      已设置提醒，请关注截止日期
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
