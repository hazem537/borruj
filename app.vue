<template>
  <div
    class="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300"
    :dir="dir"
    :lang="lang"
  >
    <div class="main-pattern min-h-screen flex flex-col">
      <!-- Fixed Navigation Bar -->
      <Nav class="fixed top-3 left-0 right-0 max-w-7xl mx-auto px-3 sm:px-4 z-50" id="nav" />

      <!-- Main App Content -->
      <main class="flex-grow pt-24">
        <!-- Persistent Legal Identification Banner (Article 18 Requirement) -->
        <LegalBanner class="mb-6" />
        <NuxtPage />
      </main>

      <!-- Floating 24/7 Support and Complaints widget (Article 18 - Paragraph 9 Requirement) -->
      <Support247Badge />
    </div>
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { useAppLang } from "~/composables/useAppLang";

const { dir, lang } = useAppLang();

useHead({
  htmlAttrs: {
    dir: () => dir.value,
    lang: () => lang.value,
  },
});
</script>

<style scoped>
.main-pattern {
  background-image: radial-gradient(rgba(245, 158, 11, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
}
</style>
