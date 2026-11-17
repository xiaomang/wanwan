#!/usr/bin/env bash
set -euo pipefail

APP="wanwan"
PORT="3000"
HOST_PORT="127.0.0.1:3000"

log()  { echo -e "\033[1;36m[deploy]\033[0m $*"; }
ok()   { echo -e "\033[1;32m  ✓\033[0m $*"; }
warn() { echo -e "\033[1;33m  ⚠\033[0m $*"; }
err()  { echo -e "\033[1;31m  ✗\033[0m $*" >&2; }
trap 'err "部署失败，退出码: $?"' ERR

# 检查依赖
for cmd in git docker; do
  if ! command -v $cmd &>/dev/null; then
    err "未找到命令 '$cmd'，请先安装"
    exit 1
  fi
done

log "拉取最新代码..."
git pull
ok "代码已更新"

# 停掉并删除旧容器（如果存在）
if docker ps -a --format '{{.Names}}' | grep -qx "$APP"; then
  log "停止旧容器 '$APP'..."
  docker rm -f "$APP" >/dev/null
  ok "旧容器已清理"
else
  warn "没有旧容器，跳过清理"
fi

# 删除旧镜像（如果存在且没被其他容器使用）
OLD_IMAGE=$(docker images --format '{{.Repository}}:{{.Tag}}' | grep -x "${APP}:latest" || true)
if [ -n "$OLD_IMAGE" ]; then
  log "删除旧镜像..."
  docker rmi "$OLD_IMAGE" >/dev/null 2>&1 || warn "旧镜像被占用，跳过删除"
fi

log "构建镜像..."
docker build -t "$APP" .
ok "镜像构建完成"

log "启动容器..."
docker run -d \
  --name "$APP" \
  --restart unless-stopped \
  -p "${HOST_PORT}:${PORT}" \
  --log-opt max-size=10m \
  "$APP"
ok "容器已启动"

# 简单健康检查
sleep 2
if docker ps --format '{{.Names}}' | grep -qx "$APP"; then
  ok "服务运行中 → http://${HOST_PORT}"
  docker logs --tail 5 "$APP" || true
else
  err "容器启动后立即退出了，查看日志："
  docker logs "$APP" || true
  exit 1
fi
