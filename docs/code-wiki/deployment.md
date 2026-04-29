# 部署指南

本文档介绍如何将 LT 导航站部署到 Cloudflare Pages 和 D1。

## 目录

- [前置准备](#前置准备)
- [本地开发](#本地开发)
- [创建 D1 数据库](#创建-d1-数据库)
- [配置 wrangler.toml](#配置-wranglertoml)
- [执行数据库迁移](#执行数据库迁移)
- [部署到 Cloudflare Pages](#部署到-cloudflare-pages)
- [环境变量配置](#环境变量配置)
- [自定义域名](#自定义域名)
- [验证部署](#验证部署)
- [常见问题](#常见问题)

---

## 前置准备

### 需要的账号

1. **Cloudflare 账号** - 注册地址：https://dash.cloudflare.com/sign-up
2. **GitHub 账号**（可选）- 用于自动部署

### 安装工具

#### 1. 安装 Node.js

```bash
# 使用 nvm（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# 或直接从官网下载
# https://nodejs.org/
```

#### 2. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

#### 3. 登录 Wrangler

```bash
wrangler login
```

这会打开浏览器，使用 Cloudflare 账号授权。

---

## 本地开发

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd ref-baily-life
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev -- --host 127.0.0.1 --port 5175
```

然后访问：http://127.0.0.1:5175

### 4. 本地开发说明

本地开发时：
- 默认使用静态后备数据（`src/lib/sites.json`）
- 可以通过环境变量配置本地 D1（可选）
- 管理员密码默认为 `local-dev-secret`（仅开发环境）

---

## 创建 D1 数据库

### 1. 创建数据库

```bash
wrangler d1 create liantang-fun
```

执行后会输出类似以下信息：

```
✅ Successfully created DB 'liantang-fun'

Add the following to your wrangler.toml:

[[d1_databases]]
binding = "DB"
database_name = "liantang-fun"
database_id = "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**保存好 `database_id`**，后面需要用到。

### 2. 查看数据库列表

```bash
wrangler d1 list
```

---

## 配置 wrangler.toml

编辑项目根目录的 `wrangler.toml`，添加 D1 配置：

```toml
name = "liantang-fun"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "liantang-fun"
database_id = "你的 database_id"  # 替换为上面创建的 ID
```

---

## 执行数据库迁移

### 1. 查看迁移状态

```bash
wrangler d1 migrations list liantang-fun --remote
```

### 2. 执行迁移

```bash
wrangler d1 migrations apply liantang-fun --remote
```

这会按顺序执行 `migrations/` 目录下的所有 SQL 文件：
- `0001_schema.sql` - 创建表结构
- `0002_seed.sql` - 填充初始推荐数据
- `0003_categories.sql` - 创建分类表
- `0004_ref_users.sql` - 创建用户表
- `0005_hide_xingye_group_card.sql` - 更新数据

### 3. 验证数据

```bash
# 进入 D1 控制台
wrangler d1 execute liantang-fun --remote --command "SELECT * FROM sites LIMIT 5"
```

---

## 部署到 Cloudflare Pages

有两种部署方式：

### 方式一：手动部署（推荐第一次使用）

#### 1. 构建项目

```bash
npm run build
```

构建产物会生成在 `.svelte-kit/cloudflare/` 目录。

#### 2. 创建 Pages 项目

```bash
wrangler pages project create liantang-fun
```

#### 3. 部署

```bash
wrangler pages deploy .svelte-kit/cloudflare --project-name liantang-fun --branch main
```

### 方式二：GitHub 自动部署（推荐长期使用）

#### 1. 推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

#### 2. 在 Cloudflare Dashboard 中配置

1. 访问：https://dash.cloudflare.com/?to=/:account/pages
2. 点击「Create a project」→「Connect to Git」
3. 选择你的 GitHub 仓库
4. 配置构建设置：

| 设置项 | 值 |
|--------|-----|
| Project name | liantang-fun |
| Production branch | main |
| Framework preset | SvelteKit |
| Build command | npm run build |
| Build output directory | .svelte-kit/cloudflare |

5. 点击「Save and Deploy」

---

## 环境变量配置

部署完成后，需要在 Cloudflare Pages 中配置环境变量。

### 1. 进入环境变量设置

在 Cloudflare Dashboard 中：
1. 进入 Pages 项目 → `liantang-fun`
2. 点击「Settings」→「Environment variables」

### 2. 添加环境变量

#### 必须配置

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `ADMIN_PASSWORD` | 管理员密码（强密码） | `myStrongPassword123!` |
| `SESSION_SECRET` | 会话密钥（随机字符串） | `a1b2c3d4e5f6g7h8i9j0...` |
| `APP_URL` | 网站 URL | `https://liantang.fun` |

#### 可选配置（CRM 集成）

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `CRM_API_BASE` | CRM API 地址 | `https://crm.example.com` |
| `CRM_API_KEY` | CRM API 密钥 | `sk_xxxxxx` |

### 3. 生成 SESSION_SECRET

使用以下命令生成随机字符串：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. 重新部署

配置环境变量后，需要重新部署才能生效：

```bash
# 方式一：手动重新部署
wrangler pages deploy .svelte-kit/cloudflare --project-name liantang-fun --branch main

# 方式二：GitHub 触发
git commit --allow-empty -m "Trigger deploy"
git push
```

---

## 自定义域名

### 1. 添加自定义域名

在 Cloudflare Dashboard 中：
1. Pages 项目 → `liantang-fun` →「Custom domains」
2. 点击「Set up a custom domain」
3. 输入你的域名（如 `liantang.fun`）
4. 点击「Continue」

### 2. 配置 DNS

Cloudflare 会自动配置 DNS，或手动添加：

| 类型 | 名称 | 内容 | 代理状态 |
|------|------|------|---------|
| CNAME | @ | liantang-fun.pages.dev | Proxied (橙色云) |

### 3. 验证域名

等待 DNS 生效（通常几分钟），然后访问你的域名验证。

---

## 验证部署

### 1. 访问网站

打开浏览器访问：
- Pages 默认域名：`https://liantang-fun.pages.dev`
- 自定义域名：`https://liantang.fun`

### 2. 测试管理功能

1. 访问 `/admin`
2. 输入你设置的 `ADMIN_PASSWORD`
3. 登录后，回到首页应该能看到编辑按钮
4. 尝试添加一个测试推荐

### 3. 测试用户功能

1. 点击「登录/注册」
2. 注册一个测试账号
3. 登录成功

---

## 日常维护

### 更新内容

推荐直接使用**页面内管理功能**：
1. 管理员登录
2. 在首页点击「编辑」进入编辑模式
3. 直接在页面上添加/编辑/删除推荐

### 部署代码更新

```bash
# 提交代码
git add .
git commit -m "Update something"
git push

# 等待自动部署，或手动部署
npm run build
wrangler pages deploy .svelte-kit/cloudflare --project-name liantang-fun --branch main
```

### 数据库备份

```bash
# 导出数据库
wrangler d1 export liantang-fun --remote --output=backup-$(date +%Y%m%d).sql
```

### 查看部署日志

在 Cloudflare Dashboard 中：
- Pages 项目 →「Functions」→「Real-time logs」

---

## 常见问题

### Q: 部署后页面显示空白或错误？

A: 检查以下几点：
1. 浏览器控制台是否有错误
2. 环境变量是否正确配置
3. D1 数据库是否正确绑定
4. 迁移是否成功执行

### Q: 忘记管理员密码怎么办？

A: 在 Cloudflare Pages 中更新 `ADMIN_PASSWORD` 环境变量，然后重新部署。

### Q: 如何切换回静态后备数据？

A: 在 `src/lib/server/db.ts` 中修改逻辑，或者临时解除 D1 绑定。

### Q: 如何回滚迁移？

A: D1 迁移没有自动回滚，需要手动编写反向 SQL 执行：

```bash
wrangler d1 execute liantang-fun --remote --file=rollback.sql
```

### Q: 部署花费多少钱？

A: Cloudflare Pages 和 D1 都有 generous 的免费额度：
- Pages：100,000 请求/月 免费
- D1：500 万次读、10 万次写/月 免费

个人使用通常完全免费。

### Q: 如何设置本地开发使用真实 D1？

A: 创建 `.dev.vars` 文件：

```env
ADMIN_PASSWORD=local-dev-password
SESSION_SECRET=your-local-secret
```

然后使用本地 D1：

```bash
wrangler d1 execute liantang-fun --local --file=migrations/0001_schema.sql
# ... 其他迁移
npm run dev
```

---

## 高级配置

### 启用 Analytics

在 Cloudflare Dashboard 中：
- Pages 项目 →「Settings」→「Analytics」→ 启用

### 配置 Web Analytics

可选添加 Cloudflare Web Analytics 获取更详细的访问数据。

### 配置 Access（可选）

如果需要限制访问，可以配置 Cloudflare Access。

---

## 部署清单

部署前确认：

- [ ] Cloudflare 账号已注册
- [ ] Wrangler CLI 已安装并登录
- [ ] D1 数据库已创建
- [ ] `wrangler.toml` 已配置正确的 database_id
- [ ] 数据库迁移已执行
- [ ] Pages 项目已创建
- [ ] 环境变量已配置（ADMIN_PASSWORD, SESSION_SECRET, APP_URL）
- [ ] 构建成功
- [ ] 部署成功
- [ ] 自定义域名已配置（可选）
- [ ] 管理功能已测试
- [ ] 用户功能已测试
