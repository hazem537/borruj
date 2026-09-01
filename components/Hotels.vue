<template>
  <section class="w-full flex flex-col items-center" id="hotels">
    <div class="glass-panel w-full rounded-3xl p-6 md:p-12 shadow-xl relative overflow-hidden transition-all duration-300">
      <!-- Section Header (Bilingual) -->
      <div class="flex flex-col items-center text-center gap-2 mb-10">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <UIcon name="i-mdi-shield-check-outline" class="w-4 h-4" />
          {{ isEn ? (content.hotelsServices.badgeEn || t.hotels.badge) : (content.hotelsServices.badge || t.hotels.badge) }}
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
          {{ isEn ? (content.hotelsServices.titleEn || t.hotels.title) : (content.hotelsServices.title || t.hotels.title) }}
        </h2>
        <p class="text-stone-600 dark:text-stone-400 max-w-2xl text-sm md:text-base mt-1">
          {{ isEn ? (content.hotelsServices.subtitleEn || t.hotels.subtitle) : (content.hotelsServices.subtitle || t.hotels.subtitle) }}
        </p>
        <div class="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-2"></div>
      </div>

      <!-- Rich Intro Content if provided -->
      <div
        v-if="introHtml"
        class="max-w-3xl mx-auto mb-8 text-stone-700 dark:text-stone-300 leading-relaxed text-center prose-custom text-sm md:text-base"
        v-html="introHtml"
      ></div>

      <!-- Services & Hospitality Features Grid -->
      <div v-if="featuresList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div
          v-for="(feature, idx) in featuresList"
          :key="idx"
          class="flex items-start gap-3 p-4 rounded-2xl bg-white/70 dark:bg-stone-900/70 border border-amber-500/20 hover:border-amber-500/50 hover:shadow-md transition-all group"
        >
          <div class="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <UIcon name="i-mdi-check-decagram" class="w-5 h-5 text-amber-500" />
          </div>
          <span class="text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
            {{ feature }}
          </span>
        </div>
      </div>

      <!-- Hotels Grid with Pure Presentation Card (No Card Footer / No Card WhatsApp Button) -->
      <div v-if="paginatedHotels.length > 0" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="(hotel, idx) in paginatedHotels"
            :key="hotel.id || idx"
            class="rounded-2xl overflow-hidden bg-white/85 dark:bg-stone-900/85 border border-stone-200 dark:border-stone-800 shadow-md hover:shadow-xl hover:border-amber-500/40 transition-all group flex flex-col"
          >
            <!-- Image & City Badge / Google Maps Link -->
            <div class="relative h-56 overflow-hidden bg-stone-200 dark:bg-stone-800">
              <img
                v-if="hotel.image"
                :src="hotel.image"
                :alt="isEn ? (hotel.nameEn || hotel.name) : hotel.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-amber-500">
                <UIcon name="i-mdi-office-building" class="w-12 h-12" />
              </div>

              <!-- Clickable Google Map Location Badge if available, else static city badge -->
              <a
                v-if="hotel.googleMapsUrl"
                :href="hotel.googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-stone-950/85 hover:bg-amber-500 hover:text-stone-950 text-white backdrop-blur-sm transition-all flex items-center gap-1 shadow-md group/map z-10"
                :title="isEn ? 'Open location on Google Maps' : 'فتح الموقع على خرائط جوجل'"
              >
                <UIcon name="i-mdi-google-maps" class="w-3.5 h-3.5 text-amber-400 group-hover/map:text-stone-950" />
                <span>{{ isEn ? (hotel.cityEn || hotel.city) : hotel.city }}</span>
                <UIcon name="i-mdi-open-in-new" class="w-3 h-3 opacity-70" />
              </a>
              <span
                v-else-if="hotel.city"
                class="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-stone-950/80 text-white backdrop-blur-sm"
              >
                📍 {{ isEn ? (hotel.cityEn || hotel.city) : hotel.city }}
              </span>
            </div>

            <!-- Content Body -->
            <div class="p-6 space-y-3 flex-1 flex flex-col">
              <!-- Ministry Permit Badge -->
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold w-fit">
                  <UIcon name="i-mdi-certificate-outline" class="w-4 h-4 text-emerald-500" />
                  <span>{{ t.hotels.permitLabel }} {{ hotel.permitNumber }}</span>
                </div>
              </div>

              <h3 class="text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-500 transition-colors">
                {{ isEn ? (hotel.nameEn || hotel.name) : hotel.name }}
              </h3>

              <p class="text-xs md:text-sm text-stone-600 dark:text-stone-400 leading-relaxed flex-1">
                {{ isEn ? (hotel.descriptionEn || hotel.description) : hotel.description }}
              </p>

              <a
                v-if="hotel.googleMapsUrl"
                :href="hotel.googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full mt-2 px-4 py-2.5 rounded-full border-2 border-amber-500/60 bg-amber-500/10 hover:bg-amber-500 hover:border-amber-500 text-amber-700 dark:text-amber-300 hover:text-stone-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-amber-500/20"
              >
                <UIcon name="i-mdi-google-maps" class="w-5 h-5" />
                <span>{{ t.hotels.viewOnMap }}</span>
              </a>
            </div>
          </article>
        </div>

        <!-- Pagination Controls (if total hotels > perPage) -->
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-4 border-t border-stone-200 dark:border-stone-800">
          <UButton
            size="sm"
            color="gray"
            variant="ghost"
            :disabled="currentPage === 1"
            :icon="isEn ? 'i-mdi-chevron-left' : 'i-mdi-chevron-right'"
            @click="currentPage--"
            class="rounded-xl font-bold"
          >
            {{ isEn ? 'Previous' : 'السابق' }}
          </UButton>

          <div class="flex items-center gap-1">
            <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              @click="currentPage = page"
              class="w-9 h-9 rounded-xl text-xs font-bold transition-all"
              :class="currentPage === page
                ? 'bg-amber-500 text-stone-950 shadow-md scale-105'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-amber-500/20'"
            >
              {{ page }}
            </button>
          </div>

          <UButton
            size="sm"
            color="gray"
            variant="ghost"
            :disabled="currentPage === totalPages"
            :trailing-icon="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'"
            @click="currentPage++"
            class="rounded-xl font-bold"
          >
            {{ isEn ? 'Next' : 'التالي' }}
          </UButton>
        </div>
      </div>

      <!-- Empty State if no hotels with permit -->
      <div v-else class="text-center py-12 px-4 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-xl mx-auto">
        <UIcon name="i-mdi-shield-alert-outline" class="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 class="text-base font-bold text-stone-800 dark:text-stone-200 mb-1">{{ t.hotels.emptyStateTitle }}</h3>
        <p class="text-xs text-stone-500 dark:text-stone-400">
          {{ t.hotels.emptyStateDesc }}
        </p>
      </div>

      <!-- Bottom Consultation Banner CTA -->
      <div class="mt-10 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
        <div>
          <h3 class="text-lg font-bold text-amber-500">{{ isEn ? 'Need Assistance Choosing Your Hotel?' : 'جاهز لاختيار وتأكيد إقامتك الفندقية؟' }}</h3>
          <p class="text-xs md:text-sm text-stone-600 dark:text-stone-300">
            {{ isEn ? 'Our team is active 24/7 to provide personalized recommendations for individuals and groups.' : 'فريقنا متاح على مدار الساعة لتوفير أفضل الخيارات المخصصة للأفراد والمجموعات وحملات العمرة.' }}
          </p>
        </div>
        <a
          :href="`https://wa.me/${content.support.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(isEn ? 'Hello, I would like to inquire about hotel reservations' : 'السلام عليكم، أود الاستفسار وطلب حجز فندق')}`"
          target="_blank"
          rel="noopener noreferrer"
          class="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md hover:shadow-amber-500/30 transition-all shrink-0 inline-flex items-center justify-center gap-2"
        >
          <UIcon name="i-mdi-whatsapp" class="w-5 h-5" />
          <span>{{ isEn ? 'Instant WhatsApp Chat (24/7)' : 'محادثة فورية (24/7)' }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useCmsContent } from "~/composables/useCmsContent";
import { useAppLang } from "~/composables/useAppLang";

const { content } = useCmsContent();
const { isEn, t } = useAppLang();

const currentPage = ref(1);
const itemsPerPage = 6;

const introHtml = computed(() => {
  if (isEn.value) {
    return content.value.hotelsServices?.contentHtmlEn || content.value.hotelsServices?.contentHtml || "";
  }
  return content.value.hotelsServices?.contentHtml || "";
});

const featuresList = computed(() => {
  if (isEn.value) {
    return content.value.hotelsServices?.featuresEn?.length
      ? content.value.hotelsServices.featuresEn
      : content.value.hotelsServices?.features || [];
  }
  return content.value.hotelsServices?.features || [];
});

const licensedHotels = computed(() => {
  const items = content.value.hotelsServices?.items || [];
  return items.filter((h) => !!h.permitNumber && h.permitNumber.trim() !== "");
});

const totalPages = computed(() => {
  return Math.ceil(licensedHotels.value.length / itemsPerPage) || 1;
});

// Reset page if total items change and exceed current page
watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = 1;
  }
});

const paginatedHotels = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return licensedHotels.value.slice(start, start + itemsPerPage);
});
</script>
