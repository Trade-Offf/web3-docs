# web3happened docs

ZMX 前端团队内部知识库，部署于 Cloudflare Pages。

## 本地预览

```bash
python3 -m http.server 3001 --directory public
# 访问 http://localhost:3001
```

## 项目结构

```
web3happened-docs/
└── public/                        # 全部静态文件，即为站点根目录
    ├── index.html                 # 首页
    ├── favicon.svg
    ├── assets/
    │   ├── base.css               # 全站公共样式
    │   ├── toc.js                 # 目录自动生成脚本
    │   └── predict-tracking.csv  # 预测市场埋点规范导出
    └── frontend/
        ├── tracking.html          # 埋点通用指南
        └── prediction-market.html # 预测市场埋点规范
```

## 线上地址

| 页面 | URL |
|---|---|
| 首页 | https://web3happened.com |
| 埋点通用指南 | https://web3happened.com/frontend/tracking.html |
| 预测市场埋点规范 | https://web3happened.com/frontend/prediction-market.html |
| 埋点规范 CSV 下载 | https://web3happened.com/assets/predict-tracking.csv |

## 部署

push 到 `main` 分支即自动部署到 Cloudflare Pages。

Cloudflare Pages 构建配置：

| 配置项 | 值 |
|---|---|
| Build command | `mkdir -p out && cp -r public/. out/` |
| Build output directory | `out` |

## 添加新文档

在 `public/frontend/` 下新建 HTML 文件，引用 `/assets/base.css` 和 `/assets/toc.js`，commit + push 即自动部署。
