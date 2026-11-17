<template>
  <div class="layout">
    <header class="layout-header">
      <NuxtLink to="/" class="logo">
        <span class="logo-icon">玩</span>
        <span class="logo-text">玩玩</span>
      </NuxtLink>
    </header>
    <main class="layout-main">
      <slot />
    </main>
    <footer class="layout-footer">
      <p>© {{ new Date().getFullYear() }} 玩玩 · 保留所有权利</p>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  padding: 1.25rem 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--color-text);
}
.logo:hover {
  color: var(--color-primary);
}

.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: #fff;
  font-size: 1rem;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.layout-footer {
  padding: 1.5rem 2rem;
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}
</style>
