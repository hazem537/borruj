<template>
  <div class="main bg-contain  h-full" dir="rtl">
    <div class="dark:bg-black/70 bg-white/70 ">
    <Nav class=" w-full mx-auto py-2  fixed  mt-3  top-0 left-0 z-50" id="nav" />
      <NuxtPage />
    </div>
  </div>
  <UNotifications />
</template>

<script setup lang="ts">

</script>

<style scoped>
.main {
  background-image: url("/public/pattern_bg.png");
}
</style>
