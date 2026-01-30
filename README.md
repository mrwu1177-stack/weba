# HelloYan - 智能加密货币策略分析系统

## 🚀 项目概述

HelloYan 是一个专业的加密货币智能策略分析平台，提供实时市场数据、异动信号监控、多币种策略分析、布林带分析等功能。

## 🏗️ 架构设计

### 架构模式
- **前后端分离** + BFF (Backend for Frontend) 模式
- **统一API层**：所有前端请求通过统一API接口
- **数据缓存**：Redis + PostgreSQL 双层存储
- **实时推送**：WebSocket 支持
- **安全隔离**：第三方API密钥完全隐藏在后端

### 技术栈

#### 前端 (Next.js)
- Next.js 15 (App Router)
- React 18
- TypeScript
- TanStack Query (数据管理)
- Tailwind CSS (样式)
- Socket.io Client (实时通信)

#### 后端 (Node.js)
- Fastify (高性能Web框架)
- TypeScript
- Prisma ORM
- PostgreSQL (主数据库)
- Redis (缓存)
- Socket.io (WebSocket服务)
- BullMQ (任务队列)

### 数据流架构

```
前端 (Next.js)
    ↓
统一API (/api/v1/*)
    ↓
服务层 (数据清洗 + 聚合)
    ↓
  ┌──┴──┐
Redis缓存 PostgreSQL
  │      │
  └──┬──┘
     ↓
第三方API (CoinGecko、Binance等)
```

## 📦 项目结构

```
.
├── app/                      # 前端应用 (Next.js)
│   ├── admin/               # 后台管理
│   ├── api/                 # 前端API代理 (旧版，将废弃)
│   ├── components/          # React组件
│   ├── lib/                 # 工具库和hooks
│   └── pages/               # 页面
├── backend/                 # 后端服务 (独立)
│   ├── src/
│   │   ├── routes/          # API路由
│   │   ├── services/        # 业务逻辑
│   │   ├── middleware/      # 中间件
│   │   ├── utils/           # 工具函数
│   │   ├── websocket/       # WebSocket服务
│   │   └── jobs/            # 定时任务
│   ├── prisma/              # 数据库Schema
│   └── package.json
└── README.md
```

## 🛠️ 开发环境设置

### 前置要求
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14
- Redis >= 7

### 1. 克隆项目
```bash
git clone <repository-url>
cd hello-yan-website
```

### 2. 安装依赖
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd backend
npm install
cd ..
```

### 3. 配置环境变量

#### 前端 (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

#### 后端 (backend/.env)
```bash
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/heloyan"
REDIS_URL="redis://localhost:6379"

# API Keys
COINGECKO_API_KEY=""
BINANCE_API_KEY=""
# ... 其他API密钥
```

### 4. 初始化数据库
```bash
cd backend

# 生成Prisma客户端
npm run prisma:generate

# 运行迁移
npm run prisma:migrate
```

### 5. 启动开发服务器

#### 启动后端
```bash
cd backend
npm run dev
```
后端服务将在 `http://localhost:3001` 启动

#### 启动前端
```bash
npm run dev
```
前端服务将在 `http://localhost:3000` 启动

## 📡 API接口

### 统一API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/v1/markets` | GET | 获取市场数据 |
| `/api/v1/markets/:symbol` | GET | 获取指定币种数据 |
| `/api/v1/liquidations` | GET | 获取爆仓数据 |
| `/api/v1/liquidations/:symbol/chart` | GET | 获取爆仓图表数据 |
| `/api/v1/strategies/signals` | GET | 获取策略信号 |
| `/api/v1/strategies/bollinger-bands/:symbol` | GET | 获取布林带数据 |
| `/api/v1/strategies/multi-coin` | GET | 获取多币种策略 |
| `/api/v1/news` | GET | 获取新闻数据 |
| `/api/v1/anomalies` | GET | 获取市场异动 |
| `/api/v1/admin/api-status` | GET | 获取API状态 |

### WebSocket
- 端点: `WS /ws`
- 事件: `price_update`, `liquidation`, `signal`, `anomaly`

## 🎨 设计规范

### 配色方案
- **背景**: `#0F1117` (深炭黑)
- **文字**: `#E0E0E5` (暖白灰)
- **主要色**: `#FCD535` (币安黄)
- **成功**: `#4CAF50` (柔和绿)
- **危险**: `#EF5350` (柔和红)
- **警告**: `#F59E0B` (琥珀色)

### 设计原则
- 极简主义：减少视觉噪音
- 高对比度：确保可读性
- 暗色模式：保护眼睛
- 响应式：支持多设备

## 🚢 部署

### 前端部署 (Vercel)
```bash
vercel --prod
```

### 后端部署 (Railway)
```bash
cd backend
railway up
```

### 环境变量配置

在 Railway/Vercel 中配置以下环境变量：

**后端**:
- `DATABASE_URL`
- `REDIS_URL`
- `COINGECKO_API_KEY`
- `BINANCE_API_KEY`
- 其他API密钥

**前端**:
- `NEXT_PUBLIC_API_BASE_URL` (指向Railway后端URL)

## 🔒 安全性

- 所有第三方API密钥存储在后端环境变量
- 前端无法直接访问第三方API
- API请求速率限制
- CORS配置
- 输入验证

## 📊 性能优化

- Redis缓存 (TTL: 30s - 5min)
- React Query缓存
- 骨架屏加载
- 懒加载
- WebSocket实时更新减少轮询

## 🔧 维护

### 查看日志
```bash
# 后端日志
cd backend
tail -f logs/combined.log
```

### 数据库管理
```bash
cd backend
npx prisma studio
```

### 缓存清理
```bash
# 连接Redis
redis-cli
> FLUSHDB
```

## 📝 开发规范

### Git提交规范
```
feat: 新功能
fix: 修复bug
refactor: 重构
docs: 文档更新
style: 样式修改
test: 测试
chore: 构建/工具链
```

### 代码风格
- TypeScript严格模式
- ESLint + Prettier
- 统一的命名规范

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

ISC

## 📞 联系方式

- 网站: https://heloyan.xyz
- 项目地址: [GitHub Repository]

---

**注意**: 请勿将 `.env` 文件提交到版本控制系统。使用 `.env.example` 作为模板。
