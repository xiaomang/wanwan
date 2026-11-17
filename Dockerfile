# ==============================================
# 服务器极简运行镜像 —— 不含 npm / 构建工具
# 使用前先在本地或 CI 执行 build-local.sh
# ==============================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    NODE_OPTIONS="--max-old-space-size=256"

# 只需要 .output，Nitro 已将所有运行时依赖 bundle 进去
COPY .output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
