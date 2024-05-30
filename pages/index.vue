<template>
  <Nav class="w-full mx-auto py-2  fixed  mt-3  top-0 z-50" id="nav" />
  <div
    class="text-stone-900 dark:text-stone-200 font-semibold flex flex-col gap-3   snap-mandatory "
    id="container">
    <Hero class="w-full h-screen snap-end" id="hero" />
    <AboutUs  class="w-full h-screen snap-start" id="aboutUs"/>
    <Servise class="w-full h-screen snap-start " id="servise" />
    <ContactUs  class="w-full h-screen snap-start" id="contactUs"/>
    <Footer class="w-full snap-start " id="footer" />
  </div>
</template>

<script lang="ts" setup>
// import Hero from '~/components/hero.vue';
</script>

<style></style>
