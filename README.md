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

预览静态 HTML 专题页（不依赖 Next.js）：

```bash
python3 -m http.server 3001   # 访问 http://localhost:3001/public/frontend/prediction-market.html
```

## 构建

```bash
pnpm build      # 静态产物输出到 out/，public/ 下的文件自动复制进去
```

## 项目结构

```
web3happened-docs/
├── app/
│   ├── [[...mdxPath]]/page.tsx   # Nextra content 目录 catch-all 路由
│   ├── layout.tsx                 # App Router 根布局（Navbar + Footer + getPageMap）
│   └── not-found.tsx              # 404 页面
├── content/                       # MDX 文档（Nextra 路由）
│   ├── _meta.js
│   ├── index.mdx
│   └── frontend/
│       ├── _meta.js
│       ├── index.mdx
│       └── tracking.mdx           # 埋点使用指南
├── public/                        # 静态资源（next build 自动复制到 out/）
│   ├── assets/
│   │   ├── base.css               # 专题页公共样式
│   │   ├── toc.js                 # 目录自动生成脚本
│   │   └── predict-tracking.csv  # 预测市场埋点规范导出
│   └── frontend/
│       ├── prediction-market.html # 预测市场埋点规范专题页
│       └── tracking.html          # 埋点通用指南专题页
├── mdx-components.ts              # 全局 MDX 组件
└── next.config.mjs                # output: 'export', images.unoptimized: true
```

## 线上访问地址

| 页面 | URL |
|---|---|
| 知识库首页 | https://web3happened.com |
| 埋点通用指南 | https://web3happened.com/frontend/tracking |
| 预测市场埋点规范 | https://web3happened.com/frontend/prediction-market.html |
| 埋点规范 CSV 下载 | https://web3happened.com/assets/predict-tracking.csv |

## 部署

项目已接入 Cloudflare Pages 自动部署，push 到 `main` 分支即可触发构建，无需手动操作。

Cloudflare Pages 构建配置：

| 配置项 | 值 |
|---|---|
| Framework preset | Next.js (Static HTML Export) |
| Build command | `pnpm run build` |
| Build output directory | `out` |
| Node.js version | `20` |

## 添加新文档

**MDX 文档**（走 Nextra 路由，出现在左侧导航）：

1. 在 `content/` 对应目录下新建 `my-doc.mdx`
2. 在同目录 `_meta.js` 中注册标题：
   ```js
   export default {
     'my-doc': '文档标题',
   }
   ```
3. commit + push，自动部署

**独立专题 HTML 页**（不走 Nextra 路由，独立 URL）：

1. 在 `public/frontend/` 下新建 HTML 文件，引用 `/assets/base.css` 和 `/assets/toc.js`
2. commit + push，自动部署，访问地址为 `https://web3happened.com/frontend/<文件名>.html`
