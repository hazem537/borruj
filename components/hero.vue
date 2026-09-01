<template>
  <section class="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden rounded-b-3xl shadow-2xl">
    <!-- Slideshow Background Images -->
    <div class="absolute inset-0 z-0 overflow-hidden">
      <div
        v-for="(img, index) in images"
        :key="index"
        class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 transform scale-105 ease-in-out"
        :style="{ backgroundImage: `url(${img})` }"
        :class="[
          index === activeIndex ? 'opacity-100' : 'opacity-0',
          index === activeIndex ? 'animate-subtle-zoom' : ''
        ]"
      ></div>

      <!-- Gradient Overlays for Light/Dark Mode -->
      <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/60 to-stone-950/70 dark:from-stone-950 dark:via-stone-950/70 dark:to-stone-950/80"></div>
      <div class="absolute inset-0 bg-amber-500/5 mix-blend-overlay"></div>
    </div>

    <!-- Content Container -->
    <div class="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center flex flex-col items-center justify-center gap-6 text-white">
      <!-- Dynamic Announcement Pill / Offer -->
      <Transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div
          v-if="content.hero.showOffer && offerText"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs md:text-sm font-medium shadow-lg hover:bg-amber-500/30 transition-all cursor-default"
        >
          <span class="flex h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>{{ offerText }}</span>
        </div>
      </Transition>

      <!-- Badge Text -->
      <div v-if="badgeText" class="text-xs md:text-sm tracking-wider uppercase text-amber-400/90 font-semibold">
        {{ badgeText }}
      </div>

      <!-- Main Title -->
      <div class="space-y-4 my-2">
        <h2 class="text-xl md:text-3xl font-light text-stone-200">
          {{ welcomePrefix }}
        </h2>
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-amber-400 drop-shadow-md tracking-normal">
          <span class="hero-title-text">{{ brandName }}</span>
        </h1>
      </div>

      <!-- Subtitle -->
      <p class="max-w-2xl text-base md:text-xl text-stone-300 leading-relaxed font-normal">
        {{ subtitle }}
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-4 mt-4">
        <ULink
          to="/#contactUs"
          class="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm md:text-base shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <UIcon name="i-mdi-calendar-check" class="w-5 h-5" />
          <span>{{ t.hero.bookNow }}</span>
        </ULink>

        <ULink
          to="/#hotels"
          class="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-sm md:text-base hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <UIcon name="i-mdi-domain" class="w-5 h-5 text-amber-400" />
          <span>{{ t.hero.exploreServices }}</span>
        </ULink>
      </div>

      <!-- Image Indicator Dots -->
      <div class="flex items-center gap-2 mt-6">
        <button
          v-for="(_, idx) in images"
          :key="idx"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="idx === activeIndex ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/40 hover:bg-white/70'"
          @click="activeIndex = idx"
          :aria-label="`Slide ${idx + 1}`"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useCmsContent } from "~/composables/useCmsContent";
import { useAppLang } from "~/composables/useAppLang";

const { content } = useCmsContent();
const { isEn, t } = useAppLang();

const welcomePrefix = computed(() => {
  return isEn.value ? (content.value.hero?.welcomePrefixEn || content.value.hero?.welcomePrefix) : content.value.hero?.welcomePrefix;
});

const brandName = computed(() => {
  return isEn.value ? (content.value.hero?.brandNameEn || content.value.hero?.brandName) : content.value.hero?.brandName;
});

const subtitle = computed(() => {
  return isEn.value ? (content.value.hero?.subtitleEn || content.value.hero?.subtitle) : content.value.hero?.subtitle;
});

const badgeText = computed(() => {
  return isEn.value ? (content.value.hero?.badgeTextEn || content.value.hero?.badgeText) : content.value.hero?.badgeText;
});

const offerText = computed(() => {
  return isEn.value ? (content.value.hero?.offerTextEn || content.value.hero?.offerText) : content.value.hero?.offerText;
});

const defaultImages = [
  "/9.jpeg",
  "/10.jpeg",
  "/11.jpeg",
  "/13.jpeg",
  "/14.jpeg",
  "/15.jpeg",
  "/16.jpeg",
  "/17.jpeg",
  "/18.jpeg",
  "/19.jpeg",
  "/test/1.jpeg",
  "/test/2.jpeg",
  "/test/3.jpeg",
  "/test/4.jpeg",
  "/test/5.jpeg",
  "/test/6.jpeg",
  "/test/7.jpeg",
  "/test/8.jpeg",
  "/test/20.jpeg",
];

const images = computed(() => {
  if (content.value?.hero?.images && content.value.hero.images.length > 0) {
    return content.value.hero.images;
  }
  return defaultImages;
});

const activeIndex = ref(0);
let timer: any = null;

const startAnimation = () => {
  timer = setInterval(() => {
    if (images.value.length > 0) {
      activeIndex.value = (activeIndex.value + 1) % images.value.length;
    }
  }, 4000);
};

onMounted(() => {
  startAnimation();
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.hero-title-text {
  display: inline-block;
  padding-top: 0.1em;
  padding-bottom: 0.25em;
  line-height: 1.35;
  overflow: visible;
}

@keyframes subtleZoom {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.08);
  }
}

.animate-subtle-zoom {
  animation: subtleZoom 6s ease-out forwards;
}
</style>
