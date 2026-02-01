# Railway 部署环境配置指南

## 📋 必需的环境变量

### 前端环境变量 (Next.js)
在 Railway 项目设置中添加以下变量：

```
NEXT_PUBLIC_API_BASE_URL=https://your-railway-backend-url
NEXT_PUBLIC_SITE_NAME=HelloYan
NEXT_PUBLIC_SITE_URL=https://your-railway-frontend-url
```

### 后端环境变量 (Fastify)
```
PORT=3001
NODE_ENV=production
API_VERSION=v1
DATABASE_URL=postgresql://user:password@host:port/heloyan?schema=public
REDIS_URL=redis://default:password@host:port
```

### 第三方 API 密钥
```
COINGECKO_API_KEY=your_coingecko_api_key
BINANCE_API_KEY=your_binance_api_key
BINANCE_API_SECRET=your_binance_api_secret
OKX_API_KEY=your_okx_api_key
OKX_API_SECRET=your_okx_api_secret
```

## 🚀 Railway 配置步骤

### 方案 A: 使用 Nixpacks（推荐）

1. **在 Railway 项目设置中**
   - 构建器：选择 `NIXPACKS`（默认）
   - 不需要修改其他配置
   - `.npmrc` 文件会自动被读取，`omit=dev` 会生效

2. **如果仍出现 npm 错误**
   - 在 Railway 项目中删除旧的构建缓存
   - 强制重新构建：点击"Trigger Deploy"

### 方案 B: 使用自定义 Dockerfile（如果 Nixpacks 失败）

1. **前端服务**
   - 在 Railway 项目设置中：
     - Dockerfile 路径：`Dockerfile.railway`
     - 构建命令：留空（使用 Dockerfile 中的命令）
     - 启动命令：`npm start`

2. **后端服务**
   - 在 Railway 项目设置中：
     - Dockerfile 路径：`backend/Dockerfile.railway`
     - 构建命令：留空（使用 Dockerfile 中的命令）
     - 启动命令：`npm start`

## 🔐 安全建议

- ❌ 不要将 API 密钥提交到 Git 仓库
- ✅ 在 Railway 控制面板中设置所有敏感信息
- ✅ 使用强密码保护数据库
- ✅ 定期轮换 API 密钥

## ✅ 验证部署

部署完成后，检查以下内容：

```bash
# 前端健康检查
curl https://your-frontend-url

# 后端 API 状态
curl https://your-backend-url/api/v1/health
```

## 📝 常见问题

### 1. npm ci 命令报错 (EUSAGE)
**症状**: `npm 错误代码 EUSAGE`

**原因**: Railway Nixpacks 未正确读取环境变量

**解决方案**:
- ✅ 确保 `.npmrc` 文件在仓库中（已配置 `omit=dev`）
- ✅ 删除 Railway 缓存：点击项目设置 → 清除构建缓存
- ✅ 强制重新构建：点击"Trigger Deploy"
- ✅ 或使用自定义 Dockerfile 方案（Dockerfile.railway）

### 2. 包版本找不到
**症状**: `notarget 找不到与 @types/react-grid-layout 匹配的版本`

**解决方案**:
- 检查 `package.json` 中的版本号
- 确保版本在 npm 注册表中存在
- 更新为稳定版本（已修复为 1.3.5）

## 🔗 相关链接

- [Railway 官方文档](https://railway.app)
- [Next.js 环境变量](https://nextjs.org/docs/basic-features/environment-variables)
- [Fastify 部署指南](https://www.fastify.io/docs/latest/Deployment/)
