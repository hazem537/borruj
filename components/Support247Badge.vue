<template>
  <div
    class="fixed bottom-5 z-40 flex flex-col gap-2"
    :class="isEn ? 'right-5 items-end' : 'left-5 items-start'"
  >
    <!-- Collapsible Quick Support Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-3 scale-95"
    >
      <div
        v-if="isOpen"
        class="glass-panel p-4 rounded-2xl shadow-2xl border border-amber-500/30 w-72 max-w-[calc(100vw-2.5rem)] space-y-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl text-start"
      >
        <div class="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs font-bold text-stone-900 dark:text-stone-100">{{ t.supportBadge.title }}</span>
          </div>
          <UButton
            size="2xs"
            color="gray"
            variant="ghost"
            icon="i-mdi-close"
            class="rounded-full"
            @click="isOpen = false"
          />
        </div>

        <p class="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
          {{ t.supportBadge.desc }}
        </p>

        <div class="space-y-2">
          <!-- WhatsApp 24/7 -->
          <a
            :href="`https://wa.me/${content.support.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(isEn ? 'Hello, I would like to make an inquiry / request' : 'السلام عليكم، أود تقديم استفسار / شكوى / طلب حجز')}`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition-all"
          >
            <UIcon name="i-mdi-whatsapp" class="w-5 h-5 text-emerald-500 shrink-0" />
            <div class="flex flex-col text-start">
              <span>{{ t.supportBadge.chatWhatsapp }}</span>
              <span class="text-[10px] text-stone-500 font-mono" dir="ltr">{{ content.support.whatsapp }}</span>
            </div>
          </a>

          <!-- Phone Direct 24/7 -->
          <a
            :href="`tel:${content.support.phone}`"
            class="flex items-center gap-2.5 p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-500/20 transition-all"
          >
            <UIcon name="i-mdi-phone" class="w-5 h-5 text-amber-500 shrink-0" />
            <div class="flex flex-col text-start">
              <span>{{ t.supportBadge.callDirect }}</span>
              <span class="text-[10px] text-stone-500 font-mono" dir="ltr">{{ content.support.phone }}</span>
            </div>
          </a>

          <!-- Submit Ticket / Complaint Form -->
          <ULink
            to="/#contactUs"
            class="flex items-center justify-between p-2 rounded-xl bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-all"
            @click="isOpen = false"
          >
            <span class="flex items-center gap-1.5">
              <UIcon name="i-mdi-email-edit-outline" class="w-4 h-4 text-amber-500" />
              <span>{{ t.supportBadge.submitTicket }}</span>
            </span>
            <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" class="w-4 h-4 text-stone-400" />
          </ULink>
        </div>

        <div class="pt-2 border-t border-stone-200 dark:border-stone-800 text-[10px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
          <span>{{ t.supportBadge.slaNotice }}</span>
          <span class="font-mono text-emerald-600 dark:text-emerald-400">#{{ content.legal.licenseNumber }}</span>
        </div>
      </div>
    </Transition>

    <!-- Floating Main Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-2 border-white/20 group"
      :aria-label="t.supportBadge.title"
    >
      <span class="relative flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
      </span>
      <UIcon name="i-mdi-headset" class="w-4 h-4 group-hover:rotate-12 transition-transform" />
      <span class="hidden sm:inline">{{ t.supportBadge.title }}</span>
      <span class="sm:hidden">{{ t.supportBadge.shortLabel }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCmsContent } from "~/composables/useCmsContent";
import { useAppLang } from "~/composables/useAppLang";

const { content } = useCmsContent();
const { isEn, t } = useAppLang();
const isOpen = ref(false);
</script>
