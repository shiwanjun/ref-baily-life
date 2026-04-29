# LT导航 / liantang.fun

一个部署在 Cloudflare Pages + Cloudflare D1 上的个人推荐导航站，用来集中整理返现购物、银行开户、信用卡申请、券商交易、支付汇款、eSIM、旅行理赔和数字服务等常用入口。

项目地址：[https://liantang.fun](https://liantang.fun)

## 项目特点

- 完全基于 Cloudflare Pages + Cloudflare D1，不需要 VPS、不需要服务器、不需要 Docker。
- 前端页面由 SvelteKit 构建，静态资源托管在 Cloudflare Pages。
- 数据存储在 Cloudflare D1，推荐、分类和用户表由 migrations 初始化。
- 支持分类浏览、关键词搜索、精选推荐、热门推荐滚动展示。
- 支持页面内可视化管理，新增、编辑、隐藏、删除推荐链接和分类。
- 支持自动获取链接元信息，方便快速补充标题、描述和图标。
- 支持公众号二维码、favicon、PWA 图标等品牌资源。
- 支持简单账号系统；CRM 同步为可选功能，未配置时自动跳过。

## 技术栈

- SvelteKit
- TypeScript
- Cloudflare Pages
- Cloudflare D1
- Wrangler

运行结构：

```text
用户浏览器
  -> Cloudflare Pages 静态资源
  -> Cloudflare Pages Functions
  -> Cloudflare D1 数据库
```

## 本地开发

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5175
```

打开：

```text
http://127.0.0.1:5175
```

## Cloudflare D1

创建数据库：

```bash
npx wrangler d1 create liantang-fun
```

把返回的 `database_id` 写入 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "liantang-fun"
database_id = "你的 database_id"
```

执行线上迁移：

```bash
npx wrangler d1 migrations apply liantang-fun --remote
```

迁移会初始化推荐、分类和用户表。

## Cloudflare Pages 环境变量

必须配置：

```env
ADMIN_PASSWORD=你的管理密码
SESSION_SECRET=随机长字符串
APP_URL=https://liantang.fun
```

可选 CRM：

```env
CRM_API_BASE=https://crm.example.com
CRM_API_KEY=your_crm_api_key
```

不要把 `.dev.vars`、密码、API Key、Cloudflare Token 提交到 GitHub。

## 检查和构建

```bash
npm run check
npm run build
```

## 部署到 Cloudflare Pages

手动部署：

```bash
npx wrangler pages deploy .svelte-kit/cloudflare --project-name liantang-fun --branch main
```

如果在 Cloudflare Pages 里连接 GitHub 仓库：

```text
Build command: npm run build
Build output directory: .svelte-kit/cloudflare
```

## 自定义域名

在 Cloudflare Pages 项目中进入：

```text
Custom domains -> Set up a custom domain -> liantang.fun
```

当前 Pages 项目已添加 `liantang.fun` 作为自定义域名。若 DNS 没有自动补齐，在 Cloudflare DNS 中添加：

```text
类型：CNAME
名称：@
目标：liantang-fun.pages.dev
代理：开启
```

## 管理内容

配置 `ADMIN_PASSWORD` 后，管理员直接访问 `/admin` 登录。普通访客首页不显示管理入口；管理员登录后回到首页，才会出现新增、编辑、隐藏、删除推荐内容和分类的管理控件。

推荐日常内容维护优先使用页面内管理功能；代码里的 `src/lib/sites.json` 和 `src/lib/categories.json` 主要作为 D1 不可用时的 fallback 数据。

## 品牌资源

- `static/favicon.svg`
- `static/favicon.ico`
- `static/favicon-32x32.png`
- `static/apple-touch-icon.png`
- `static/icon-192.png`
- `static/wechat-qrcode.jpg`

公众号二维码当前是占位图。后续拿到真实二维码后，直接替换 `static/wechat-qrcode.jpg` 即可。
