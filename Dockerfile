# ==============================================
# 服务器运行镜像 —— 零构建、零 npm install
# Nitro 构建时已将运行时依赖装入 .output/server/node_modules/
# 使用前先在本地或 CI 执行 build-local.sh
# ==============================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    NODE_OPTIONS="--max-old-space-size=256"

# Nitro 构建时已把运行时依赖装进了 .output/server/node_modules/
# 所以 Docker 里只需要 COPY 整个 .output，不需要再装任何东西
COPY .output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
