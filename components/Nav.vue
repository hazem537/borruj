<template>
  <div
    dir="rtl"
    class="flex flex-col md:flex-row items-center md:justify-between duration-300 transition-all bg-white/75 dark:bg-black/75 rounded-full px-2">
   

    
    <div class="flex items-center justify-center gap-5 grow ">
      <ULink to="/#container" active-class="" inactive-class="text-gray-500">
        <img src="/log.svg" class="h-20" />
      </ULink>

      <h2 class="text-amber-500 text-2xl">المميزة للسياحة</h2>
    </div>

    
    <div
      class="gap-5 justify-center grow xl:grow-0 hidden md:flex w-1/3">
      <ULink
        v-if="!user"
        active-class=""
        inactive-class="text-gray-500"
        to="/#aboutUs"
        class="hover:bg-amber-400 px-2 py-2 rounded-xl duration-300"
        >من نحن</ULink
      >

      <ULink
        v-if="!user"
        active-class=""
        inactive-class="text-gray-500"
        to="/#servise"
        class="hover:bg-amber-400 px-2 py-2 rounded-xl duration-300"
        >خدماتنا</ULink
      >
      <ULink
        v-if="!user"
        active-class=""
        inactive-class="text-gray-500"
        to="/#contactUs"
        class="hover:bg-amber-400 px-2 py-2 rounded-xl duration-300"
        >تواصل معنا</ULink
      >
      <!--
      

      <ULink
        v-if="!user"
        active-class=""
        inactive-class="text-gray-500"
        to="/admin/login"
        class="hover:bg-amber-400 px-2 py-2 rounded-xl duration-300"
        >تسجيل الدخول</ULink
      > -->
      <ULink
        v-if="user"
        active-class=""
        inactive-class="text-gray-500"
        to="/admin"
        class="hover:bg-amber-400 px-2 py-2 rounded-xl duration-300"
        >dashboadr
      </ULink>
      <ULink
        v-if="user"
        active-class=""
        inactive-class="text-gray-500"
        @click="logout"
        class="hover:bg-amber-400 px-2 py-2 rounded-xl duration-300"
        >تسجيل الخروج
      </ULink>
    </div>
    <!-- <div
      class="hidden gap-3 justify-center grow xl:grow-0 text-3xl w-1/3 md:flex">
      <div
        class="group w-[45px] h-[45px] rounded-full bg-white/55 dark:bg-black/55 flex justify-center items-center dark:hover:bg-amber-500 hover:bg-amber-500 duration-300">
        <UIcon name="i-mdi-facebook group-hover:text-black " />
      </div>
      <div
        class="group w-[45px] h-[45px] rounded-full bg-white/55 dark:bg-black/55 flex justify-center items-center dark:hover:bg-amber-500 hover:bg-amber-500 duration-300">
        <UIcon name="i-mdi-whatsapp group-hover:text-black " />
      </div>
      <div
        class="group w-[45px] h-[45px] rounded-full bg-white/55 dark:bg-black/55 flex justify-center items-center dark:hover:bg-amber-500 hover:bg-amber-500 duration-300">
        <UIcon name="i-mdi-snapchat group-hover:text-black " />
      </div>
    </div> -->


  </div>
</template>

<script setup lang="ts">
import { useCurrentUser } from "vuefire";
const user = useCurrentUser();
import { signOut } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";
const auth = useFirebaseAuth()!;
const logout = async () => {
  await signOut(auth);
  navigateTo("/admin/login");
};
</script>

<style></style>
