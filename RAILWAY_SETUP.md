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

1. **创建 PostgreSQL 和 Redis 插件**
   - 在 Railway 控制面板添加 PostgreSQL 数据库
   - 添加 Redis 缓存服务
   - 复制自动生成的 `DATABASE_URL` 和 `REDIS_URL`

2. **配置前端服务**
   - 部署分支：`main`
   - 环境变量：参考上面的前端环境变量
   - 构建命令：`npm run build`
   - 启动命令：`npm start`

3. **配置后端服务**
   - 部署分支：`main`
   - 环境变量：参考上面的后端环境变量
   - 构建命令：`npm run build`
   - 启动命令：`npm start`

4. **配置域名 (可选)**
   - 在 Railway 项目中生成公共域名
   - 更新前端的 `NEXT_PUBLIC_API_BASE_URL` 为后端的 Railway URL

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

### 1. 前端无法连接后端
- 检查 `NEXT_PUBLIC_API_BASE_URL` 是否指向正确的后端 URL
- 确保后端已成功启动

### 2. 数据库连接错误
- 验证 `DATABASE_URL` 格式正确
- 确保 PostgreSQL 插件已创建
- 检查网络连接权限

### 3. Redis 连接错误
- 验证 `REDIS_URL` 格式正确
- 确保 Redis 插件已创建
- 检查连接超时设置

## 🔗 相关链接

- [Railway 官方文档](https://railway.app)
- [Next.js 环境变量](https://nextjs.org/docs/basic-features/environment-variables)
- [Fastify 部署指南](https://www.fastify.io/docs/latest/Deployment/)
