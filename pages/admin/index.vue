<template>
  <div class="min-h-screen py-6 px-4">
    <Dashboard />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});

useHead({
  title: "لوحة التحكم وإدارة المحتوى - بروج المميزة للسياحة",
});
</script>
