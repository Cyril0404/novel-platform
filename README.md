# NovelFlow - 全球经典公版书阅读平台
## 📋 项目定位
面向全球用户的公版经典文学阅读平台，提供英文、西班牙文、阿拉伯文等多语言版本的中国古典名著、世界经典文学阅读服务。主打无广告、纯净阅读体验，支持多种阅读设置和TTS听书功能，适合全球用户免费阅读公版书籍。

**GitHub仓库：** https://github.com/Cyril0404/novel-platform
**技术栈：** Next.js 14 + TypeScript + Prisma + Tailwind CSS
**适合市场：** 欧美、拉美、中东、东南亚等全球市场

---

## 目录
1. [核心功能](#1-核心功能)
2. [技术栈](#2-技术栈)
3. [快速开始](#3-快速开始)
4. [项目结构](#4-项目结构)
5. [出海适配指南](#5-出海适配指南)
6. [公版书批量导入指南](#6-公版书批量导入指南)
7. [国际化配置](#7-国际化配置)
8. [环境变量配置](#8-环境变量配置)
9. [数据库](#9-数据库)
10. [API 文档](#10-API-文档)
11. [部署指南](#11-部署指南)

---

## 1. 核心功能
### 1.1 阅读核心功能
- ✅ 书籍列表浏览（分类筛选、热度/评分/最新排序）
- ✅ 书籍详情页（简介、作者信息、评分、评论）
- ✅ 章节阅读器（无广告、纯净阅读）
- ✅ 阅读进度自动跟踪，上次阅读位置记忆
- ✅ 个人书架管理（收藏、阅读状态标记）

### 1.2 极致阅读体验
- ✅ 4种主题模式：Light / Dark / Sepia / AMOLED纯黑
- ✅ 字体大小调节（14-32px）
- ✅ 行间距调节（1.2-3.0倍）
- ✅ 边距调节（0-40px）
- ✅ 多字体选择：Sans / Serif / Mono / 系统字体
- ✅ TTS听书（支持0.5x - 3x语速，多语言发音）
- ✅ 章节快速跳转、阅读进度条
- ✅ 横屏/竖屏自适应

### 1.3 社区功能
- ✅ 1-5星评分系统
- ✅ 评论、留言系统
- ✅ 智能推荐（基于题材、阅读历史）
- ✅ 热门排行、新书推荐

### 1.4 用户功能
- ✅ 邮箱/社交账号登录注册
- ✅ 阅读历史自动同步
- ✅ 多设备阅读进度同步
- ✅ 书架收藏、分类管理

---

## 2. 技术栈
| 类别 | 技术 | 优势 |
|-----|------|------|
| 框架 | Next.js 14 (App Router) | 服务端渲染，SEO友好，适合出海流量 |
| 语言 | TypeScript | 类型安全，易于维护 |
| 样式 | Tailwind CSS | 响应式设计，快速开发 |
| 数据库 | SQLite (Prisma ORM) | 轻量、高性能，无需单独数据库服务 |
| 认证 | NextAuth.js | 支持多平台OAuth登录，易于扩展 |
| UI组件 | Radix UI + 自定义组件 | 无障碍友好，性能优秀 |
| 国际化 | next-intl | 多语言支持，轻松适配全球市场 |

---

## 3. 快速开始
### 3.1 环境要求
- Node.js 18+
- npm / yarn / pnpm
- Git

### 3.2 安装步骤
```bash
# 1. 克隆仓库
git clone https://github.com/Cyril0404/novel-platform.git
cd novel-platform

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写必要配置

# 4. 初始化数据库
npx prisma generate
npx prisma db push

# 5. 导入公版书数据（可选）
npx prisma db seed

# 6. 启动开发服务器
npm run dev
```

### 3.3 访问应用
- 开发服务器：http://localhost:3000
- 数据库可视化管理：http://localhost:5555（运行 `npx prisma studio` 启动）

---

## 4. 项目结构
```
novel-platform/
├── app/                      # Next.js App Router
│   ├── api/                  # API路由
│   │   ├── auth/             # 认证接口
│   │   ├── books/            # 书籍相关接口
│   │   ├── bookshelf/        # 书架接口
│   │   ├── progress/         # 阅读进度接口
│   │   └── reviews/          # 评论接口
│   ├── [locale]/             # 多语言路由（en/es/ar等）
│   │   ├── books/            # 书籍列表页
│   │   ├── book/[slug]/      # 书籍详情页
│   │   └── read/[slug]/[chapter]/ # 阅读页
│   ├── layout.tsx            # 全局布局
│   └── page.tsx              # 首页
├── components/               # 通用组件
├── lib/                      # 工具库
├── messages/                 # 多语言翻译文件
├── prisma/                   # 数据库
│   ├── schema.prisma         # 数据模型
│   └── seed.ts               # 公版书导入脚本
├── public/                   # 静态资源
├── content/                  # 公版书内容库（按语言分类）
│   ├── en/                   # 英文书籍
│   ├── es/                   # 西班牙文书籍
│   └── ar/                   # 阿拉伯文书籍
└── 配置文件...
```

---

## 5. 出海适配指南
### 5.1 目标市场适配
| 市场 | 语言 | 特色适配 |
|------|------|----------|
| 欧美 | 英文 | 经典名著、中国古典文学英文翻译 |
| 拉美 | 西班牙文 | 西语翻译作品，符合拉美用户阅读习惯 |
| 中东 | 阿拉伯文 | RTL从右往左排版，符合伊斯兰文化规范 |
| 东南亚 | 英文/本地语言 | 轻量化加载，适合移动网络 |

### 5.2 内容合规要求
- ✅ 仅使用公版书籍，无版权风险
- ❌ 禁止涉及宗教、政治、色情等敏感内容
- ❌ 阿拉伯市场禁止出现猪、酒、暴露女性等违规内容
- ✅ 所有内容经过当地语言母语者审核

---

## 6. 公版书批量导入指南
### 6.1 支持的公版书列表（已翻译）
| 书名 | 英文 | 西班牙文 | 阿拉伯文 |
|------|------|----------|----------|
| 西游记 | ✅ 已完成 | ⏳ 翻译中 | ⏳ 计划中 |
| 道德经 | ✅ 已完成 | ✅ 已完成 | ⏳ 计划中 |
| 红楼梦 | ✅ 已完成 | ⏳ 翻译中 | ⏳ 计划中 |
| 三国演义 | ✅ 已完成 | ⏳ 翻译中 | ⏳ 计划中 |
| 水浒传 | ✅ 已完成 | ⏳ 翻译中 | ⏳ 计划中 |
| 论语 | ✅ 已完成 | ✅ 已完成 | ⏳ 计划中 |
| 孙子兵法 | ✅ 已完成 | ✅ 已完成 | ⏳ 计划中 |

### 6.2 批量导入步骤
1. 将翻译好的书籍按语言分类放入 `content/{lang}/` 目录
2. 每本书格式：`{book-slug}/chapter_{n}.md`（Markdown格式）
3. 编辑 `prisma/seed.ts` 添加书籍元数据（书名、作者、简介、封面）
4. 执行导入命令：`npx prisma db seed`
5. 访问网站即可看到导入的书籍

### 6.3 书籍元数据格式
```typescript
interface Book {
  slug: string;           // URL友好的标识，如 "journey-to-the-west"
  title: string;          // 书名
  author: string;         // 作者
  synopsis: string;       // 简介
  cover: string;          // 封面图片URL
  language: string;       // 语言：en/es/ar
  genres: string[];       // 分类：["Classics", "Fiction", "Chinese Literature"]
  totalChapters: number;  // 总章节数
}
```

---

## 7. 国际化配置
### 7.1 添加新语言
1. 在 `messages/` 目录下新建语言文件，如 `ar.json`（阿拉伯文）
2. 复制 `en.json` 的内容并翻译
3. 在 `next.config.js` 中添加新语言到 `locales` 数组
4. 重启服务即可生效

### 7.2 RTL（从右往左）语言支持
阿拉伯文、希伯来文等RTL语言自动适配：
- 配置 `i18n.ts` 中标记该语言为RTL
- Tailwind CSS自动调整布局方向
- 字体自动切换为适合当地的字体

---

## 8. 环境变量配置
创建 `.env` 文件：
```env
# 数据库
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key-here"

# 可选：OAuth登录配置
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"
GOOGLE_ID="your-google-id"
GOOGLE_SECRET="your-google-secret"

# 可选：分析统计
ANALYTICS_ID="your-google-analytics-id"
```

---

## 9. 数据库
### 9.1 核心数据模型
```
User          用户表
Book          书籍表（元数据）
Chapter       章节表（内容）
Author        作者表
Genre         分类表
Bookshelf     用户书架
ReadingProgress 阅读进度
Review        评论评分
```

### 9.2 常用数据库命令
```bash
npx prisma generate   # 生成Prisma客户端
npx prisma db push    # 同步表结构到数据库
npx prisma studio     # 打开数据库可视化管理
npx prisma db seed    # 导入公版书数据
npx prisma db reset   # 重置数据库
```

---

## 10. API 文档
### 10.1 书籍相关接口
```
GET /api/books             # 获取书籍列表，支持筛选、排序
GET /api/books?slug={slug} # 获取单个书籍详情
GET /api/books/trending    # 获取热门书籍
GET /api/books/recommended # 获取推荐书籍
```

### 10.2 阅读相关接口
```
GET /api/chapters?bookId={id} # 获取书籍章节列表
GET /api/progress?bookId={id} # 获取用户阅读进度
POST /api/progress            # 更新阅读进度
```

---

## 11. 部署指南
### 11.1 Vercel部署（推荐，全球CDN加速）
1. Push代码到GitHub仓库
2. 登录Vercel导入项目
3. 配置环境变量
4. 一键部署，自动全球CDN加速，访问速度快

### 11.2 Cloudflare Pages部署（免费，适合小流量）
1. 连接GitHub仓库
2. 配置构建命令：`npm run build`
3. 配置输出目录：`.next`
4. 自动部署，Cloudflare全球CDN加速

### 11.3 Docker部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npx prisma db push
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## 常用命令
```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查

# 数据导入
npx prisma db seed   # 导入公版书数据
npx prisma studio    # 数据库管理

# Git操作
git add .
git commit -m "feat: add new book"
git push
```

---

**版本：** v2.0.0（出海优化版）
**最后更新：** 2026-03-27
**维护者：** OpenClaw Team
