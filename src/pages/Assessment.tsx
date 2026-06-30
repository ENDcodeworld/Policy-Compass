import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  GraduationCap,
  MapPin,
  Calendar,
  Briefcase,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Check,
  RefreshCw,
  History,
  Trash2,
  Clock,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { UserProfile, EducationLevel, EDUCATION_MAP } from "@/types";
import { cities } from "@/data/cities";
import PolicyCard from "@/components/PolicyCard";
import CityPicker from "@/components/CityPicker";
import { getMatchLevel } from "@/utils/matcher";

const steps = [
  { id: 1, title: "学历信息", icon: GraduationCap },
  { id: 2, title: "意向城市", icon: MapPin },
  { id: 3, title: "其他信息", icon: Lightbulb },
];

const educationOptions: { key: EducationLevel; label: string; desc: string }[] = [
  { key: "junior_college", label: "大专", desc: "大专/高职学历" },
  { key: "undergraduate", label: "本科", desc: "本科学历/学士" },
  { key: "master", label: "硕士", desc: "硕士研究生" },
  { key: "phd", label: "博士", desc: "博士研究生" },
];

const hotCities = cities.filter((c) => c.isHot);

const graduationYears = ["2024", "2025", "2026", "2027"];

export default function Assessment() {
  const navigate = useNavigate();
  const {
    setUserProfile,
    getMatchedPolicies,
    assessmentHistory,
    addAssessmentHistory,
    clearAssessmentHistory,
  } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    education: "undergraduate",
    graduationYear: "2025",
    major: "",
    targetCities: [],
    isFreshGraduate: true,
    hasEntrepreneurshipPlan: false,
  });
  const [matchedResults, setMatchedResults] = useState<
    { policy: any; score: number; reasons: string[] }[]
  >([]);

  const updateProfile = <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K]
  ) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCity = (cityName: string) => {
    const newCities = profile.targetCities.includes(cityName)
      ? profile.targetCities.filter((c) => c !== cityName)
      : [...profile.targetCities, cityName];
    updateProfile("targetCities", newCities);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setUserProfile(profile);
      const results = getMatchedPolicies();
      setMatchedResults(results);
      setShowResult(true);
      addAssessmentHistory(profile, results);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setShowResult(false);
    setProfile({
      education: "undergraduate",
      graduationYear: "2025",
      major: "",
      targetCities: [],
      isFreshGraduate: true,
      hasEntrepreneurshipPlan: false,
    });
  };

  const loadHistory = (history: any) => {
    setProfile(history.profile);
    setMatchedResults(history.matchedPolicies);
    setShowResult(true);
    setShowHistory(false);
  };

  const canProceed = () => {
    if (currentStep === 1) return !!profile.education;
    if (currentStep === 2) return profile.targetCities.length > 0;
    return true;
  };

  if (showResult) {
    return (
      <div className="py-8 animate-fade-in">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-serif mb-2">
                测评完成！
              </h1>
              <p className="text-slate-500">
                根据你的条件，为你匹配到{" "}
                <span className="font-bold text-primary-600">
                  {matchedResults.length}
                </span>{" "}
                条可享受的政策
              </p>
            </div>

            <div className="card p-6 mb-8 bg-gradient-to-br from-primary-50 to-accent-50 border-primary-100 dark:from-primary-900/20 dark:to-accent-900/20 dark:border-primary-800">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent-500" />
                  你的测评信息
                </h3>
                <button
                  onClick={handleRestart}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  重新测评
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-slate-500 dark:text-slate-400">学历</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {EDUCATION_MAP[profile.education]}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">毕业年份</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {profile.graduationYear}年
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">意向城市</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {profile.targetCities.join("、")}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">应届毕业生</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {profile.isFreshGraduate ? "是" : "否"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {matchedResults.map((result, idx) => {
                const matchLevel = getMatchLevel(result.score);
                return (
                  <div
                    key={result.policy.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="relative">
                      <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 to-primary-600 rounded-l-xl" />
                      <div className="ml-2">
                        <PolicyCard
                          policy={result.policy}
                          matchScore={result.score}
                          matchReasons={result.reasons}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {matchedResults.length === 0 && (
              <div className="text-center py-16 card">
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  暂时没有匹配的政策
                </h3>
                <p className="text-slate-500 mb-6">
                  试试调整你的条件，或者浏览全部政策
                </p>
                <div className="flex justify-center gap-3">
                  <button onClick={handleRestart} className="btn-secondary">
                    重新测评
                  </button>
                  <button
                    onClick={() => navigate("/policies")}
                    className="btn-primary"
                  >
                    浏览全部政策
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-hero mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-serif mb-2">
              智能政策测评
            </h1>
            <p className="text-slate-500">
              填写简单信息，10秒为你精准匹配可享受的政策福利
            </p>
          </div>

          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isDone = currentStep > step.id;
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-hero text-white shadow-lg scale-110"
                            : isDone
                            ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                        }`}
                      >
                        {isDone ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium ${
                          isActive
                            ? "text-primary-600"
                            : isDone
                            ? "text-slate-600 dark:text-slate-300"
                            : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`w-16 md:w-24 h-1 mx-2 rounded-full transition-colors duration-300 ${
                          isDone ? "bg-primary-400" : "bg-slate-200 dark:bg-slate-700"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {assessmentHistory.length > 0 && !showResult && (
            <div className="mb-6">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full card p-4 flex items-center justify-between hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <History className="w-5 h-5" />
                  <span>测评历史记录</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {assessmentHistory.length}条
                  </span>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    showHistory ? "rotate-90" : ""
                  }`}
                />
              </button>

              {showHistory && (
                <div className="mt-2 space-y-2 animate-fade-in">
                  {assessmentHistory.map((history) => (
                    <div
                      key={history.id}
                      className="card p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <button
                        onClick={() => loadHistory(history)}
                        className="flex items-center gap-3 flex-1 text-left"
                      >
                        <Clock className="w-4 h-4 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {history.profile.targetCities.join("、")}
                          </div>
                          <div className="text-sm text-slate-500">
                            {new Date(history.date).toLocaleDateString("zh-CN")} ·{" "}
                            {history.matchedPolicies.length}条政策匹配
                          </div>
                        </div>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="card p-6 md:p-10">
            {currentStep === 1 && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary-600" />
                  你的最高学历是？
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                  选择你当前或即将获得的最高学历
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {educationOptions.map((edu) => {
                    const selected = profile.education === edu.key;
                    return (
                      <button
                        key={edu.key}
                        onClick={() => updateProfile("education", edu.key)}
                        className={`p-5 rounded-2xl border-2 transition-all text-left ${
                          selected
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                            : "border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600"
                        }`}
                      >
                        <div
                          className={`text-lg font-semibold mb-1 ${
                            selected ? "text-primary-700" : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {edu.label}
                        </div>
                        <div className="text-sm text-slate-500">{edu.desc}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    预计毕业年份
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {graduationYears.map((year) => {
                      const selected = profile.graduationYear === year;
                      return (
                        <button
                          key={year}
                          onClick={() => updateProfile("graduationYear", year)}
                          className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                            selected
                              ? "bg-primary-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {year}年
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  你的意向城市是？
                </h2>
                <p className="text-slate-500 text-sm mb-4">
                  全国{cities.length}个城市可选，支持搜索和按省份筛选
                </p>
                <CityPicker
                  selectedCities={profile.targetCities}
                  onCityToggle={toggleCity}
                  maxHeight="400px"
                />
                {profile.targetCities.length > 0 && (
                  <div className="mt-3 text-sm text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    已选择 {profile.targetCities.length} 个城市
                  </div>
                )}
                {profile.targetCities.length === 0 && (
                  <p className="text-amber-600 text-sm mt-4 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4" />
                    请至少选择一个意向城市
                  </p>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary-600" />
                  还有一些信息
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                  帮助我们更精准地为你匹配政策
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      你是应届毕业生吗？
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateProfile("isFreshGraduate", true)}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                          profile.isFreshGraduate
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                            : "border-slate-200 dark:border-slate-700 hover:border-primary-300"
                        }`}
                      >
                        <div
                          className={`font-semibold ${
                            profile.isFreshGraduate
                              ? "text-primary-700"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          是，应届毕业
                        </div>
                        <div className="text-xs text-slate-500 text-left">
                          毕业1年以内
                        </div>
                      </button>
                      <button
                        onClick={() => updateProfile("isFreshGraduate", false)}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                          !profile.isFreshGraduate
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                            : "border-slate-200 dark:border-slate-700 hover:border-primary-300"
                        }`}
                      >
                        <div
                          className={`font-semibold ${
                            !profile.isFreshGraduate
                              ? "text-primary-700"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          不是
                        </div>
                        <div className="text-xs text-slate-500 text-left">
                          毕业超过1年
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      你有创业计划吗？
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateProfile("hasEntrepreneurshipPlan", true)}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                          profile.hasEntrepreneurshipPlan
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                            : "border-slate-200 dark:border-slate-700 hover:border-primary-300"
                        }`}
                      >
                        <div
                          className={`font-semibold flex items-center gap-2 ${
                            profile.hasEntrepreneurshipPlan
                              ? "text-primary-700"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          <Briefcase className="w-4 h-4" />
                          有创业想法
                        </div>
                        <div className="text-xs text-slate-500 text-left">
                          想了解创业扶持政策
                        </div>
                      </button>
                      <button
                        onClick={() => updateProfile("hasEntrepreneurshipPlan", false)}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                          !profile.hasEntrepreneurshipPlan
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                            : "border-slate-200 dark:border-slate-700 hover:border-primary-300"
                        }`}
                      >
                        <div
                          className={`font-semibold ${
                            !profile.hasEntrepreneurshipPlan
                              ? "text-primary-700"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          暂时没有
                        </div>
                        <div className="text-xs text-slate-500 text-left">
                          先找工作为主
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`flex items-center gap-1 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  currentStep === 1
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                上一步
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-1 btn-primary ${
                  !canProceed() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {currentStep === 3 ? (
                  <>
                    查看匹配结果
                    <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    下一步
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
