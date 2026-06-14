# Phase 1: 品牌重塑 + 全面中文化 — Codex 执行清单

## 仓库信息
- Fork 仓库: `zhengjinjun1975/jianweicrm`（已 fork，up-to-date with twentyhq/twenty:main）
- 品牌名: 见微 CRM (简称"见微")
- 启动前: 先拉取最新代码 fork，然后依次改以下文件

---

## 1. 品牌基础文件（6 个文件）

### 1.1 `index.html` (twenty-front/packages/twenty-front/index.html)
- `<html lang="en"` → `<html lang="zh-CN"`
- `<title>Twenty</title>` → `<title>见微 CRM</title>`
- `<meta name="description" content="A modern open-source CRM" />` → `content="见微 CRM - AI原生中小企业CRM系统"`
- `<meta property="og:title" content="Twenty" />` → `<meta property="og:title" content="见微 CRM" />`
- `<meta name="twitter:title" content="Twenty" />` → 同上
- `<meta property="og:description"` + `<meta name="twitter:description"` → 改成中文描述
- OG image URL 指向 `https://raw.githubusercontent.com/twentyhq/twenty/main/docs/static/img/social-card.png`
  → 改为 `https://raw.githubusercontent.com/zhengjinjun1975/jianweicrm/main/docs/static/img/social-card.png`

### 1.2 `manifest.json` (twenty-front/public/manifest.json)
- `"short_name": "Twenty"` → `"short_name": "见微"`
- `"name": "Twenty"` → `"name": "见微CRM"`

### 1.3 `DefaultWorkspaceName.ts`
**路径**: `packages/twenty-front/src/modules/ui/navigation/navigation-drawer/constants/DefaultWorkspaceName.ts`
- 内容就一行: `export const DEFAULT_WORKSPACE_NAME = 'Twenty';` → 改为 `'见微 CRM'`

### 1.4 `docker-compose.yml`
**路径**: `packages/twenty-docker/docker-compose.yml`
- `name: twenty` → `name: jianwei`
- `image: twentycrm/twenty:${TAG:-latest}` → `image: jianweicrm/server:${TAG:-latest}`

### 1.5 项目 `package.json` (根目录)
**路径**: `package.json`
- 把 `"name": "twenty"` 改成 `"name": "jianwei-crm"`（如果在根 package.json 中）
- `"description"` 改成中文

### 1.6 各个子 package 的 `package.json`
**路径**: `packages/twenty-front/package.json`, `packages/twenty-server/package.json`
- 如果有 `"name"` 或 `"description"` 含 Twenty，改掉

---

## 2. 登录页品牌名（3 处 UI 文字）

### 2.1 `SignInUp.tsx` 欢迎文字
**路径**: `packages/twenty-front/src/pages/auth/SignInUp.tsx` 第 133 行
```ts
return t`Welcome to Twenty`;
```
→ `return t\`欢迎使用见微CRM\`;`

### 2.2 `NotFound.tsx` 页面标题
**路径**: `packages/twenty-front/src/pages/not-found/NotFound.tsx` 第 49 行
```tsx
<PageTitle title={t`Page Not Found | Twenty`} />
```
→ `<PageTitle title={t\`页面未找到 | 见微CRM\`} />`

### 2.3 `FooterNote.tsx` 协议提示
**路径**: `packages/twenty-front/src/modules/auth/sign-in-up/components/FooterNote.tsx` 第 66 行
```tsx
<Trans>By using Twenty, you agree to the</Trans>
```
→ `<Trans>使用见微CRM即表示同意</Trans>`
同时把 `href="https://twenty.com/legal/terms"` → `href="https://jianweicrm.com/legal/terms"`（或删除 URI）
`href="https://twenty.com/legal/privacy"` 同理

---

## 3. 全局中文化 — 对象标签 & UI 文案

### 3.1 中文 locale 文件
**路径**: `packages/twenty-front/src/locales/generated/zh-CN.ts`
- 这个文件已经包含大部分中文翻译，但可能有遗漏的空字符串
- 写一个 migration 脚本批量替换
- 关键对照表（需要确认是否已翻译，如果为空则补充）：
  - People → 联系人
  - Company/Companies → 客户
  - Opportunity → 商机
  - Note → 笔记
  - Task → 任务
  - Activity → 动态
  - Workspace → 工作区
  - Search → 搜索
  - Settings → 设置

### 3.2 登录/注册页面中文提示
- `SettingsCommunity.tsx` 第 130 行: `Hire a partner to help you implement and customize Twenty.`
- `SyncEmails.tsx` 第 126 行: `Sync your Emails and Calendar with Twenty.`
- `SettingsWorkspaceEmail.tsx` 第 57 行: `Sending requires... Twenty Cloud.`
  所有这些文案里的 "Twenty" 替换为"见微CRM"

---

## 4. 数据预置中的英文内容

### 4.1 `prefill-workflows.util.ts`
**路径**: `packages/twenty-server/src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-workflows.util.ts`
- 第 465 行: `value: 'https://twenty.com'` → 改为你自己的域名或删掉
- 第 472 行: `value: 'twenty.com'` → 同上

### 4.2 种子数据中的 `@twenty.com` 邮箱
**路径**: `packages/twenty-server/src/engine/workspace-manager/dev-seeder/data/constants/pet-data-seeds.constant.ts`
- 第 88-92 行: `john@twenty.com`, `tim@twenty.com` 等邮箱改为 `@jianweicrm.com` 或删除

---

## 5. 系统对象中文名（后端 metadata）

### 5.1 标准对象预定义名称
查看 twenty-server 中 workspace-manager 下的 standard-objects 定义
**路径**: `packages/twenty-server/src/engine/workspace-manager/standard-objects/`
- 这里定义 Person → `{singularName: 'person', pluralName: 'people', labelSingular: 'Person', labelPlural: 'People'}`
- 改为 `labelSingular: '联系人'`, `labelPlural: '联系人'`
- Company 改为 `'客户'`
- Opportunity 改为 `'商机'`
- Activity 改为 `'动态'`

---

## 执行顺序

1. 先改品牌基础文件 (1.1-1.6)
2. 再改登录页 UI 文字 (2.1-2.3)
3. 再改中文 locale (3.1-3.2)
4. 再改 server 数据预置 (4.1-4.2)
5. 最后改系统对象中文名 (5.1)
6. 提交 commit: `Phase 1: 品牌重塑为"见微CRM" + 全面中文化`
7. Push 到 `zhengjinjun1975/jianweicrm`

---

## 注意事项
- 所有变更优先改**中文 locale 文件** (`zh-CN.ts`)，而不是硬编码字符串
- 如果改动 `zh-CN.ts` 中已有的 key，不要改其他语言的 locale
- 用 `git grep -n 'Twenty\|twenty\.com' packages/twenty-front packages/twenty-server` 确认还有没有遗漏
- 不要改 `twenty-shared`, `twenty-ui-deprecated` 等 npm 包名——这些是内部包名，改了会 break
- Server 端标准对象 label 改了后，已有 workspace 不会自动更新；只影响新建 workspace
