# HelloYan 部署指南

本文档详细说明如何在本地和生产环境中部署 HelloYan 系统。

## 📋 目录

- [环境要求](#环境要求)
- [本地开发部署](#本地开发部署)
- [生产环境部署](#生产环境部署)
- [Railway 配置](#railway-配置)
- [Vercel 配置](#vercel-配置)
- [域名配置](#域名配置)
- [监控和维护](#监控和维护)
- [故障排查](#故障排查)

## 环境要求

### 必需软件

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **PostgreSQL**: >= 14.0
- **Redis**: >= 7.0
- **Git**: >= 2.0

### 可选软件

- **Docker**: >= 20.10 (用于本地开发)
- **Docker Compose**: >= 2.0
- **Railway CLI**: 用于部署后端
- **Vercel CLI**: 用于部署前端

## 本地开发部署

### 方法1: 使用 Docker Compose (推荐)

1. **克隆项目**
```bash
git clone <repository-url>
cd hello-yan-website
```

2. **配置环境变量**
```bash
cp .env.example .env.local
cp backend/.env.example backend/.env
```

3. **编辑 backend/.env**
```bash
DATABASE_URL=postgresql://heloyan:heloyan_password@localhost:5432/heloyan
REDIS_URL=redis://localhost:6379
PORT=3001
NODE_ENV=development
```

4. **启动开发环境**
```bash
./scripts/dev.sh
```

这将自动：
- 启动 PostgreSQL 和 Redis 容器
- 安装所有依赖
- 运行数据库迁移
- 启动后端服务 (http://localhost:3001)
- 启动前端服务 (http://localhost:3000)

### 方法2: 手动安装

1. **启动 PostgreSQL 和 Redis**
```bash
# 使用 Docker
docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=heloyan_password postgres:15
docker run -d --name redis -p 6379:6379 redis:7-alpine

# 或使用本地安装的服务
# 确保 PostgreSQL 和 Redis 正在运行
```

2. **安装依赖**
```bash
npm install
cd backend
npm install
npx prisma generate
npx prisma migrate dev
cd ..
```

3. **配置环境变量**
```bash
# 前端
cp .env.example .env.local

# 后端
cp backend/.env.example backend/.env
# 编辑 backend/.env 配置数据库连接
```

4. **启动服务**

启动后端:
```bash
cd backend
npm run dev
```

启动前端 (新终端):
```bash
npm run dev
```

## 生产环境部署

### 1. 后端部署 (Railway)

#### 步骤1: 创建 Railway 项目

1. 登录 [Railway](https://railway.app)
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择你的仓库

#### 步骤2: 配置服务

在 Railway 项目中，创建两个服务：

**Backend Service**
- Root Directory: `backend`
- Build Command: `npm run build`
- Start Command: `npm start`

**PostgreSQL Service**
- 选择 "Database" > "Add Database" > "PostgreSQL"

**Redis Service**
- 选择 "Database" > "Add Database" > "Redis"

#### 步骤3: 配置环境变量

在 Backend Service 的 Variables 标签页中添加：

```bash
NODE_ENV=production
PORT=3001
DATABASE_URL={{ postgres.DATABASE_URL }}
REDIS_URL={{ redis.REDIS_URL }}
LOG_LEVEL=info
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000

# API Keys
COINGECKO_API_KEY=your_coingecko_api_key
BINANCE_API_KEY=your_binance_api_key
BINANCE_API_SECRET=your_binance_api_secret
# ... 添加其他API密钥
```

#### 步骤4: 部署

```bash
# 安装 Railway CLI
npm i -g railway

# 登录
railway login

# 添加项目
cd backend
railway link

# 部署
railway up
```

#### 步骤5: 初始化数据库

部署完成后，运行数据库迁移：

```bash
railway run npx prisma migrate deploy
```

### 2. 前端部署 (Vercel)

#### 步骤1: 创建 Vercel 项目

1. 登录 [Vercel](https://vercel.com)
2. 点击 "Add New Project"
3. 选择你的仓库
4. 配置项目设置

#### 步骤2: 配置环境变量

在 Vercel 项目设置中添加：

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_SITE_NAME=HelloYan
NEXT_PUBLIC_SITE_URL=https://heloyan.xyz
```

#### 步骤3: 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

## Railway 配置

### 自动部署配置

在项目根目录创建 `railway.toml`:

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "backend/Dockerfile"

[deploy]
healthcheckPath = "/health"
restartPolicyType = "always"

[[services]]
  http_port = 3001
```

### 健康检查

Railway 会自动调用 `/health` 端点检查服务健康状态。

### 日志查看

在 Railway 控制台中可以查看实时日志：

```bash
railway logs
```

## Vercel 配置

### vercel.json 配置

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hkg1"],
  "env": {
    "NEXT_PUBLIC_API_BASE_URL": "@backend-url"
  }
}
```

### 自定义域名

1. 在 Vercel 项目设置中添加域名
2. 配置 DNS 记录

## 域名配置

### Cloudflare 配置

1. **添加域名到 Cloudflare**
   - 登录 Cloudflare 控制台
   - 添加你的域名

2. **配置 DNS 记录**

```
Type: CNAME
Name: @
Target: your-vercel-domain.vercel.app
Proxy: Enabled

Type: CNAME
Name: api
Target: your-railway-domain.railway.app
Proxy: Enabled

Type: CNAME
Name: www
Target: your-vercel-domain.vercel.app
Proxy: Enabled
```

3. **SSL/TLS 设置**
   - 设置为 "Full (strict)"
   - 启用 "Always Use HTTPS"

4. **Page Rules (可选)**

```
URL: heloyan.xyz/*
Settings:
- Auto Minify: JavaScript, CSS, HTML
- Browser Cache TTL: 4 hours
```

## 监控和维护

### 健康检查

定期检查服务状态：

```bash
# 检查后端
curl https://api.heloyan.xyz/health

# 检查前端
curl https://heloyan.xyz
```

### 日志监控

**Railway 日志**:
```bash
railway logs --tail
```

**Vercel 日志**:
- 访问 Vercel 控制台
- 查看 "Logs" 标签页

### 数据库备份

Railway 会自动备份 PostgreSQL 数据库。你也可以手动备份：

```bash
railway pg:dump > backup.sql
```

### 性能监控

**后端监控**:
- 使用 Railway 内置监控
- 可集成 Sentry 进行错误追踪

**前端监控**:
- 使用 Vercel Analytics
- 可集成 Google Analytics

## 故障排查

### 常见问题

#### 1. 数据库连接失败

**症状**: 后端无法连接到数据库

**解决方案**:
```bash
# 检查 DATABASE_URL 环境变量
railway variables

# 检查数据库服务状态
railway status

# 重新生成 Prisma 客户端
railway run npx prisma generate
```

#### 2. Redis 连接失败

**症状**: 缓存功能不工作

**解决方案**:
```bash
# 检查 Redis 服务状态
railway status

# 测试 Redis 连接
railway run redis-cli ping
```

#### 3. API 请求失败

**症状**: 前端无法获取数据

**解决方案**:
```bash
# 检查后端服务状态
curl https://api.heloyan.xyz/health

# 检查 NEXT_PUBLIC_API_BASE_URL
vercel env ls

# 查看后端日志
railway logs
```

#### 4. 部署失败

**症状**: Railway 或 Vercel 部署失败

**解决方案**:
```bash
# 检查构建日志
railway logs
# 或
vercel logs

# 本地测试构建
npm run build

# 检查 package.json scripts
```

#### 5. API 密钥失效

**症状**: 第三方 API 返回 401/403 错误

**解决方案**:
```bash
# 更新 API 密钥
railway variables set COINGECKO_API_KEY=new_key

# 重新部署
railway up
```

### 调试技巧

#### 启用详细日志

```bash
# 后端
railway variables set LOG_LEVEL=debug
railway up
```

#### 测试数据库连接

```bash
railway run npx prisma studio
```

#### 查看环境变量

```bash
railway variables
vercel env ls
```

### 性能优化

1. **启用 CDN**: Cloudflare 自动缓存静态资源
2. **优化图片**: 使用 WebP 格式
3. **代码分割**: Next.js 自动处理
4. **数据库索引**: 确保 Prisma Schema 中有适当的索引
5. **Redis 缓存**: 合理设置 TTL

## 安全建议

1. **定期更新依赖**
```bash
npm audit
npm audit fix
```

2. **使用强密码**
- 数据库密码
- API 密钥
- 管理员密码

3. **启用 HTTPS**
- Cloudflare 自动提供 SSL
- 确保所有 API 都使用 HTTPS

4. **限制 API 速率**
- 后端已内置速率限制
- 可根据需要调整 `RATE_LIMIT_MAX`

5. **定期备份**
- 启用 Railway 自动备份
- 定期导出数据库

## 更新部署

### 后端更新

```bash
cd backend
git pull origin main
railway up
```

### 前端更新

```bash
git pull origin main
vercel --prod
```

### 数据库迁移

```bash
cd backend
railway run npx prisma migrate deploy
```

## 联系支持

如有问题，请联系：
- Email: support@heloyan.xyz
- GitHub Issues: [Repository Issues]

---

**注意**: 首次部署请仔细检查所有配置，特别是环境变量和数据库连接。
