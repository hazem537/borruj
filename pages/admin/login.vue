<template>
  <div class="">
    <Login class="h-screen flex justify-center items-center  " />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware:['login']
})
</script>

<style>

</style>