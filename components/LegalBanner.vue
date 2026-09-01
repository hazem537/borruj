<template>
  <aside aria-label="Statutory Establishment Identification" class="w-full bg-amber-500/10 dark:bg-amber-950/40 border-y border-amber-500/20 py-2 px-4 text-stone-800 dark:text-stone-200 text-xs">
    <div class="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
      <!-- Legal entity name & CR -->
      <div class="flex flex-wrap items-center gap-2 sm:gap-4">
        <span class="inline-flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
          <UIcon name="i-mdi-shield-check" class="w-4 h-4" />
          <span>{{ isEn ? (content.legal.tradeNameEn || content.legal.tradeName) : content.legal.tradeName }}</span>
        </span>
        <span class="text-stone-400 dark:text-stone-600 hidden sm:inline">|</span>
        <span class="inline-flex items-center gap-1">
          <span class="text-stone-500 dark:text-stone-400">{{ t.legal.crLabel }}</span>
          <span class="font-mono font-semibold" dir="ltr">{{ content.legal.crNumber }}</span>
        </span>
        <span class="text-stone-400 dark:text-stone-600 hidden sm:inline">|</span>
        <span class="inline-flex items-center gap-1">
          <span class="text-stone-500 dark:text-stone-400">{{ t.legal.licenseLabel }}</span>
          <span class="font-mono font-semibold text-emerald-600 dark:text-emerald-400" dir="ltr">{{ content.legal.licenseNumber }}</span>
        </span>
      </div>

      <!-- License category & 24/7 support badge -->
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-medium">
          <UIcon name="i-mdi-tag-outline" class="w-3 h-3 text-amber-500" />
          <span>{{ t.legal.categoryLabel }} {{ isEn ? (content.legal.licenseCategoryEn || content.legal.licenseCategory) : content.legal.licenseCategory }}</span>
        </span>
        <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{{ t.legal.support247 }}</span>
        </span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useCmsContent } from "~/composables/useCmsContent";
import { useAppLang } from "~/composables/useAppLang";

const { content } = useCmsContent();
const { isEn, t } = useAppLang();
</script>
