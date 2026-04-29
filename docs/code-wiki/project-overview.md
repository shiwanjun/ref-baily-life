# 项目概述

## 简介

LT 导航站（liantang.fun）是一个基于 Cloudflare Pages 和 Cloudflare D1 构建的个人推荐导航站，专门用于整理和展示返现购物、银行开户、信用卡申请、券商交易、支付汇款、eSIM、旅行理赔和数字服务等常用入口。

## 核心功能

### 用户功能
- **分类浏览**：按不同类别（返现购物、银行开户、信用卡、券商、eSIM 等）浏览推荐链接
- **关键词搜索**：在所有推荐链接中进行全文搜索
- **精选推荐**：首页展示精选推荐的滚动轮播
- **链接提醒**：点击链接前展示温馨提示
- **深色模式**：支持浅色/深色主题切换
- **用户注册/登录**：支持用户账号系统
- **VIP 功能**：开通 VIP 解锁更多内容

### 管理功能
- **页面内管理**：管理员登录后可在首页直接进行内容管理
- **推荐管理**：添加、编辑、删除、隐藏推荐链接
- **分类管理**：创建和维护推荐分类
- **元数据自动获取**：添加链接时自动获取网页标题、描述和图标
- **排序设置**：自定义推荐链接的展示顺序

## 技术栈

### 前端框架
- **SvelteKit** - 现代化的全栈框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具

### 后端与部署
- **Cloudflare Pages** - 边缘计算平台，用于托管静态资源和 Serverless Functions
- **Cloudflare D1** - Cloudflare 的 SQLite 数据库
- **Wrangler** - Cloudflare Workers CLI 工具

### 主要依赖
```json
{
  "@cloudflare/workers-types": "^4.20260423.1",
  "@sveltejs/adapter-cloudflare": "^7.2.8",
  "@sveltejs/kit": "^2.57.0",
  "@sveltejs/vite-plugin-svelte": "^7.0.0",
  "svelte": "^5.55.2",
  "svelte-check": "^4.4.6",
  "typescript": "^6.0.2",
  "vite": "^8.0.7"
}
```

## 项目特点

1. **完全无服务器**：不需要传统的服务器或 Docker，所有代码和数据都运行在 Cloudflare 边缘网络上
2. **低成本**：Cloudflare Pages 和 D1 提供免费额度，适合个人使用
3. **高性能**：利用 Cloudflare 的全球 CDN，提供极快的响应速度
4. **数据持久化**：使用 D1 数据库，数据安全存储
5. **易于维护**：支持页面内可视化管理，减少代码修改频率
6. **零配置部署**：连接 GitHub 后自动部署

## 运行架构

```
用户浏览器
    ↓
Cloudflare Pages 静态资源（HTML/CSS/JS）
    ↓
Cloudflare Pages Functions（Serverless）
    ↓
Cloudflare D1 数据库
    ↓
（可选）CRM 同步
```

## 项目结构

```
ref-baily-life/
├── migrations/           # 数据库迁移文件
│   ├── 0001_schema.sql
│   ├── 0002_seed.sql
│   ├── 0003_categories.sql
│   ├── 0004_ref_users.sql
│   └── 0005_hide_xingye_group_card.sql
├── src/
│   ├── lib/
│   │   ├── server/       # 服务端代码
│   │   │   ├── auth.ts
│   │   │   ├── crm.ts
│   │   │   ├── db.ts
│   │   │   └── user-auth.ts
│   │   ├── categories.json
│   │   ├── ref-data.ts
│   │   ├── settings.json
│   │   └── sites.json
│   ├── routes/           # 路由
│   │   ├── admin/
│   │   │   ├── +page.server.ts
│   │   │   └── +page.svelte
│   │   ├── api/metadata/
│   │   │   └── +server.ts
│   │   ├── +layout.svelte
│   │   ├── +page.server.ts
│   │   └── +page.svelte
│   ├── app.css
│   ├── app.d.ts
│   └── app.html
├── static/               # 静态资源
├── wrangler.toml         # Cloudflare 配置
├── svelte.config.js      # SvelteKit 配置
├── vite.config.ts
└── package.json
```

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev -- --host 127.0.0.1 --port 5175
```

然后访问 [http://127.0.0.1:5175](http://127.0.0.1:5175)

### 环境变量

必须配置的环境变量：
```env
ADMIN_PASSWORD=你的管理密码
SESSION_SECRET=随机生成的密钥字符串
APP_URL=https://liantang.fun
```

可选配置（CRM 集成）：
```env
CRM_API_BASE=https://crm.example.com
CRM_API_KEY=你的 CRM API Key
```

### 数据库设置

创建 D1 数据库：
```bash
npx wrangler d1 create liantang-fun
```

将返回的 `database_id` 添加到 `wrangler.toml` 中，然后执行迁移：
```bash
npx wrangler d1 migrations apply liantang-fun --remote
```

更多详细信息请参考[部署指南](deployment.md)。
