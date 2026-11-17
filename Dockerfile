# ==============================================
# 构建阶段
# ==============================================
FROM node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm（可选，根据项目情况选择 npm / pnpm / yarn）
# RUN npm install -g pnpm

# 先复制依赖清单，利用 Docker 缓存
COPY package.json package-lock.json ./

# 安装依赖（包含 postinstall 中的 nuxt prepare）
RUN npm ci

# 复制项目源码
COPY . .

# 构建 SSR 产物到 .output/
RUN npm run build

# ==============================================
# 运行阶段
# ==============================================
FROM node:22-alpine AS runner

WORKDIR /app

# 设置生产环境变量
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# 仅从构建阶段复制必要产物
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

# 暴露端口
EXPOSE 3000

# 启动 Nitro SSR 服务
CMD ["node", ".output/server/index.mjs"]
