<script setup lang="ts">
</script>

<template>
  <main class="home-view">
    <section class="hero">
      <h1>Benvenuto nel nostro Shop</h1>
      <p>Scopri i migliori prodotti a prezzi incredibili</p>
    </section>
  </main>
</template>

<style scoped lang="scss">
.home-view {
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--hero-bg, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
  border-radius: 1rem;
  color: white;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    font-size: 1.25rem;
    opacity: 0.9;
  }
}
</style>

