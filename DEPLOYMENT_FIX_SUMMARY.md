# 修复 npm 警告

## 问题描述
```
npm warn config production Use `--omit=dev` instead.
```

## 解决方案
创建了 `.npmrc` 配置文件来配置 npm 的安装行为，使用新的 `--omit=dev` 标志。

## 更改的文件
- **新增文件**: `.npmrc`

## 文件内容
```ini
# NPM Configuration
# Disable deprecation warnings
omit=dev
legacy-peer-deps=false
strict-peer-deps=true
```

## 需要更新的仓库文件
只需将 `.npmrc` 文件上传到 GitHub 仓库即可。

## 更新步骤
```bash
git pull
# .npmrc 文件已经在本地提交
git push
```

## Railway 部署说明
Railway 会自动检测并应用 `.npmrc` 配置，消除警告信息。
