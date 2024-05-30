<template>
  <div class="main bg-contain w-full" dir="rtl">
    <div class="dark:bg-black/70 bg-white/70">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.main {
  background-image: url("/public/pattern_bg.png");
}
</style>
