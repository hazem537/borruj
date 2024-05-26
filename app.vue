<template>
  <div class="main bg-contain w-full  bg-opacity-50" dir="rtl">

      <NuxtPage/>
  </div>
</template>

<script setup lang="ts">


</script>

<style scoped >
.main::before{
  @apply bg-[url('/pattern_bg.png')]
}
</style>