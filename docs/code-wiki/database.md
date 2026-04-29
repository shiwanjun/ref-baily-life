# 数据库结构

## 数据库概述

LT 导航站使用 **Cloudflare D1** 作为数据存储，这是一个基于 SQLite 的边缘数据库。所有表结构通过迁移脚本管理。

## 迁移文件

项目包含以下数据库迁移文件：

| 迁移文件 | 描述 |
|---------|------|
| `0001_schema.sql` | 初始表结构（sites 表） |
| `0002_seed.sql` | 初始数据填充 |
| `0003_categories.sql` | 添加分类表 |
| `0004_ref_users.sql` | 添加用户表 |
| `0005_hide_xingye_group_card.sql` | 更新特定推荐隐藏状态 |

## 表结构

### 1. sites 表 - 推荐链接

存储所有推荐链接的详细信息。

```sql
CREATE TABLE IF NOT EXISTS sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  logo TEXT DEFAULT '',
  catelog TEXT DEFAULT '',
  description TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 100,
  hidden INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### 字段说明

| 字段 | 类型 | 说明 |
|-----|------|------|
| `id` | INTEGER | 主键，自增 |
| `name` | TEXT | 链接名称（显示标题） |
| `url` | TEXT | 链接地址 |
| `logo` | TEXT | Logo 图片（URL 或 data URI） |
| `catelog` | TEXT | 子分类（备用字段） |
| `description` | TEXT | 描述/备注 |
| `sort_order` | INTEGER | 排序权重（数字越小越靠前） |
| `hidden` | INTEGER | 是否隐藏（0=显示，1=隐藏） |
| `category` | TEXT | 所属分类名称 |
| `tags` | TEXT | 标签（JSON 数组字符串） |
| `featured` | INTEGER | 是否精选（0=否，1=是） |
| `created_at` | TEXT | 创建时间 |
| `updated_at` | TEXT | 更新时间 |

#### 索引

```sql
CREATE INDEX IF NOT EXISTS idx_sites_public ON sites(hidden, category, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_sites_featured ON sites(featured, sort_order, id);
```

- `idx_sites_public`：优化公开列表查询（按分类+排序）
- `idx_sites_featured`：优化精选推荐查询

### 2. categories 表 - 分类

存储推荐分类信息。

```sql
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### 字段说明

| 字段 | 类型 | 说明 |
|-----|------|------|
| `id` | INTEGER | 主键，自增 |
| `name` | TEXT | 分类名称（唯一） |
| `description` | TEXT | 分类描述 |
| `sort_order` | INTEGER | 排序权重 |
| `created_at` | TEXT | 创建时间 |
| `updated_at` | TEXT | 更新时间 |

### 3. ref_users 表 - 用户

存储注册用户信息。

```sql
CREATE TABLE IF NOT EXISTS ref_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT DEFAULT '',
  wechat TEXT DEFAULT '',
  telegram TEXT DEFAULT '',
  vip_status TEXT DEFAULT 'inactive',
  vip_started_at TEXT DEFAULT '',
  crm_uid TEXT DEFAULT '',
  last_login_at TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### 字段说明

| 字段 | 类型 | 说明 |
|-----|------|------|
| `id` | INTEGER | 主键，自增 |
| `email` | TEXT | 邮箱（唯一，用于登录） |
| `password_hash` | TEXT | 密码哈希（SHA-256） |
| `display_name` | TEXT | 显示名称 |
| `wechat` | TEXT | 微信账号 |
| `telegram` | TEXT | Telegram 账号 |
| `vip_status` | TEXT | VIP 状态（'inactive'/'active'） |
| `vip_started_at` | TEXT | VIP 开通时间 |
| `crm_uid` | TEXT | CRM 系统用户 ID |
| `last_login_at` | TEXT | 最后登录时间 |
| `created_at` | TEXT | 创建时间 |
| `updated_at` | TEXT | 更新时间 |

## 数据类型说明

D1 使用 SQLite，以下是类型映射：

| SQLite 类型 | JavaScript 类型 | 说明 |
|------------|----------------|------|
| INTEGER | number | 整数 |
| TEXT | string | 文本/字符串 |
| REAL | number | 浮点数 |
| BLOB | ArrayBuffer | 二进制数据 |

## 数据库操作示例

### 查询公开推荐

```typescript
// 获取公开显示的推荐
const result = await db
  .prepare(
    `SELECT id, name, url, logo, catelog, description, sort_order, hidden, category, tags, featured
     FROM sites
     WHERE hidden = 0
     ORDER BY featured DESC, sort_order ASC, id ASC`
  )
  .all<SiteRow>();
```

### 新增推荐

```typescript
await db
  .prepare(
    `INSERT INTO sites
     (name, url, logo, catelog, description, sort_order, hidden, category, tags, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
  .bind(
    name,
    url,
    logo,
    category,
    description,
    sort_order,
    hidden,
    category,
    JSON.stringify(tags),
    featured
  )
  .run();
```

### 更新推荐

```typescript
await db
  .prepare(
    `UPDATE sites
     SET name = ?, url = ?, logo = ?, catelog = ?, description = ?, sort_order = ?,
         hidden = ?, category = ?, tags = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  )
  .bind(/* ... */)
  .run();
```

### 删除推荐

```typescript
await db.prepare('DELETE FROM sites WHERE id = ?').bind(id).run();
```

## 数据转换

### SiteRow → Site 对象

```typescript
function rowToSite(row: SiteRow): Site {
  let tags: string[] = [];
  try {
    tags = row.tags ? JSON.parse(row.tags) : [];
  } catch {
    tags = [];
  }

  return {
    id: row.id,
    name: row.name,
    url: row.url,
    logo: row.logo ?? '',
    catelog: row.catelog ?? row.category,
    desc: row.description ?? '',
    sort: row.sort_order,
    hide: row.hidden,
    category: row.category,
    tags,
    featured: row.featured
  };
}
```

### Tags 处理

Tags 字段存储为 JSON 字符串（如 `["返现", "美国"]`），读取时解析为数组。

## 静态后备数据

当 D1 不可用时，系统会使用以下静态文件作为后备：

- `src/lib/sites.json` - 推荐链接数据
- `src/lib/categories.json` - 分类数据
- `src/lib/settings.json` - 站点设置

这些文件的结构与数据库表结构一致。

## 数据初始化

首次部署时，需要按顺序执行迁移：

```bash
# 执行所有迁移
npx wrangler d1 migrations apply liantang-fun --remote
```

迁移会：
1. 创建表结构
2. 填充初始推荐数据
3. 创建初始分类
4. 准备用户表

## 备份与恢复

### 导出数据库

```bash
# 导出数据库到本地文件
npx wrangler d1 export liantang-fun --remote --output=dump.sql
```

### 本地开发数据库

```bash
# 使用本地 D1 进行开发
npm run dev
# 或使用 wrangler d1 execute 执行本地 SQL
```
