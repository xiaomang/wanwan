<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

const is404 = computed(() => props.error.statusCode === 404)

useHead({
  title: () => is404.value ? '页面未找到' : '出错了',
})
</script>

<template>
  <div class="error-page">
    <div class="error-card">
      <div class="error-code">{{ error.statusCode }}</div>
      <h1 class="error-title">
        {{ is404 ? '页面走丢了' : '出错了' }}
      </h1>
      <p class="error-desc">
        {{ is404 ? '抱歉，您访问的页面不存在或已被移除。' : (error.message || '发生了未知错误，请稍后再试。') }}
      </p>
      <div class="error-actions">
        <NuxtLink to="/" class="btn btn-primary">返回首页</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f0f4ff 0%, #fdf2f8 100%);
}

.error-card {
  text-align: center;
  max-width: 460px;
  padding: 3rem 2.5rem;
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.error-code {
  font-size: clamp(4rem, 12vw, 6rem);
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  letter-spacing: -0.05em;
}

.error-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 0.75rem;
}

.error-desc {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin: 0 0 2rem;
  line-height: 1.7;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>
