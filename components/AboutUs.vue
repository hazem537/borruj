<template>
  <section class="w-full flex flex-col items-center" id="aboutUs">
    <div class="glass-panel w-full rounded-3xl p-6 md:p-12 shadow-xl relative overflow-hidden transition-all duration-300">
      <!-- Decorative Backdrop Element -->
      <div class="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Header Tag & Title -->
      <div class="flex flex-col items-center text-center gap-2 mb-8">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <UIcon name="i-mdi-shield-star-outline" class="w-4 h-4" />
          {{ isEn ? (content.about.badgeEn || t.about.badge) : (content.about.badge || t.about.badge) }}
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">
          {{ isEn ? (content.about.titleEn || t.about.title) : (content.about.title || t.about.title) }}
        </h2>
        <div class="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-2"></div>
      </div>

      <!-- Main Content (Rich HTML from TipTap CMS) -->
      <div class="max-w-3xl mx-auto text-stone-700 dark:text-stone-300 text-base md:text-lg leading-relaxed">
        <div class="prose-custom" v-html="aboutHtml"></div>
      </div>

      <!-- Dynamic Statistics Cards -->
      <div
        v-if="statsList.length > 0"
        class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-stone-200 dark:border-stone-800"
      >
        <div
          v-for="(stat, idx) in statsList"
          :key="idx"
          class="flex flex-col items-center text-center p-4 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 transition-colors"
        >
          <span class="text-2xl md:text-3xl font-extrabold text-amber-500 mb-1 font-mono" dir="ltr">{{ stat.value }}</span>
          <span class="text-xs md:text-sm text-stone-600 dark:text-stone-400 font-medium">
            {{ isEn ? (stat.labelEn || stat.label) : stat.label }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCmsContent } from "~/composables/useCmsContent";
import { useAppLang } from "~/composables/useAppLang";

const { content } = useCmsContent();
const { isEn, t } = useAppLang();

const aboutHtml = computed(() => {
  if (isEn.value) {
    return content.value.about?.contentHtmlEn || content.value.about?.contentHtml || "";
  }
  return content.value.about?.contentHtml || "";
});

const statsList = computed(() => {
  return content.value.about?.stats || [];
});
</script>
