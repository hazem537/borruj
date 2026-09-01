<template>
  <div class="min-h-[80vh] flex items-center justify-center py-8">
    <Login />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["login"],
});

useHead({
  title: "تسجيل دخول الإدارة - بروج المميزة للسياحة",
});
</script>
