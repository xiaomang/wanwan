<template>
  <div class="coming-soon">
    <div class="hero">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>

      <div class="hero-content">
        <div class="badge">🚧 正在建设中</div>
        <h1 class="title">
          精彩即将
          <span class="highlight">上线</span>
        </h1>
        <p class="subtitle">
          我们正在努力打造一个有趣的平台，敬请期待～
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coming-soon {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.hero {
  text-align: center;
  position: relative;
  z-index: 1;
}

/* 装饰性模糊色块 */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  pointer-events: none;
}
.blob-1 {
  width: 320px;
  height: 320px;
  background: var(--color-primary);
  top: -120px;
  left: -140px;
  animation: float 8s ease-in-out infinite;
}
.blob-2 {
  width: 260px;
  height: 260px;
  background: var(--color-accent);
  bottom: -100px;
  right: -120px;
  animation: float 10s ease-in-out infinite reverse;
}
.blob-3 {
  width: 200px;
  height: 200px;
  background: #22d3ee;
  top: 50%;
  left: 60%;
  animation: float 12s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(30px, -20px) scale(1.1); }
}

.hero-content {
  position: relative;
  z-index: 2;
}

.badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-primary-dark);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.2;
  color: var(--color-text);
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.highlight {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  max-width: 420px;
  margin: 0 auto;
}
</style>
