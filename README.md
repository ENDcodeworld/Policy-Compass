# 🧭 政策指南针 - 大学生政策待遇信息平台

> 帮助大学生了解各地政策福利，解决信息差问题，让每一位毕业生都不错过应有的福利。

[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-119def?style=flat-square&logo=capacitor)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](#许可证)

---

## ✨ 功能特性

### 🎯 核心功能

- **智能政策匹配** - 填写简单信息，10秒精准匹配所有可享受的政策待遇
- **全国城市覆盖** - 支持337个地级及以上城市，按省份分组，支持搜索和多选
- **5大政策分类** - 就业补贴、住房补贴、创业扶持、落户政策、生活福利
- **数据真实性标注** - 真实政策和示例数据明确标识，详情页展示数据来源

### 📱 用户系统

- **登录注册** - 本地用户系统，数据安全存储在本地
- **个人中心** - 查看个人信息、收藏记录、申请记录
- **政策收藏** - 收藏感兴趣的政策，随时查看
- **申请进度跟踪** - 追踪政策申请状态，添加备注记录

### 📚 信息服务

- **常见问题FAQ** - 8大分类，解答你的疑惑
- **申请攻略文章** - 经验分享，助你顺利申请
- **政策订阅** - 按城市和分类订阅，不错过新政策

### 🎨 界面体验

- **响应式设计** - 完美适配手机、平板、电脑
- **现代化UI** - 简洁美观，以人为本的设计理念
- **流畅动画** - 优雅的过渡动画和交互反馈
- **深色模式** - 支持深色/浅色主题切换

---

## 🏗️ 技术架构

### 项目结构

```
.
├── frontend/              # 前端 (React + TypeScript + Vite)
├── server/                # 后端 (Express + SQLite + JWT)
│   ├── src/
│   │   ├── routes/        # API路由
│   │   ├── middleware/    # 中间件
│   │   ├── db/            # 数据库
│   │   └── index.js       # 服务入口
│   ├── data/              # 数据文件
│   └── package.json
├── android/               # Android原生项目
└── scripts/               # 工具脚本
```

### 技术栈

| 技术 | 版本 | 用途 |
|-----|------|------|
| React | 18.3 | UI框架 |
| TypeScript | 5.8 | 类型安全 |
| Vite | 6.x | 构建工具 |
| TailwindCSS | 3.4 | CSS框架 |
| Express | 4.x | 后端框架 |
| SQLite | - | 数据库 (better-sqlite3) |
| JWT | 9.x | 身份认证 |
| React Router | 7.x | 路由管理 |
| Zustand | 5.x | 状态管理 |
| Capacitor | 8.x | 跨平台打包 |
| Lucide React | 0.511 | 图标库 |

---

## 🚀 快速开始

### 前端开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 生产构建
pnpm build

# 预览构建结果
pnpm preview
```

### 后端开发

```bash
# 进入后端目录
cd server

# 安装依赖
npm install

# 初始化数据库并导入政策数据
node src/db/init.js
node src/db/import-policies.js

# 启动开发服务
npm run dev

# 或直接启动
npm start
```

后端服务默认运行在 http://localhost:3001

### API接口

**健康检查**
```
GET /api/health
```

**认证接口**
```
POST /api/auth/register     # 注册
POST /api/auth/login        # 登录
GET  /api/auth/me           # 获取当前用户
PUT  /api/auth/me           # 更新用户信息
PUT  /api/auth/password     # 修改密码
```

**政策接口**
```
GET  /api/policies              # 政策列表（支持筛选、分页、搜索）
GET  /api/policies/:id          # 政策详情
GET  /api/policies/meta/cities  # 获取城市列表
GET  /api/policies/meta/categories  # 获取分类列表
```

**用户数据接口（需登录）**
```
GET    /api/user/favorites       # 收藏列表
POST   /api/user/favorites       # 添加收藏
DELETE /api/user/favorites/:id   # 取消收藏

GET    /api/user/applications    # 申请列表
POST   /api/user/applications    # 新增申请
PUT    /api/user/applications/:id # 更新申请
DELETE /api/user/applications/:id # 删除申请

GET    /api/user/subscriptions   # 订阅列表
POST   /api/user/subscriptions   # 添加订阅
DELETE /api/user/subscriptions   # 取消订阅
```

**通知接口（需登录）**
```
GET    /api/notifications              # 通知列表
GET    /api/notifications/unread-count # 未读数量
PUT    /api/notifications/:id/read     # 标记已读
PUT    /api/notifications/read-all     # 全部已读
DELETE /api/notifications/:id          # 删除通知
```

---

## 📱 Android APK 构建

### 前置条件

1. 安装 Java 21
2. 安装 Android SDK（API 34+）
3. 配置 `ANDROID_HOME` 环境变量

### 构建APK

```bash
# 一键构建
pnpm build:apk

# 或者分步执行
pnpm build              # 构建Web资源
pnpm cap:sync           # 同步到原生项目
cd android && ./gradlew assembleDebug
```

### APK输出路径

```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📁 项目结构

```
.
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   │   ├── CityPicker.tsx     # 城市选择器
│   │   ├── FilterBar.tsx      # 筛选栏
│   │   ├── Footer.tsx         # 页脚
│   │   ├── Header.tsx         # 头部导航
│   │   ├── Layout.tsx         # 布局组件
│   │   ├── PolicyCard.tsx     # 政策卡片
│   │   └── Empty.tsx          # 空状态组件
│   ├── data/              # 数据文件
│   │   ├── cities.ts          # 城市数据（337个）
│   │   └── policies.ts        # 政策数据
│   ├── hooks/             # 自定义Hooks
│   ├── lib/               # 工具库
│   ├── pages/             # 页面组件
│   │   ├── Home.tsx           # 首页
│   │   ├── Assessment.tsx     # 智能测评
│   │   ├── PolicyList.tsx     # 政策列表
│   │   ├── PolicyDetail.tsx   # 政策详情
│   │   ├── FAQ.tsx            # 常见问题
│   │   ├── Articles.tsx       # 攻略文章
│   │   ├── Applications.tsx   # 申请进度
│   │   ├── Subscriptions.tsx  # 政策订阅
│   │   ├── Favorites.tsx      # 我的收藏
│   │   ├── Profile.tsx        # 个人中心
│   │   └── Login.tsx          # 登录注册
│   ├── store/             # 状态管理（Zustand）
│   ├── types/             # TypeScript类型定义
│   ├── utils/             # 工具函数
│   ├── App.tsx            # 应用入口
│   ├── main.tsx           # 渲染入口
│   └── index.css          # 全局样式
├── android/               # Android原生项目
├── public/                # 静态资源
├── index.html             # HTML模板
├── package.json           # 项目配置
├── tailwind.config.js     # TailwindCSS配置
├── tsconfig.json          # TypeScript配置
├── vite.config.ts         # Vite配置
├── capacitor.config.ts    # Capacitor配置
└── README.md              # 项目说明
```

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|-----|------|------|
| React | 18.3 | UI框架 |
| TypeScript | 5.8 | 类型安全 |
| Vite | 6.x | 构建工具 |
| TailwindCSS | 3.4 | CSS框架 |
| React Router | 7.x | 路由管理 |
| Zustand | 5.x | 状态管理 |
| Capacitor | 8.x | 跨平台打包 |
| Lucide React | 0.511 | 图标库 |
| ESLint | 9.x | 代码检查 |

---

## 📊 数据说明

### 城市数据
- **覆盖范围**：全国337个地级及以上城市
- **数据来源**：国家统计局行政区划数据
- **更新时间**：2024年

### 政策数据
- **政策数量**：45+条
- **真实政策城市**：北京、上海、深圳、杭州、成都等20个城市
- **政策分类**：
  - 🏢 就业补贴
  - 🏠 住房补贴
  - 🚀 创业扶持
  - 📍 落户政策
  - ☕ 生活福利

### 数据真实性

> ⚠️ **重要说明**：
> - 标注"✅ 真实"的政策基于当地人社局公开信息整理，具体以官方最新发布为准
> - 标注"⚠️ 示例"的政策为示例数据，仅供功能演示参考
> - 建议在申请前务必通过官方渠道核实最新政策信息
> - 本平台不对政策的准确性和时效性承担责任

---

## 🤝 贡献指南

欢迎贡献代码、补充真实政策数据！

### 贡献方式

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献政策数据

如果您了解某个城市的真实政策，欢迎补充：
- 在 `src/data/policies.ts` 中添加政策
- 确保政策信息真实可靠，并附上官方来源链接
- 标记 `isRealData: true` 并填写 `dataSource`

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

- 感谢所有为开源社区做出贡献的开发者
- 政策数据来源于各地人社局公开信息整理
- UI设计灵感来自于现代Web应用最佳实践

---

## 📮 联系我们

如有问题或建议，欢迎通过以下方式联系：

- 提交 [Issue](https://github.com/ENDcodeworld/-/issues)
- 发送 Pull Request

---

<p align="center">
  <sub>用 ❤️ 构建，让政策福利触手可及</sub>
</p>
