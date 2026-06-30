import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Heart,
  Eye,
  Search,
  Calendar,
  User,
  Tag,
  ThumbsUp,
} from "lucide-react";
import { articleStorage } from "@/utils/storage";

const articleCategories = [
  "全部",
  "申请攻略",
  "政策解读",
  "经验分享",
  "政策对比",
];

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchText, setSearchText] = useState("");
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  const articles = articleStorage.getArticles();

  const filteredArticles = articles.filter((article) => {
    const matchCategory = selectedCategory === "全部" || article.category === selectedCategory;
    const matchSearch =
      !searchText ||
      article.title.toLowerCase().includes(searchText.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchText.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchText.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleLike = (articleId: string) => {
    setLikeCounts((prev) => ({
      ...prev,
      [articleId]: (prev[articleId] || 0) + 1,
    }));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="py-8 animate-fade-in">
      <div className="container">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <h1 className="text-3xl font-bold text-slate-800 font-serif">
              申请攻略
            </h1>
          </div>
          <p className="text-slate-500">
            真实经验分享、政策深度解读，助你顺利申请政策福利
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
                placeholder="搜索文章、标签..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {articleCategories.map((cat) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, idx) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {article.coverImage && (
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                  <div className="text-6xl opacity-50">📖</div>
                </div>
              )}

              {!article.coverImage && (
                <div className="h-40 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                  <div className="text-6xl opacity-50">📖</div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                    {article.category}
                  </span>
                  {article.city && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                      {article.city}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer">
                  {article.title}
                </h3>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {article.summary}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(article.createdAt)}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {article.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {article.likes + (likeCounts[article.id] || 0)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleLike(article.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 text-sm font-medium transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    点赞
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              暂无相关文章
            </h3>
            <p className="text-slate-500">
              试试调整搜索条件或切换分类
            </p>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-accent-50 to-primary-50 rounded-2xl p-8 border border-accent-100">
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              分享你的申请经验
            </h3>
            <p className="text-slate-600 mb-4">
              你的经验可能帮助到更多同学
            </p>
            <button className="btn-primary">
              撰写攻略文章
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
