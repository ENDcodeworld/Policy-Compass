import { Link } from "react-router-dom";
import {
  Heart,
  Eye,
  MapPin,
  Briefcase,
  Home,
  Rocket,
  Coffee,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Policy, CATEGORY_MAP, DIFFICULTY_MAP } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { formatNumber, getPolicyStatus } from "@/utils/storage";

interface PolicyCardProps {
  policy: Policy;
  matchScore?: number;
  matchReasons?: string[];
  compact?: boolean;
}

const categoryIcons: Record<string, typeof Briefcase> = {
  employment: Briefcase,
  housing: Home,
  startup: Rocket,
  household: MapPin,
  living: Coffee,
};

export default function PolicyCard({
  policy,
  matchScore,
  matchReasons,
  compact = false,
}: PolicyCardProps) {
  const { toggleFavorite, isFavorite } = useAppStore();
  const fav = isFavorite(policy.id);
  const categoryInfo = CATEGORY_MAP[policy.category];
  const Icon = categoryIcons[policy.category];
  const difficultyInfo = DIFFICULTY_MAP[policy.difficulty];
  const status = getPolicyStatus(policy.validUntil);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(policy.id);
  };

  const statusBadgeMap: Record<string, { bg: string; text: string }> = {
    green: { bg: "bg-emerald-100", text: "text-emerald-700" },
    yellow: { bg: "bg-amber-100", text: "text-amber-700" },
    orange: { bg: "bg-orange-100", text: "text-orange-700" },
    red: { bg: "bg-red-100", text: "text-red-700" },
  };

  if (compact) {
    return (
      <Link
        to={`/policies/${policy.id}`}
        className="card p-4 flex items-center gap-4 group cursor-pointer"
      >
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-${categoryInfo.color}-50 group-hover:scale-110 transition-transform`}
        >
          <Icon className={`w-6 h-6 text-${categoryInfo.color}-600`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-800 truncate group-hover:text-primary-600 transition-colors">
            {policy.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {policy.city}
            </span>
            <span>·</span>
            <span className="text-accent-600 font-medium">
              {policy.subsidyAmount}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
      </Link>
    );
  }

  return (
    <Link
      to={`/policies/${policy.id}`}
      className="card p-6 group cursor-pointer flex flex-col h-full relative"
    >
      {status.color !== "green" && status.color !== "green" && (
        <div className={`absolute top-3 right-3 ${statusBadgeMap[status.color]?.bg} ${statusBadgeMap[status.color]?.text} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
          <AlertCircle className="w-3 h-3" />
          {status.label}
        </div>
      )}

      {!policy.isRealData && (
        <div className="absolute top-3 left-3 bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          示例
        </div>
      )}

      {policy.isRealData && (
        <div className="absolute top-3 left-3 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          真实
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${categoryInfo.color}-50 group-hover:scale-110 transition-transform`}
        >
          <Icon className={`w-6 h-6 text-${categoryInfo.color}-600`} />
        </div>
        <button
          onClick={handleFavorite}
          className={`p-2 rounded-full transition-all duration-200 ${
            fav
              ? "bg-rose-50 text-rose-500"
              : "bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-400"
          }`}
        >
          <Heart className={`w-5 h-5 ${fav ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`tag tag-${categoryInfo.color}`}>
            {categoryInfo.name}
          </span>
          <span className="tag tag-blue">{policy.city}</span>
          <span className={`tag tag-${difficultyInfo.color}`}>
            {difficultyInfo.label}
          </span>
        </div>

        <h3 className="font-semibold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors font-serif">
          {policy.title}
        </h3>

        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
          {policy.description}
        </p>

        <div className="bg-gradient-to-r from-accent-50 to-amber-50 rounded-xl p-3 mb-4">
          <div className="text-xs text-slate-500 mb-1">补贴金额</div>
          <div className="text-xl font-bold text-accent-600">
            {policy.subsidyAmount}
          </div>
        </div>

        {matchScore !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">匹配度</span>
              <span className="text-xs font-semibold text-primary-600">
                {matchScore}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                style={{ width: `${matchScore}%` }}
              />
            </div>
            {matchReasons && matchReasons.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {matchReasons.slice(0, 2).map((reason, idx) => (
                  <span key={idx} className="tag tag-green !text-[10px]">
                    ✓ {reason}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {formatNumber(policy.viewCount)}
          </span>
          <span className="text-xs text-slate-400">
            {policy.educationName.slice(0, 2).join("、")}
            {policy.educationName.length > 2 ? "等" : ""}
          </span>
        </div>
        <span className="text-sm font-medium text-primary-600 flex items-center gap-1 group-hover:gap-2 transition-all">
          查看详情
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
