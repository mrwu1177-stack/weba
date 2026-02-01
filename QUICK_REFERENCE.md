# 🚀 快速参考 - HelloYan 部署和开发

## 📦 快速命令

### 本地开发
```bash
# 安装依赖
npm install

# 开发模式启动
npm run dev

# 构建生产版本
npm run build

# 生产模式启动
npm start
```

### Git 操作
```bash
# 查看状态
git status

# 查看最近提交
git log --oneline -5

# 推送到 GitHub
git push origin main

# 拉取最新更改
git pull origin main
```

### Docker 操作
```bash
# 构建 Docker 镜像
docker build -f Dockerfile.railway -t weba:latest .

# 运行 Docker 容器
docker run -p 3000:3000 weba:latest

# 查看 Docker 日志
docker logs <container_id>
```

### Railway 操作
```bash
# 登录 Railway
railway login

# 查看日志
railway logs -f

# 部署应用
railway up

# 查看应用状态
railway status

# 获取环境变量
railway env
```

---

## 🎯 当前版本信息

| 项目 | 版本 | 状态 |
|------|------|------|
| Next.js | 15.5.11 | ✅ |
| React | 18.3.1 | ✅ |
| TypeScript | 5.7.2 | ✅ |
| Tailwind CSS | 3.4.17 | ✅ |
| Node.js | 18-alpine | ✅ |
| 部署平台 | Railway | ✅ |

---

## 📂 核心文件位置

| 文件 | 位置 | 说明 |
|------|------|------|
| 主页 | `app/page.tsx` | 仪表板主界面 |
| 导航 | `app/components/layout/DashboardHeader.tsx` | 顶部导航栏 |
| 市场统计 | `app/components/dashboard/MarketStats.tsx` | 统计数据卡片 |
| 清算监控 | `app/components/dashboard/LiquidationMonitor.tsx` | 清算数据表 |
| 策略面板 | `app/components/dashboard/StrategyPanel.tsx` | 交易信号 |
| 全局样式 | `app/globals.css` | CSS 变量和工具类 |
| Tailwind 配置 | `tailwind.config.js` | 颜色和主题配置 |
| Railway 配置 | `railway.toml` | 部署配置 |
| Docker 配置 | `Dockerfile.railway` | 生产环境镜像 |
| 部署指南 | `RAILWAY_DEPLOYMENT_GUIDE.md` | 详细部署说明 |

---

## 🎨 色彩参考

```
🟠 主色（琥珀）: #FBBF24 (amber-400)
🔵 辅助色（青）: #06B6D4 (cyan-500)
🟢 成功色（翠）: #10B981 (emerald-500)
⚫ 背景色（深）: #0F172A (slate-950)
🟠 强调色（橙）: #FB923C (orange-400)
```

---

## 🔗 快速链接

- 📖 [部署指南](./RAILWAY_DEPLOYMENT_GUIDE.md)
- ✅ [检查清单](./DEPLOYMENT_CHECKLIST.md)
- 📋 [项目总结](./COMPLETION_STATUS.md)
- 🐙 [GitHub 仓库](https://github.com/mrwu1177-stack/weba)
- 🚀 [Railway 控制板](https://railway.app)

---

## ⚙️ 常用环境变量

```bash
# Next.js
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com

# 日志
LOG_LEVEL=info

# 数据库（如需要）
DATABASE_URL=postgresql://user:password@host/db
```

---

## 🚨 常见问题快速解决

### Q: `npm install` 失败？
```bash
npm install --legacy-peer-deps
# 或者删除 node_modules 和 package-lock.json 重新安装
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Q: `npm run dev` 无法启动？
```bash
# 1. 清理构建缓存
rm -rf .next

# 2. 重新启动
npm run dev
```

### Q: Docker 构建失败？
```bash
# 1. 清理 Docker 缓存
docker system prune -a

# 2. 重新构建
docker build -f Dockerfile.railway -t weba:latest --no-cache .
```

### Q: Railway 部署错误？
1. 查看日志：`railway logs -f`
2. 检查 railway.toml 格式
3. 验证环境变量设置
4. 确保 PORT 变量未被覆盖

---

## 📊 API 端点参考

| 端点 | 说明 | 状态 |
|------|------|------|
| `/api/proxy/aggregated` | 聚合市场数据 | 🔧 需要集成 |
| `/api/monitoring/api-status` | API 状态监控 | 🔧 需要集成 |
| `/api/database` | 数据库操作 | 🔧 需要集成 |
| `/api/config` | 应用配置 | 🔧 需要集成 |

---

## 🔐 安全检查清单

- [ ] 敏感信息已移至环境变量
- [ ] .env 文件已添加到 .gitignore
- [ ] API 密钥已保护
- [ ] CORS 配置正确
- [ ] 输入验证已实现
- [ ] 错误消息不暴露敏感信息

---

## 📈 性能优化清单

- [x] Docker 多阶段构建优化
- [x] npm 依赖缓存优化
- [ ] Next.js 图片优化
- [ ] CSS 压缩和 tree-shaking
- [ ] 代码分割和懒加载
- [ ] 缓存策略实现

---

## 🧪 测试命令

```bash
# 类型检查
npm run type-check  # 如果配置了

# 构建测试
npm run build

# 本地启动测试
npm start

# 访问应用
# http://localhost:3000
```

---

## 📞 获取帮助

1. 📖 查看 [COMPLETION_STATUS.md](./COMPLETION_STATUS.md)
2. 📖 查看 [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md)
3. 🐙 检查 [GitHub Issues](https://github.com/mrwu1177-stack/weba/issues)
4. 🔗 参考 [Railway 文档](https://docs.railway.app)

---

## ✅ 最后检查

在部署前运行：

```bash
# 1. 检查 Git 状态
git status  # 应该是 "working tree clean"

# 2. 构建测试
npm run build  # 应该成功，无错误

# 3. 验证配置文件
# 检查 railway.toml 是否存在且格式正确
# 检查 Dockerfile.railway 是否存在

# 4. 最终推送
git push origin main
```

完成以上步骤后，您可以在 Railway 上部署应用了！🚀

---

**提示**: 本文件是快速参考。详细信息请参考完整文档。
