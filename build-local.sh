#!/usr/bin/env bash
# ==============================================
# 本地 / CI 构建脚本
# 在高配机器上执行 nuxt build，将 .output 提交进 git
# 之后服务器 deploy.sh 只需 git pull + docker run（零构建）
# ==============================================
set -euo pipefail

log()  { echo -e "\033[1;36m[build]\033[0m $*"; }
ok()   { echo -e "\033[1;32m  ✓\033[0m $*"; }
warn() { echo -e "\033[1;33m  ⚠\033[0m $*"; }
err()  { echo -e "\033[1;31m  ✗\033[0m $*" >&2; }
trap 'err "构建失败，退出码: $?"' ERR

NODE_ENV=production
export NODE_ENV

log "清理旧产物..."
rm -rf .output .nuxt .nitro

log "安装依赖..."
npm ci --no-audit --no-fund
ok "依赖安装完成"

log "构建 Nitro 产物..."
npm run build
ok "构建完成"

# 检查产物存在
if [ ! -f .output/server/index.mjs ]; then
  err ".output/server/index.mjs 不存在，构建疑似不完整"
  exit 1
fi

OUTPUT_SIZE=$(du -sh .output | awk '{print $1}')
ok "产物大小: $OUTPUT_SIZE"

# 询问是否提交
if [ "${CI:-}" = "true" ]; then
  log "CI 模式，自动提交 .output..."
else
  echo ""
  warn "请在合适的时机手动执行："
  echo "  git add .output"
  echo "  git commit -m 'chore: update build artifacts'"
  echo "  git push"
fi
