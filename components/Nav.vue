<template>
  <div
    dir="rtl"
    class="flex flex-col md:flex-row items-center md:justify-between text-lg md:text-xl duration-300 transition-all bg-white/75 dark:bg-black/75 rounded-full px-2">
    <div class="flex items-center justify-center gap-5 grow">
      <ULink to="#container" active-class="" inactive-class="text-gray-500">
        <img src="/logo (2).svg" class="h-16 md:h-20" />
      </ULink>

      <h2>المميزة للسياحة</h2>
    </div>
    <div
      class="gap-5 justify-center grow xl:grow-0 hidden md:flex md:order-first">
      <ULink
        active-class=""
        inactive-class="text-gray-500"
        to="#footer"
        class="hover:bg-amber-400 px-4 py-2 rounded-xl duration-300"
        >تواصل معنا</ULink
      >

      <ULink
        active-class=""
        inactive-class="text-gray-500"
        to="#servise"
        class="hover:bg-amber-400 px-4 py-2 rounded-xl duration-300"
        >خدماتنا</ULink
      >
    </div>
    <div class="hidden gap-3 justify-center grow xl:grow-0 text-3xl md:flex">
      <div
        class="group w-[45px] h-[45px] rounded-full bg-white/55 dark:bg-black/55 flex justify-center items-center hover:bg-amber-500 duration-300">
        <UIcon name="i-mdi-facebook group-hover:text-black " />
      </div>
      <div
        class="group w-[45px] h-[45px] rounded-full bg-white/55 dark:bg-black/55 flex justify-center items-center hover:bg-amber-500 duration-300">
        <UIcon name="i-mdi-whatsapp group-hover:text-black " />
      </div>
      <div
        class="group w-[45px] h-[45px] rounded-full bg-white/55 dartk:bg-black/55 flex justify-center items-center hover:bg-amber-500 duration-300">
        <UIcon name="i-mdi-snapchat group-hover:text-black " />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const scroll_space = ref(0);
window.addEventListener("scroll", () => {
  scroll_space.value = window.scrollY;
});
const scrolled = computed(() => {
  return scroll_space.value > 50;
});

const links = [
  [{ label: "footer", to: "#footer" }],
  [
    {
      avatar: {
        src: "/logo.png",
        size: "2xl",
      },
      to: "#container",
    },
  ],
  [],
];
</script>

<style></style>
