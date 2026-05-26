# web3happened docs

ZMX 前端团队内部文档站，部署于 [web3happened.com](https://web3happened.com)。

## 本地开发

```bash
pnpm install
pnpm dev
```

访问 http://localhost:3000

## 构建

```bash
pnpm build
# 静态产物在 out/ 目录
```

## 新增文档

1. 在 `pages/<分类>/` 下新建 `.mdx` 文件
2. 在同目录 `_meta.json` 中添加对应条目（控制侧边栏顺序和标题）
3. Push 到 main 分支，Cloudflare Pages 自动部署

## 技术栈

- [Nextra](https://nextra.site) v2 + nextra-theme-docs
- Next.js 14（静态导出）
- Cloudflare Pages（部署）
- Cloudflare Web Analytics（监控）
