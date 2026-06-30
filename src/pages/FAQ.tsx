import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import { faqStorage } from "@/utils/storage";

const faqCategories = [
  "全部",
  "申请流程",
  "资格条件",
  "补贴发放",
  "其他问题",
];

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});

  const faqs = faqStorage.getFAQs();

  const filteredFAQs = faqs.filter((faq) => {
    const matchCategory = selectedCategory === "全部" || faq.category === selectedCategory;
    const matchSearch =
      !searchText ||
      faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleHelpful = (faqId: string) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [faqId]: (prev[faqId] || 0) + 1,
    }));
  };

  const toggleExpand = (faqId: string) => {
    setExpandedId(expandedId === faqId ? null : faqId);
  };

  return (
    <div className="py-8 animate-fade-in">
      <div className="container">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-6 h-6 text-primary-600" />
            <h1 className="text-3xl font-bold text-slate-800 font-serif">
              常见问题
            </h1>
          </div>
          <p className="text-slate-500">
            解答你在申请政策补贴过程中遇到的常见问题
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 mb-8 border border-slate-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="搜索问题..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {faqCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-primary-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredFAQs.map((faq, idx) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 p-1">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 animate-fade-in">
                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed mb-4">
                      {faq.answer}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {faq.views + (helpfulCounts[faq.id] ? 1 : 0)} 次浏览
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {faq.helpfulCount + (helpfulCounts[faq.id] || 0)} 觉得有用
                        </span>
                      </div>
                      <button
                        onClick={() => handleHelpful(faq.id)}
                        className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-primary-100 text-slate-600 hover:text-primary-700 text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        有帮助
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              没有找到相关问题
            </h3>
            <p className="text-slate-500">
              试试调整搜索关键词或切换分类
            </p>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 border border-primary-100">
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              还有其他问题？
            </h3>
            <p className="text-slate-600 mb-4">
              联系我们或查看具体政策的详细信息
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/policies" className="btn-primary">
                浏览政策库
              </Link>
              <Link to="/assessment" className="btn-secondary">
                智能测评
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
