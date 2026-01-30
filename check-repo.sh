#!/bin/bash

echo "🔍 HelloYan GitHub 仓库检查工具"
echo "================================"
echo ""

# 检查必需文件
echo "✓ 检查必需文件..."

check_file() {
    if [ -f "$1" ]; then
        echo "  ✓ $1"
    else
        echo "  ✗ $1 (缺失)"
    fi
}

# 前端文件
check_file "package.json"
check_file "package-lock.json"
check_file "next.config.js"
check_file "tailwind.config.js"
check_file "postcss.config.js"
check_file ".nvmrc"
check_file "README.md"
check_file "DEPLOYMENT.md"

# 关键前端文件
check_file "app/layout.js"
check_file "app/page.tsx"
check_file "app/globals.css"
check_file "app/admin/page.js"
check_file "app/components/providers.tsx"
check_file "app/components/ui/skeleton.tsx"
check_file "app/lib/api.ts"
check_file "app/lib/react-query.tsx"
check_file "app/lib/types.ts"
check_file "app/lib/utils.ts"
check_file "app/lib/hooks/useApi.ts"

# 后端文件
check_file "backend/package.json"
check_file "backend/tsconfig.json"
check_file "backend/prisma/schema.prisma"
check_file "backend/Dockerfile"
check_file "backend/railway.toml"
check_file "backend/src/index.ts"

# 检查 Git 状态
echo ""
echo "✓ Git 状态..."
if [ -d ".git" ]; then
    echo "  ✓ .git 目录存在"
    echo "  当前分支: $(git branch --show-current)"
    echo "  最近提交:"
    git log --oneline -3 | sed 's/^/    /'
else
    echo "  ✗ .git 目录不存在（不是 Git 仓库）"
fi

# 检查 .gitignore
echo ""
echo "✓ .gitignore 检查..."
if [ -f ".gitignore" ]; then
    if grep -q "node_modules" .gitignore; then
        echo "  ✓ node_modules 已忽略"
    else
        echo "  ✗ node_modules 未忽略"
    fi
    if grep -q ".next" .gitignore; then
        echo "  ✓ .next 已忽略"
    else
        echo "  ✗ .next 未忽略"
    fi
    if grep -q ".env.local" .gitignore; then
        echo "  ✓ .env.local 已忽略"
    else
        echo "  ✗ .env.local 未忽略"
    fi
else
    echo "  ✗ .gitignore 文件不存在"
fi

echo ""
echo "================================"
echo "检查完成！"
echo ""
echo "如果所有项目都显示 ✓，说明文件完整。"
echo "如果显示 ✗，请检查对应文件。"
