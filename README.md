# NovelFlow - 小说阅读平台开发手册

## 目录

1. [项目介绍](#1-项目介绍)
2. [技术栈](#2-技术栈)
3. [功能列表](#3-功能列表)
4. [快速开始](#4-快速开始)
5. [项目结构](#5-项目结构)
6. [环境变量配置](#6-环境变量配置)
7. [数据库](#7-数据库)
8. [API 文档](#8-api-文档)
9. [主要功能实现](#9-主要功能实现)
10. [部署指南](#10-部署指南)

---

## 1. 项目介绍

NovelFlow 是一款面向读者的中文小说阅读平台，提供小说浏览、阅读、评论、评分等功能，支持多种阅读设置和 TTS 听书。

**在线演示：** https://github.com/Cyril0404/novel-platform

## 2. 技术栈

| 类别 | 技术 |
|-----|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 数据库 | SQLite (Prisma ORM) |
| 认证 | NextAuth.js |
| UI 组件 | Radix UI + 自定义组件 |
| 状态管理 | React Context + Hooks |

## 3. 功能列表

### 3.1 核心功能
- [x] 小说列表浏览（分类筛选、排序）
- [x] 小说详情页
- [x] 章节阅读器
- [x] 阅读进度跟踪
- [x] 书架管理

### 3.2 阅读体验
- [x] 三种主题模式（Light / Dark / Sepia）
- [x] 字体大小调节（14-28px）
- [x] 行间距调节（1.2-2.4倍）
- [x] 字体选择（Sans / Serif / Mono）
- [x] TTS 听书（支持 0.5x - 2x 语速）
- [x] 阅读进度条
- [x] 上次阅读位置记忆
- [x] 章节快速跳转

### 3.3 社区功能
- [x] 用户评分（1-5星）
- [x] 评论系统
- [x] 阅读推荐（基于题材标签）

### 3.4 用户功能
- [x] 邮箱登录/注册
- [x] 书架收藏
- [x] 阅读历史

## 4. 快速开始

### 4.1 环境要求
- Node.js 18+
- npm / yarn / pnpm
- Git

### 4.2 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/Cyril0404/novel-platform.git
cd novel-platform

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写必要的环境变量

# 4. 初始化数据库
npx prisma generate
npx prisma db push

# 5. 填充种子数据（可选）
npx prisma db seed

# 6. 启动开发服务器
npm run dev
```

### 4.3 访问应用
- 开发服务器：http://localhost:3000
- 数据库可视化：http://localhost:5555（如需 Prisma Studio）

## 5. 项目结构

```
novel-platform/
├── app/                      # Next.js App Router
│   ├── api/                  # API 路由
│   │   ├── auth/             # 认证 API
│   │   ├── bookmarks/         # 书签 API
│   │   ├── bookshelf/         # 书架 API
│   │   ├── history/           # 阅读历史 API
│   │   ├── novels/            # 小说 API
│   │   │   ├── recommendations/  # 推荐 API
│   │   │   └── trending/      # 热门 API
│   │   ├── progress/          # 阅读进度 API
│   │   ├── reviews/           # 评论 API
│   │   └── search/            # 搜索 API
│   ├── auth/                  # 认证页面
│   │   └── signin/
│   ├── author/                # 作者页面
│   │   └── [slug]/
│   ├── bookshelf/             # 书架页面
│   ├── history/               # 历史页面
│   ├── novel/                 # 小说页面
│   │   └── [slug]/
│   │       └── chapter/
│   │           └── [number]/ # 章节阅读页
│   ├── novels/                # 小说列表页
│   ├── search/                # 搜索页面
│   ├── layout.tsx             # 根布局
│   ├── page.tsx              # 首页
│   └── globals.css            # 全局样式
├── components/                # React 组件
│   ├── ui/                   # UI 基础组件
│   │   └── skeleton.tsx      # 加载骨架屏
│   ├── header.tsx            # 顶部导航
│   ├── theme-provider.tsx    # 主题提供者
│   ├── providers.tsx         # 全局提供者
│   ├── reading-settings.tsx  # 阅读设置
│   ├── reviews.tsx           # 评论组件
│   └── recommendations.tsx   # 推荐组件
├── lib/                      # 工具库
│   ├── auth.ts               # NextAuth 配置
│   ├── auth-options.ts       # 认证选项
│   └── prisma.ts             # Prisma 客户端
├── prisma/                   # 数据库
│   ├── schema.prisma         # 数据模型
│   ├── dev.db                # SQLite 数据库
│   └── seed.ts               # 种子数据
├── public/                   # 静态资源
├── .env                      # 环境变量
├── .env.example              # 环境变量示例
├── next.config.js            # Next.js 配置
├── tailwind.config.ts        # Tailwind 配置
└── tsconfig.json             # TypeScript 配置
```

## 6. 环境变量配置

创建 `.env` 文件：

```env
# 数据库
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl"

# OAuth（可选，如使用 GitHub 登录）
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"
```

### 6.1 获取 GitHub OAuth 凭证
1. 打开 https://github.com/settings/developers
2. 点击 **New OAuth App**
3. 填写：
   - Application name: NovelFlow Dev
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
4. 注册后获取 Client ID 和 Client Secret

## 7. 数据库

### 7.1 数据模型

```
User
├── id, email, name, avatar, createdAt
├── bookshelf: Bookshelf[]    # 书架
├── readingProgress: ReadingProgress[]  # 阅读进度
├── bookmarks: Bookmark[]     # 书签
└── reviews: Review[]         # 评论

Novel
├── id, slug, title, synopsis, cover
├── status (ONGOING/COMPLETED/HIATUS/DROPPED)
├── rating, totalRatings, views
├── author: Author
├── chapters: Chapter[]
├── genres: Genre[]
├── tags: Tag[]
├── bookshelf: Bookshelf[]
└── reviews: Review[]

Author
├── id, name, slug, bio, avatar
└── novels: Novel[]

Chapter
├── id, number, title, content, wordCount
├── novel: Novel
├── readingProgress: ReadingProgress[]
└── bookmarks: Bookmark[]

Genre / Tag
├── id, name, slug
└── novels: Novel[]

Bookshelf (用户书架)
├── id, status (READING/COMPLETED/PLAN_TO_READ/ON_HOLD/DROPPED)
├── user: User
└── novel: Novel

ReadingProgress (阅读进度)
├── id, chapterNumber, percentage
├── user: User
└── chapter: Chapter

Bookmark (书签)
├── id, position, note, createdAt
├── user: User
└── chapter: Chapter

Review (评论)
├── id, rating (1-5), content, createdAt
├── user: User
└── novel: Novel
```

### 7.2 数据库操作命令

```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送 schema 到数据库
npx prisma db push

# 打开 Prisma Studio（数据库可视化）
npx prisma studio

# 重置数据库
npx prisma db push --force-reset

# 填充种子数据
npx prisma db seed
```

## 8. API 文档

### 8.1 小说 API

**获取小说列表**
```
GET /api/novels
Query: genre, tags, status, sort (rating/views/newest/updated)
```

**获取单个小说**
```
GET /api/novels?slug={slug}
```

**获取推荐小说**
```
GET /api/novels/recommendations?novelId={id}&limit={4}
```

**获取热门小说**
```
GET /api/novels/trending
```

### 8.2 阅读进度 API

**获取进度**
```
GET /api/progress?chapterId={id}
GET /api/progress  # 获取所有进度
```

**更新进度**
```
POST /api/progress
Body: { chapterId, chapterNumber, percentage }
```

### 8.3 书架 API

**获取书架**
```
GET /api/bookshelf
```

**添加到书架**
```
POST /api/bookshelf
Body: { novelId, status }
```

**从书架移除**
```
DELETE /api/bookshelf?novelId={id}
```

### 8.4 评论 API

**获取评论**
```
GET /api/reviews?novelId={id}
```

**提交评论**
```
POST /api/reviews
Body: { novelId, rating, content? }
```

## 9. 主要功能实现

### 9.1 阅读设置持久化

阅读设置（主题、字体、字号等）使用 Context + localStorage 实现持久化：

```tsx
// components/reading-settings.tsx
const STORAGE_KEY = "novel-platform-reading-settings";

interface ReadingSettings {
  theme: "light" | "dark" | "sepia";
  fontSize: number;
  lineHeight: number;
  fontFamily: "sans" | "serif" | "mono";
}
```

### 9.2 TTS 听书

使用 Web Speech API 实现：

```tsx
const speakParagraph = useCallback((paragraphs: string[], index: number) => {
  const utterance = new SpeechSynthesisUtterance(cleanText(paragraphs[index]));
  utterance.rate = speechRate; // 0.5 - 2.0
  utterance.lang = "en-US";

  utterance.onend = () => {
    speakParagraph(paragraphs, index + 1); // 自动播放下一段
  };

  speech.speak(utterance);
}, [speechRate]);
```

### 9.3 上次阅读位置

通过 ReadingProgress 表记录用户阅读位置，小说详情页获取最新进度：

```tsx
const novelProgress = allProgress
  .filter((p) => p.chapter?.novel?.slug === params.slug)
  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
```

### 9.4 阅读推荐

基于相同题材（Genre）和标签（Tag）计算相似度：

```sql
SELECT * FROM Novel
WHERE id != @currentId
AND (
  id IN (SELECT novelId FROM NovelGenres WHERE genreId IN (@currentGenreIds))
  OR id IN (SELECT novelId FROM NovelTags WHERE tagId IN (@currentTagIds))
)
ORDER BY rating DESC, views DESC
LIMIT @limit
```

## 10. 部署指南

### 10.1 Vercel 部署（推荐）

1. Fork 或推送代码到 GitHub
2. 访问 https://vercel.com
3. Import 项目
4. 配置环境变量
5. Deploy

### 10.2 Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npx prisma db push
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### 10.3 传统服务器部署

```bash
# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2

# 克隆并部署
git clone https://github.com/Cyril0404/novel-platform.git
cd novel-platform
npm install
npm run build

# 使用 PM2 启动
pm2 start npm --name "novel-platform" -- start
pm2 save
pm2 startup
```

## 附录：常用命令

```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查

# 数据库
npx prisma studio    # 打开数据库可视化工具
npx prisma db push   # 同步 schema 到数据库
npx prisma generate  # 生成 Prisma 客户端
npx prisma db seed   # 填充种子数据

# Git
git status           # 查看状态
git add .            # 暂存所有更改
git commit -m ""     # 提交
git push             # 推送到远程
```

---

**版本：** v1.0.0
**最后更新：** 2026-03-27
**作者：** NovelFlow Team
