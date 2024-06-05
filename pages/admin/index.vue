<template>
  <div  class="h-screen flex justify-center pt-[150px]">
    <Dashboard  class="w-10/12"/>

  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware:['auth']
})
</script>

<style>

</style>