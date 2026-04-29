# API 文档

## 概述

LT 导航站的 API 主要基于 SvelteKit 的 **Server Actions** 和 **API Routes** 实现。

- **Server Actions** - 处理表单提交
- **API Routes** - 提供 REST API
- **Load Functions** - 服务端数据加载

## 目录

- [元数据获取 API](#元数据获取-api)
- [首页 Actions](#首页-actions)
- [管理页 Actions](#管理页-actions)
- [Load Functions](#load-functions)

---

## 元数据获取 API

### GET /api/metadata

自动获取指定 URL 的网页标题、描述和图标。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `url` | string | 是 | 目标网站 URL |

#### 响应示例

**成功响应 (200)**
```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "description": "Example domain description",
  "icon": "https://example.com/favicon.ico"
}
```

**错误响应 (400)**
```json
{
  "error": "missing url"
}
```

#### 实现说明

1. 自动为 URL 添加 `https://` 前缀（如缺少）
2. 请求目标网站，跟随重定向
3. 解析 HTML，按优先级提取：
   - `og:title` → `<title>`
   - `description` → `og:description`
   - `apple-touch-icon` → `icon` → `shortcut icon`
4. 如果无法访问，返回基于域名的默认值

#### 使用示例

```typescript
// 前端调用
const response = await fetch(`/api/metadata?url=${encodeURIComponent('example.com')}`);
const metadata = await response.json();

if (metadata.title) {
  editor.name = metadata.title;
}
if (metadata.description) {
  editor.desc = metadata.description;
}
if (metadata.icon) {
  editor.logo = metadata.icon;
}
```

---

## 首页 Actions

所有 Actions 定义在 `src/routes/+page.server.ts`。

### 管理员登录 - login

登录管理员账号，进入编辑模式。

#### 请求
```
POST /?/login
Content-Type: application/x-www-form-urlencoded

password=ADMIN_PASSWORD
```

#### 表单字段

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `password` | string | 是 | 管理员密码 |

#### 响应

**成功**
```typescript
{ success: '已进入管理模式。' }
// 并设置 Cookie: ref_admin=...
```

**失败**
```typescript
{ error: '管理密码不正确。' }  // 401
{ error: '还没有配置 ADMIN_PASSWORD。' }  // 400
```

---

### 管理员退出 - logout

清除管理员登录状态。

#### 请求
```
POST /?/logout
```

#### 响应

重定向到 `/admin`，并清除 Cookie。

---

### 用户注册 - registerUser

注册新用户账号。

#### 请求
```
POST /?/registerUser
Content-Type: application/x-www-form-urlencoded

email=user@example.com&password=123456&display_name=User
```

#### 表单字段

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `email` | string | 是 | 邮箱地址 |
| `password` | string | 是 | 密码（至少 6 位） |
| `display_name` | string | 否 | 显示名称 |

#### 响应

**成功**
```typescript
{ success: '已注册并登录。' }
// 并设置用户 Cookie
```

**失败**
```typescript
{ error: '请填写邮箱。' }  // 400
{ error: '密码至少 6 位。' }  // 400
{ error: '这个邮箱已经注册过。' }  // 409
{ error: 'D1 数据库还没有绑定，暂时不能保存。' }  // 500
```

---

### 用户登录 - loginUser

用户登录。

#### 请求
```
POST /?/loginUser
Content-Type: application/x-www-form-urlencoded

email=user@example.com&password=123456
```

#### 表单字段

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `email` | string | 是 | 邮箱地址 |
| `password` | string | 是 | 密码 |

#### 响应

**成功**
```typescript
{ success: '已登录推荐站账号。' }
// 更新 last_login_at，同步到 CRM，设置用户 Cookie
```

**失败**
```typescript
{ error: '邮箱或密码不正确。' }  // 401
```

---

### 用户退出 - logoutUser

退出用户登录状态。

#### 请求
```
POST /?/logoutUser
```

#### 响应

```typescript
{ success: '已退出推荐站账号。' }
// 清除用户 Cookie
```

---

### 更新联系方式 - updateContact

更新当前登录用户的联系方式。

#### 请求
```
POST /?/updateContact
Content-Type: application/x-www-form-urlencoded

email=new@example.com&display_name=NewName&wechat=mywechat&telegram=@mytelegram
```

#### 表单字段

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `email` | string | 是 | 邮箱地址 |
| `display_name` | string | 否 | 显示名称 |
| `wechat` | string | 否 | 微信账号 |
| `telegram` | string | 否 | Telegram 账号 |

#### 响应

**成功**
```typescript
{ success: '联系方式已更新。' }
```

**失败**
```typescript
{ error: '请先登录推荐站账号。' }  // 401
{ error: '邮箱不能为空。' }  // 400
{ error: '这个邮箱已经被其他账号使用。' }  // 409
```

---

### 开通 VIP - openVip

为当前用户开通 VIP。

#### 请求
```
POST /?/openVip
```

#### 响应

**成功**
```typescript
{ success: 'VIP 已开通并同步。' }
```

**失败**
```typescript
{ error: '请先登录推荐站账号。' }  // 401
```

---

### 创建分类 - createCategory

新增或更新分类（管理员功能）。

#### 请求
```
POST /?/createCategory
Content-Type: application/x-www-form-urlencoded

name=新分类&description=分类描述&sort=100
```

#### 表单字段

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `name` | string | 是 | 分类名称 |
| `description` | string | 否 | 分类描述 |
| `sort` | number | 否 | 排序权重（默认 100） |

#### 响应

**成功**
```typescript
{ success: '分类已保存。' }
```

**失败**
```typescript
{ error: '请先进入管理模式。' }  // 401
{ error: '分类名称不能为空。' }  // 400
```

---

### 创建推荐 - createSite

新增推荐链接（管理员功能）。

#### 请求
```
POST /?/createSite
Content-Type: application/x-www-form-urlencoded

name=推荐名称&url=https://example.com&logo=...&desc=描述&category=分类&tags=标签1,标签2&sort=100&featured=on&hidden=off
```

#### 表单字段

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `name` | string | 是 | 推荐名称 |
| `url` | string | 是 | 链接地址 |
| `logo` | string | 否 | Logo 图片 URL 或 data URI |
| `desc` | string | 否 | 描述/备注 |
| `category` | string | 否 | 分类（默认 "数字服务与好物"） |
| `tags` | string | 否 | 标签（逗号/换行分隔，最多 8 个） |
| `sort` | number | 否 | 排序权重（默认 100） |
| `featured` | boolean | 否 | 是否精选（checkbox） |
| `hidden` | boolean | 否 | 是否隐藏（checkbox） |

#### 响应

**成功**
```typescript
{ success: '推荐已新增。' }
```

**失败**
```typescript
{ error: '请先进入管理模式。' }  // 401
{ error: '名称不能为空。' }  // 400
```

---

### 更新推荐 - updateSite

编辑现有推荐链接（管理员功能）。

#### 请求
```
POST /?/updateSite
Content-Type: application/x-www-form-urlencoded

id=123&name=新名称&url=...&...
```

#### 表单字段

与 `createSite` 相同，额外需要：

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `id` | number | 是 | 推荐 ID |

#### 响应

**成功**
```typescript
{ success: '推荐已保存。' }
```

**失败**
```typescript
{ error: '请先进入管理模式。' }  // 401
{ error: '缺少推荐 ID。' }  // 400
```

---

### 删除推荐 - removeSite

删除推荐链接（管理员功能）。

#### 请求
```
POST /?/removeSite
Content-Type: application/x-www-form-urlencoded

id=123
```

#### 表单字段

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `id` | number | 是 | 推荐 ID |

#### 响应

**成功**
```typescript
{ success: '推荐已删除。' }
```

**失败**
```typescript
{ error: '请先进入管理模式。' }  // 401
{ error: '缺少推荐 ID。' }  // 400
```

---

## 管理页 Actions

管理页 Actions 定义在 `src/routes/admin/+page.server.ts`，功能与首页类似，路径为 `/admin`。

| Action | 说明 |
|--------|------|
| `login` | 管理员登录 |
| `logout` | 管理员退出 |
| `create` | 创建推荐 |
| `update` | 更新推荐 |
| `remove` | 删除推荐 |

---

## Load Functions

### 首页 Load - src/routes/+page.server.ts

```typescript
export async function load({ cookies, platform }) {
  return {
    sites: Site[],      // 推荐列表
    categories: Category[],  // 分类列表
    settings: Settings,      // 站点设置
    source: 'd1' | 'fallback',  // 数据来源
    loggedIn: boolean,       // 管理员是否登录
    user: User | null,       // 当前登录用户
    configured: boolean,     // ADMIN_PASSWORD 是否已配置
    hasDb: boolean           // D1 是否可用
  };
}
```

### 管理页 Load - src/routes/admin/+page.server.ts

```typescript
export async function load({ cookies, platform }) {
  return {
    loggedIn: boolean,       // 管理员是否登录
    configured: boolean,     // ADMIN_PASSWORD 是否已配置
    hasDb: boolean,          // D1 是否可用
    categories: string[],    // 分类名称列表
    sites: Site[]            // 所有推荐（包括隐藏的）
  };
}
```

---

## 类型定义

### Site 类型

```typescript
interface Site {
  id: number;
  name: string;
  url: string;
  logo: string;
  catelog: string;
  desc: string;
  sort: number;
  hide: number;
  category: string;
  tags: string[];
  featured: number;
}
```

### Category 类型

```typescript
interface Category {
  name: string;
  description: string;
  sort: number;
}
```

### User 类型

```typescript
interface User {
  id: number;
  email: string;
  display_name: string;
  wechat: string;
  telegram: string;
  crm_uid: string;
  vip_status: 'inactive' | 'active';
  vip_started_at: string;
}
```

---

## 错误处理

所有 Actions 使用 SvelteKit 的 `fail()` 函数返回错误，前端可以通过 `$page.form` 访问。

```typescript
// 前端错误处理示例
{#if form?.error}
  <p class="error">{form.error}</p>
{/if}
{#if form?.success}
  <p class="success">{form.success}</p>
{/if}
```

---

## 安全说明

1. **认证**：所有管理功能都需要验证管理员身份
2. **Cookie**：使用 HttpOnly、SameSite=Lax Cookie
3. **输入验证**：所有表单输入都经过验证和清理
4. **SQL 注入防护**：使用 D1 预编译语句和参数绑定
