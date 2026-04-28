# 贝利推荐 / ref.baily.life

一个部署在 Cloudflare 上的个人推荐导航站，用来集中整理返现购物、银行开户、信用卡申请、券商交易、支付汇款、eSIM、旅行理赔和数字服务等常用入口。

项目地址：[https://ref.baily.life](https://ref.baily.life)

开源地址：[https://github.com/bailylu/ref-baily-life](https://github.com/bailylu/ref-baily-life)

## 项目特点

- 完全基于 Cloudflare Pages + Cloudflare D1，不需要 VPS、不需要服务器、不需要 Docker、不需要单独购买数据库。
- 前端页面由 SvelteKit 构建，静态资源直接托管在 Cloudflare Pages。
- 数据存储在 Cloudflare D1，属于 Cloudflare 的 Serverless SQLite 数据库。
- 支持分类浏览、关键词搜索、精选推荐、热门推荐滚动展示。
- 支持点击前备注提醒，有注意事项时先弹窗，无备注时直接跳转。
- 支持页面内可视化管理，不需要单独后台系统。
- 支持新增、编辑、隐藏、删除推荐链接和分类。
- 支持自动获取链接元信息，方便快速补充网站标题和图标。
- 支持公众号二维码、网站说明链接、favicon、PWA 图标等基础品牌配置。
- 支持简单账号系统和 CRM 同步，CRM 功能是可选项。
- 没有传统后端服务，部署和维护成本很低。

## 技术栈

- SvelteKit
- TypeScript
- Cloudflare Pages
- Cloudflare D1
- Wrangler

项目不是传统意义上的“前端 + 后端服务器”。它的结构更接近：

```text
用户浏览器
  -> Cloudflare Pages 静态资源
  -> Cloudflare Pages Functions
  -> Cloudflare D1 数据库
```

也就是说，你不需要准备任何 VPS。Cloudflare 会同时负责静态网页、接口运行环境和数据库。

## 适合什么场景

这个项目适合用来做：

- 个人推荐站
- 返利导航站
- 工具收藏导航
- 联盟链接导航
- 信用卡/银行/券商开户链接整理
- 小团队内部资源导航
- 任何需要“轻量内容管理 + 快速部署”的导航页

## 功能说明

### 推荐链接展示

首页会展示所有未隐藏的推荐项目。每个项目可以配置：

- 名称
- 链接
- Logo
- 分类
- 标签
- 备注说明
- 排序
- 是否精选
- 是否隐藏

### 分类和搜索

用户可以通过左侧分类快速筛选，也可以使用关键词搜索。搜索会匹配名称、描述、分类和标签。

### 精选推荐

被标记为“精选”的项目会自动排在前面，并显示五角星标记。顶部热门推荐区域也会优先展示精选内容。

### 备注提醒

如果某个链接配置了备注，用户点击卡片时会先看到提醒弹窗。例如：

- 需要特定地区网络
- 需要输入优惠码
- 需要先完成某个任务
- 奖励条件说明

如果备注为空，则直接跳转到目标网站。

### 页面内管理

管理员登录后可以直接在页面上管理内容，不需要进入传统后台。支持：

- 新增推荐
- 编辑推荐
- 删除推荐
- 隐藏推荐
- 标记精选
- 多选标签
- 新增分类
- 编辑分类

隐藏项目在普通用户页面不可见，但管理员进入管理模式后仍然可以看到和编辑。

### 账号和 CRM 同步

项目内置了一个轻量账号系统，可用于注册、登录、保存联系方式、开通 VIP。

如果配置了 CRM API Key，注册、登录、更新联系方式、开通 VIP 时会同步到 CRM。同步失败不会阻塞主流程。

不需要 CRM 的话，可以不配置相关环境变量。

## 部署方式

### 1. 准备 Cloudflare

你需要一个 Cloudflare 账号，并开通：

- Cloudflare Pages
- Cloudflare D1

不需要购买服务器。

### 2. Fork 或克隆项目

```bash
git clone https://github.com/bailylu/ref-baily-life.git
cd ref-baily-life
npm install
```

### 3. 创建 D1 数据库

```bash
npx wrangler d1 create ref-baily-life
```

命令会返回一个 `database_id`，把它填入 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "ref-baily-life"
database_id = "你的 database_id"
```

如果你想换项目名，也可以把 `name` 和 `database_name` 改成自己的名字。

### 4. 初始化数据库

本地开发数据库：

```bash
npx wrangler d1 migrations apply ref-baily-life --local
```

Cloudflare 线上数据库：

```bash
npx wrangler d1 migrations apply ref-baily-life --remote
```

迁移文件会创建推荐表、分类表、用户表，并导入一份初始示例数据。

### 5. 配置环境变量

本地开发可以创建 `.dev.vars`：

```env
ADMIN_PASSWORD=your_admin_password
SESSION_SECRET=your_random_session_secret
APP_URL=http://127.0.0.1:5175
```

Cloudflare Pages 线上环境变量建议配置：

```env
ADMIN_PASSWORD=your_admin_password
SESSION_SECRET=your_random_session_secret
APP_URL=https://your-domain.com
```

CRM 是可选功能。如果你不需要会员同步，可以不配置。

如果需要 CRM，同步相关变量如下：

```env
CRM_API_BASE=https://crm.example.com
CRM_API_KEY=your_crm_api_key
```

注意：不要把 `.dev.vars`、密码、API Key 提交到 GitHub。

### 6. 本地运行

```bash
npm run dev -- --host 127.0.0.1 --port 5175
```

打开：

```text
http://127.0.0.1:5175
```

### 7. 检查和构建

```bash
npm run check
npm run build
```

### 8. 部署到 Cloudflare Pages

手动部署：

```bash
npx wrangler pages deploy .svelte-kit/cloudflare --project-name ref-baily-life --branch main
```

如果你在 Cloudflare Pages 里连接 GitHub 仓库，可以使用：

```text
Build command: npm run build
Build output directory: .svelte-kit/cloudflare
```

## 常用命令

```bash
# 本地开发
npm run dev -- --host 127.0.0.1 --port 5175

# Svelte/TypeScript 检查
npm run check

# 生产构建
npm run build

# 本地 D1 迁移
npx wrangler d1 migrations apply ref-baily-life --local

# 线上 D1 迁移
npx wrangler d1 migrations apply ref-baily-life --remote

# 手动部署 Pages
npx wrangler pages deploy .svelte-kit/cloudflare --project-name ref-baily-life --branch main
```

## 如何改成你自己的推荐站

你通常需要改这些内容：

- `wrangler.toml`：项目名、D1 数据库 ID、站点 URL。
- `src/lib/sites.json`：备用推荐数据。
- `src/lib/categories.json`：默认分类。
- `static/favicon.*`：网站图标。
- `static/wechat-qrcode.jpg`：公众号二维码。
- `src/routes/+page.svelte`：页面文案、Logo、视觉样式。

如果已经启用了 D1，页面内容主要以 D1 数据为准。你可以直接登录管理模式，在页面里可视化新增和编辑推荐。

## 给 Agent AI 的一键部署提示词

如果你不想自己手动改，可以把下面这段直接发给 Codex、Claude Code、Cursor Agent 或其他能操作代码和终端的 AI Agent：

```text
请帮我基于这个开源项目部署一个自己的推荐导航站：
https://github.com/bailylu/ref-baily-life

目标：
1. 复制/克隆项目并安装依赖。
2. 把项目改成我的品牌名称、域名、Logo、favicon 和公众号二维码。
3. 使用 Cloudflare Pages + Cloudflare D1 部署，不要使用 VPS、Docker 或传统服务器。
4. 创建 Cloudflare D1 数据库，并把 database_id 写入 wrangler.toml。
5. 执行 D1 migrations，初始化推荐、分类和用户表。
6. 配置 Cloudflare Pages 环境变量：
   - ADMIN_PASSWORD
   - SESSION_SECRET
   - APP_URL
   如果我提供 CRM_API_BASE 和 CRM_API_KEY，也一起配置；没有提供则跳过 CRM。
7. 本地运行 npm run check 和 npm run build，确保没有 error / warning。
8. 部署到 Cloudflare Pages。
9. 部署完成后告诉我：
   - Cloudflare Pages 预览地址
   - 自定义域名绑定方式
   - 管理入口和后续修改内容的方法

注意：
- 不要把任何密码、API Key、token 写进 GitHub。
- 不要创建 VPS。
- 不要引入额外后端服务。
- 数据库使用 Cloudflare D1。
- 网站内容管理尽量通过页面内管理功能完成。
```

## 数据说明

项目有两套数据来源：

1. Cloudflare D1：正式运行时的主要数据源。
2. `src/lib/sites.json` / `src/lib/categories.json`：没有 D1 或 D1 查询失败时的备用展示数据。

如果你要正式运营，建议以 D1 为准。更新内容时通过管理模式编辑，再根据需要把 D1 数据导出回 JSON，保持仓库里的 fallback 数据同步。

## 管理模式

配置 `ADMIN_PASSWORD` 后，页面右上角可以进入管理模式。进入后可以直接新增、编辑、隐藏、删除推荐内容。

管理模式不是独立后台，而是嵌在前台页面里，适合轻量维护。

## 安全建议

- `ADMIN_PASSWORD` 请设置为高强度密码。
- `SESSION_SECRET` 请使用随机字符串。
- 不要提交 `.dev.vars`。
- 不要把 Cloudflare API Token、GitHub Token、CRM API Key 写进代码。
- 如果多人维护，建议使用 Cloudflare 的环境变量和 GitHub 私有仓库。

## FAQ

### 这个项目需要服务器吗？

不需要。它完全运行在 Cloudflare 上，不需要 VPS、云服务器、Docker、宝塔、Nginx 或 PM2。

### 它是纯静态网站吗？

页面静态资源由 Cloudflare Pages 托管，但管理、登录、保存数据等能力依赖 Cloudflare Pages Functions 和 D1。你可以理解为“静态网站体验 + Serverless 数据能力”。

### 不配置 D1 能不能打开？

可以打开，并使用 JSON fallback 数据展示基础页面。但新增、编辑、登录、用户和 CRM 同步等功能需要 D1。

### 能不能换成自己的分类和链接？

可以。最简单的方式是部署后进入管理模式，在页面里直接新增和编辑。也可以修改 `src/lib/sites.json` 和迁移数据。

### 能不能绑定自己的域名？

可以。在 Cloudflare Pages 项目里添加 Custom domain，例如 `ref.example.com`，按提示配置 DNS 即可。

### 能不能不开源？

可以。你可以 fork 成私有仓库，或者只在 Cloudflare Pages 手动部署。

## 开源

项目仓库：

[https://github.com/bailylu/ref-baily-life](https://github.com/bailylu/ref-baily-life)

欢迎参考、Fork、二次开发或改成自己的推荐导航站。
