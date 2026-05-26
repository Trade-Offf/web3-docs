# web3happened docs

ZMX 前端团队内部知识库，基于 [Nextra v4](https://nextra.site) + Next.js 15 构建，部署于 Cloudflare Pages。

## 技术栈

| 项目 | 版本 |
|---|---|
| Next.js | 15.5.x |
| Nextra | 4.6.x |
| nextra-theme-docs | 4.6.x |
| React | 19.x |
| Node.js | ≥ 20 |
| 包管理器 | pnpm 9.1.1 |

> **注意**：`zod` 已通过 pnpm overrides 锁定到 `4.3.6`，不可升级到 4.4.x（与 Nextra 4.6.x 不兼容）。

## 本地开发

```bash
pnpm install
pnpm dev        # http://localhost:3000（不支持 --turbopack，Nextra MDX loader 依赖 webpack）
```

## 构建

```bash
pnpm build      # 静态产物输出到 out/
```

## 项目结构

```
web3happened-docs/
├── app/
│   ├── [[...mdxPath]]/page.tsx   # Nextra content 目录 catch-all 路由
│   ├── layout.tsx                 # App Router 根布局（Navbar + Footer + getPageMap）
│   └── not-found.tsx              # 404 页面
├── content/                       # 所有 MDX 文档
│   ├── _meta.js                   # 顶层导航顺序
│   ├── index.mdx                  # 首页
│   └── frontend/
│       ├── _meta.js
│       ├── index.mdx
│       └── tracking.mdx           # 埋点使用指南
├── mdx-components.ts              # 全局 MDX 组件（nextra-theme-docs）
├── next.config.mjs                # output: 'export', images.unoptimized: true
└── public/
```

## 部署至 Cloudflare Pages

### Step 1：Push 到 GitHub

```bash
# 在 GitHub 上新建仓库 web3happened-docs（private）
git remote add origin https://github.com/<your-org>/web3happened-docs.git
git push -u origin main
```

### Step 2：Cloudflare Pages 连接仓库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages**
2. 选择 **Connect to Git** → 授权 GitHub → 选择 `web3happened-docs` 仓库
3. Build settings 配置如下：

| 配置项 | 值 |
|---|---|
| Framework preset | **Next.js (Static HTML Export)** |
| Build command | `pnpm run build` |
| Build output directory | `out` |
| Node.js version | `20` |

4. 添加环境变量 `NODE_VERSION=20`
5. 点击 **Save and Deploy**

### Step 3：绑定自定义域名 web3happened.com

1. 部署成功后进入项目 → **Custom domains** → **Set up a custom domain**
2. 输入 `web3happened.com`，按提示在 DNS 面板添加 CNAME 记录

### Step 4：Cloudflare Web Analytics

1. Cloudflare Dashboard → **Analytics & Logs** → **Web Analytics** → **Add a site**
2. 输入 `web3happened.com`，获取 Analytics Token
3. 修改 `app/layout.tsx` 中：

```tsx
data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN"}'
```

将 `REPLACE_WITH_CF_ANALYTICS_TOKEN` 替换为实际 token，commit 并 push，Cloudflare Pages 自动重新构建。

## 添加新文档

1. 在 `content/` 对应目录下新建 `my-doc.mdx`
2. 在同目录 `_meta.js` 中注册标题：
   ```js
   export default {
     'my-doc': '文档标题',
   }
   ```
3. commit + push，Cloudflare Pages 自动构建部署
