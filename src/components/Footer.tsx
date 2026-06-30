import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-serif">
                  政策指南针
                </h3>
                <p className="text-xs text-slate-400">大学生福利一站式查询</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              聚合全国各城市大学生政策待遇信息，消除信息差，让每一位大学生都能享受到应有的福利。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">快速导航</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a
                  href="/policies"
                  className="hover:text-white transition-colors"
                >
                  政策库
                </a>
              </li>
              <li>
                <a
                  href="/assessment"
                  className="hover:text-white transition-colors"
                >
                  智能测评
                </a>
              </li>
              <li>
                <a
                  href="/favorites"
                  className="hover:text-white transition-colors"
                >
                  我的收藏
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">联系我们</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>contact@policynavi.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>400-123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>北京市海淀区中关村</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2024 政策指南针. 保留所有权利.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">
              隐私政策
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              使用条款
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              意见反馈
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
