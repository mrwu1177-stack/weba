# Railway 部署指南 - HelloYan 项目

## 部署步骤

### 1. 预备工作

确保以下文件存在且正确配置：
- ✅ `railway.toml` - 部署配置文件
- ✅ `Dockerfile.railway` - 生产环境 Dockerfile
- ✅ `package.json` - 依赖和脚本定义
- ✅ `.npmrc` - NPM 配置文件

### 2. 环境变量配置

在 Railway 项目中设置以下环境变量：

```bash
# 可选：Node 环境
NODE_ENV=production

# 可选：日志级别
LOG_LEVEL=info

# API 相关（如需要）
API_URL=https://api.example.com
```

### 3. 部署流程

#### 方式 A：通过 Railway CLI

```bash
# 1. 安装 Railway CLI
npm install -g @railway/cli

# 2. 登录
railway login

# 3. 创建新项目（首次）
railway init

# 4. 部署
railway up
```

#### 方式 B：GitHub 连接（推荐）

1. 在 [Railway 控制面板](https://railway.app) 创建新项目
2. 选择 "Deploy from GitHub"
3. 授权并选择 `mrwu1177-stack/weba` 仓库
4. 配置环境变量
5. 点击 "Deploy"

### 4. 验证部署

部署完成后，检查：

```bash
# 查看部署日志
railway logs

# 获取应用 URL
railway env

# 测试应用健康状态
curl https://<your-app>.up.railway.app/
```

## 故障排除

### 错误：`build.builder: 输入无效`

**原因**：railway.toml 配置格式错误或 builder 设置不正确

**解决方案**：
1. 验证 `railway.toml` 中 `builder = "DOCKER"` 是否存在
2. 检查 `dockerfile` 路径是否正确：`Dockerfile.railway`
3. 确保 Dockerfile 语法正确

### 错误：`npm install 失败`

**原因**：依赖版本冲突或网络问题

**解决方案**：
1. 在 `package.json` 中使用 `--legacy-peer-deps` 标志
2. 检查 `.npmrc` 配置
3. 清除 npm 缓存：`npm cache clean --force`

### 应用无法启动

**原因**：启动命令错误或依赖缺失

**解决方案**：
1. 检查 `package.json` 中 `"start"` 脚本
2. 验证所有关键文件（`next.config.js` 等）都已包含
3. 检查 Dockerfile 中是否复制了所有必要文件

## 性能优化

### Docker 镜像优化

```dockerfile
# 使用分层缓存
FROM node:18-alpine AS dependencies
# ... 缓存依赖层

FROM node:18-alpine AS builder
# ... 缓存构建层

FROM node:18-alpine
# ... 最小化运行时镜像
```

### Next.js 优化

1. 启用静态生成 (SSG)
2. 启用增量静态再生成 (ISR)
3. 优化图片加载
4. 启用 GZip 压缩

## 监控与日志

### 查看实时日志

```bash
railway logs -f
```

### 环境诊断

```bash
railway status
railway list
```

## 回滚部署

如果需要回滚到之前的版本：

```bash
# 在 Railway 控制面板中
1. 进入 Deployments 标签
2. 选择之前的部署
3. 点击 "Redeploy"
```

## 成本管理

- Railway 免费额度：$5/月
- 监控使用情况在 [Railway 控制面板](https://railway.app)
- 设置支出警报防止超支

## 支持资源

- [Railway 官方文档](https://docs.railway.app)
- [Next.js 部署指南](https://nextjs.org/docs/deployment/railway)
- [项目 GitHub](https://github.com/mrwu1177-stack/weba)
