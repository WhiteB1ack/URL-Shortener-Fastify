# URL Shortener Fullstack (极简短链接生成与统计服务)

基于 **Fastify + TypeBox + Prisma + Vue 3** 构建的轻量级全栈短链接应用。支持随机与自定义短码生成、302 高速重定向跳转、访问量统计及本地历史记录管理。

## ✨ 核心特性

- **短链生成**：支持自动生成 6 位随机短码（`nanoid`），也支持 4~12 位自定义短码及系统保留字拦截。
- **并发与类型安全**：基于 `@sinclair/typebox` 实现运行时参数校验与 TypeScript 静态类型推导；数据库层通过唯一索引与 `P2002` 错误捕获防止并发冲突。
- **实时统计与跳转**：支持 `302` 重定向跳转，异步累加访问次数（不阻塞跳转响应），并提供独立接口查询短链点击数据与创建时间。
- **轻量前端工作台**：采用极简暗色主题单页设计，支持前端表单预校验、`localStorage` 历史记录持久化及一键查询统计。

## 🛠️ 技术栈

- **后端 (`backend/`)**：Node.js, TypeScript, Fastify, `@fastify/type-provider-typebox`, `@fastify/sensible`, `@fastify/cors`, Prisma ORM (SQLite)
- **前端 (`frontend/`)**：Vue 3, TypeScript, Vite, Axios

## 📁 目录结构

```text
url-shortener-fullstack/
├── backend/                  # Fastify 后端服务
│   ├── prisma/               # 数据库模型定义 (schema.prisma) 与迁移记录
│   └── src/
│       ├── plugins/          # Prisma 数据库插件封装
│       ├── routes/           # 短链生成、跳转、统计路由
│       ├── schemas/          # TypeBox 请求/响应校验 Schema
│       ├── app.ts            # Fastify 实例与插件组装
│       └── server.ts         # HTTP 服务启动入口
└── frontend/                 # Vue 3 前端界面
    └── src/
        ├── api/              # Axios 接口封装
        ├── composables/      # localStorage 历史记录状态管理
        ├── types/            # 前后端对齐的 TS 类型定义
        ├── utils/            # URL 与短码格式校验工具
        └── App.vue           # 主交互面板

 快速启动1. 启动后端服务Bashcd backend
npm install

# 初始化本地 SQLite 数据库并生成 Prisma Client
npx prisma migrate dev --name init

# 启动开发服务器（默认监听 http://localhost:3000）
npm run dev
(提示：如需配置环境变量，可在 backend/ 下创建 .env 文件，设置 DATABASE_URL="file:./dev.db"。)2. 启动前端应用新开一个终端窗口：Bashcd frontend
npm install

# 启动 Vite 开发服务器（默认监听 http://localhost:5173）
npm run dev
📡 API 接口一览方法路径说明请求体 / 参数示例POST/shorten创建短链接{ "url": "https://fastify.dev", "customCode": "fastify" }GET/:code短链 302 重定向跳转路径参数 code（4~12 位标识码）GET/stats/:code查询短链点击统计与详情路径参数 code（返回原始链接、点击数、创建时间）GET/ping服务健康检测返回 { "message": "pong" }        