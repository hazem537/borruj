<template>
  <section class="w-full flex flex-col items-center" id="prices">
    <div class="glass-panel w-full rounded-3xl p-6 md:p-12 shadow-xl relative overflow-hidden transition-all duration-300">
      <!-- Section Header -->
      <div class="flex flex-col items-center text-center gap-2 mb-8 pb-6 border-b border-stone-200 dark:border-stone-800">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 w-fit">
          <UIcon name="i-mdi-tag-text-outline" class="w-4 h-4" />
          <span>{{ isEn ? (content.prices.badgeEn || t.prices.badge) : (content.prices.badgeAr || t.prices.badge) }}</span>
        </span>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
          {{ isEn ? (content.prices.titleEn || t.prices.title) : (content.prices.titleAr || t.prices.title) }}
        </h2>
        <p class="text-xs sm:text-sm md:text-base text-stone-600 dark:text-stone-400 max-w-2xl">
          {{ isEn ? (content.prices.subtitleEn || t.prices.subtitle) : (content.prices.subtitleAr || t.prices.subtitle) }}
        </p>
        <div class="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-2"></div>
      </div>

      <!-- Statutory VAT Compliance Notice Banner -->
      <div class="mb-8 p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
        <UIcon name="i-mdi-check-decagram" class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div class="space-y-1">
          <p class="font-bold">
            {{ t.prices.statementTitle }}
          </p>
          <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {{ t.prices.statementBody }}
          </p>
        </div>
      </div>

      <!-- Filter Controls (By City, By Hotel & By Room / Service Type) -->
      <div class="mb-8 p-4 md:p-5 rounded-2xl bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        <!-- 1. City Filter -->
        <UFormGroup :label="isEn ? 'Filter by City:' : 'تصفية حسب المدينة:'" class="w-full">
          <template #label>
            <span class="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <UIcon name="i-mdi-map-marker-radius-outline" class="w-4 h-4 text-amber-500" />
              <span>{{ isEn ? 'City:' : 'المدينة:' }}</span>
            </span>
          </template>
          <USelect
            v-model="selectedCity"
            :options="cityFilterOptions"
            option-attribute="label"
            value-attribute="value"
            size="md"
            icon="i-mdi-map-marker"
            class="rounded-xl w-full"
            @change="onCityChange"
          />
        </UFormGroup>

        <!-- 2. Hotel Filter -->
        <UFormGroup :label="isEn ? 'Filter by Hotel:' : 'تصفية حسب الفندق:'" class="w-full">
          <template #label>
            <span class="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <UIcon name="i-mdi-office-building-marker-outline" class="w-4 h-4 text-amber-500" />
              <span>{{ isEn ? 'Hotel / Facility:' : 'الفندق / المنشأة:' }}</span>
            </span>
          </template>
          <USelect
            v-model="selectedHotelId"
            :options="hotelFilterOptions"
            option-attribute="label"
            value-attribute="value"
            size="md"
            icon="i-mdi-office-building"
            class="rounded-xl w-full"
          />
        </UFormGroup>

        <!-- 3. Room / Category Type Filter -->
        <UFormGroup :label="isEn ? 'Room / Type:' : 'نوع الوحدة:'" class="w-full sm:col-span-2 lg:col-span-1">
          <template #label>
            <span class="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <UIcon name="i-mdi-bed-outline" class="w-4 h-4 text-amber-500" />
              <span>{{ isEn ? 'Room / Category:' : 'نوع الوحدة والغرفة:' }}</span>
            </span>
          </template>
          <USelect
            v-model="selectedRoomType"
            :options="roomTypeOptions"
            option-attribute="label"
            value-attribute="value"
            size="md"
            icon="i-mdi-bed"
            class="rounded-xl w-full"
          />
        </UFormGroup>
      </div>

      <!-- Price Items Grid -->
      <div v-if="filteredPriceItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="item in filteredPriceItems"
          :key="item.id"
          class="rounded-2xl p-6 bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-md hover:shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between group relative overflow-hidden"
        >
          <div class="space-y-3">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <!-- Related Hotel Tag -->
                <span
                  v-if="getHotelName(item)"
                  class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg mb-1.5"
                >
                  <UIcon name="i-mdi-office-building" class="w-3.5 h-3.5" />
                  <span>{{ getHotelName(item) }}</span>
                </span>
                <h3 class="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-500 transition-colors">
                  {{ isEn ? (item.nameEn || item.nameAr) : item.nameAr }}
                </h3>
              </div>

              <!-- Permit Badge (Linked automatically from Hotel or item) -->
              <span
                v-if="getItemPermit(item)"
                class="shrink-0 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
              >
                {{ t.prices.permitLabel }} {{ getItemPermit(item) }}
              </span>
            </div>

            <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {{ isEn ? (item.descriptionEn || item.descriptionAr) : item.descriptionAr }}
            </p>
          </div>

          <!-- Price & Action Footer -->
          <div class="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div class="flex items-baseline gap-1.5">
                <span class="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono">{{ item.priceSar }}</span>
                <span class="text-sm font-semibold text-stone-700 dark:text-stone-300">{{ t.prices.currencySar }}</span>
                <span class="text-xs text-stone-500 dark:text-stone-400">/ {{ isEn ? (item.unitEn || 'unit') : (item.unitAr || 'للوحدة') }}</span>
              </div>
              <div class="flex items-center gap-1.5 mt-1">
                <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  <UIcon name="i-mdi-check" class="w-3 h-3" />
                  <span>{{ t.prices.vatIncluded }}</span>
                </span>
              </div>
            </div>

            <!-- Direct Booking if enabled, or prefilled Request Form / WhatsApp -->
            <ULink
              v-if="content.features.enableDirectPayment"
              :to="`/booking?itemId=${item.id}`"
              class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-amber-500/30 transition-all flex items-center gap-1.5"
            >
              <UIcon name="i-mdi-credit-card-check-outline" class="w-4 h-4" />
              <span>{{ t.prices.bookAndPay }}</span>
            </ULink>
            <div v-else class="flex items-center gap-2">
              <button
                type="button"
                @click="onBookPriceItem(item)"
                class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-amber-500/30 transition-all flex items-center gap-1.5"
              >
                <UIcon name="i-mdi-calendar-edit" class="w-4 h-4" />
                <span>{{ isEn ? 'Book Request' : 'طلب حجز' }}</span>
              </button>
              <a
                :href="getWhatsAppLink(item)"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-full inline-flex items-center justify-center bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white transition-all shadow-sm shrink-0"
                :title="isEn ? 'WhatsApp Chat' : 'محادثة واتساب مباشرة'"
              >
                <UIcon name="i-mdi-whatsapp" class="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 px-4 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-md mx-auto">
        <UIcon name="i-mdi-filter-remove-outline" class="w-12 h-12 text-stone-400 mx-auto mb-2" />
        <h4 class="font-bold text-stone-800 dark:text-stone-200 text-sm">
          {{ isEn ? 'No packages match the selected filter' : 'لا توجد باقات تطابق التصفية المحددة' }}
        </h4>
        <button
          type="button"
          @click="resetFilters"
          class="mt-3 text-xs text-amber-500 hover:underline font-bold"
        >
          {{ isEn ? 'Reset filters' : 'إعادة ضبط التصفية' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCmsContent, type CmsPriceItem } from "~/composables/useCmsContent";
import { useAppLang } from "~/composables/useAppLang";
import { useBookingDraft } from "~/composables/useBookingDraft";

const { content } = useCmsContent();
const { isEn, t } = useAppLang();
const { selectForBooking } = useBookingDraft();

const selectedCity = ref<string>("all");
const selectedHotelId = ref<string>("all");
const selectedRoomType = ref<string>("all");

// Hotels list from CMS
const hotelsList = computed(() => content.value.hotelsServices?.items || []);

// City Filter Options
const cityFilterOptions = computed(() => {
  const options = [
    { label: isEn.value ? "All Cities (Makkah & Madinah)" : "جميع المدن (مكة والمدينة)", value: "all" },
  ];

  const seenCities = new Set<string>();
  hotelsList.value.forEach((h: any) => {
    const rawCity = h.city || "مكة المكرمة";
    if (!seenCities.has(rawCity)) {
      seenCities.add(rawCity);
      const cityLabel = isEn.value ? (h.cityEn || h.city || "Makkah") : rawCity;
      options.push({
        label: cityLabel,
        value: rawCity,
      });
    }
  });

  return options;
});

// Hotel Filter Options (filtered by selectedCity if active)
const hotelFilterOptions = computed(() => {
  const options = [
    { label: isEn.value ? "All Hotels & Accommodations" : "جميع الفنادق والمرافق", value: "all" },
  ];

  const filteredHotels = selectedCity.value === "all"
    ? hotelsList.value
    : hotelsList.value.filter((h: any) => h.city === selectedCity.value);

  filteredHotels.forEach((h: any) => {
    const name = isEn.value ? (h.nameEn || h.name) : h.name;
    options.push({
      label: name,
      value: h.id || h.name,
    });
  });

  return options;
});

const onCityChange = () => {
  // If the currently selected hotel does not belong to the selected city, reset to 'all'
  if (selectedHotelId.value !== "all") {
    const currentHotel = hotelsList.value.find((h: any) => (h.id || h.name) === selectedHotelId.value);
    if (currentHotel && selectedCity.value !== "all" && currentHotel.city !== selectedCity.value) {
      selectedHotelId.value = "all";
    }
  }
};

// Room Type Filter Options
const roomTypeOptions = computed(() => [
  { label: isEn.value ? "All Room Types" : "جميع أنواع الوحدات", value: "all" },
  { label: isEn.value ? "Standard Rooms" : "غرف قياسية", value: "standard" },
  { label: isEn.value ? "Deluxe Rooms" : "غرف ديلوكس", value: "deluxe" },
  { label: isEn.value ? "Family Suites" : "أجنحة عائلية", value: "suite" },
  { label: isEn.value ? "Executive Rooms" : "غرف تنفيذية", value: "executive" },
  { label: isEn.value ? "Service Packages" : "باقات وخدمات", value: "service" },
]);

const resetFilters = () => {
  selectedCity.value = "all";
  selectedHotelId.value = "all";
  selectedRoomType.value = "all";
};

// Helper to get parent hotel name
const getHotelName = (item: CmsPriceItem) => {
  if (item.hotelNameAr || item.hotelNameEn) {
    return isEn.value ? (item.hotelNameEn || item.hotelNameAr) : (item.hotelNameAr || item.hotelNameEn);
  }
  if (item.hotelId) {
    const parent = hotelsList.value.find((h: any) => h.id === item.hotelId || h.name === item.hotelId);
    if (parent) {
      return isEn.value ? (parent.nameEn || parent.name) : parent.name;
    }
  }
  return "";
};

// Helper to get permit number (inherited from hotel or item)
const getItemPermit = (item: CmsPriceItem) => {
  if (item.permitNumber) return item.permitNumber;
  if (item.hotelId) {
    const parent = hotelsList.value.find((h: any) => h.id === item.hotelId || h.name === item.hotelId);
    if (parent && parent.permitNumber) return parent.permitNumber;
  }
  return content.value.legal?.licenseNumber || "";
};

// Filtered Price Items
const filteredPriceItems = computed(() => {
  const items = content.value.prices?.items || [];

  return items.filter((item) => {
    // City filter match (check parent hotel's city)
    if (selectedCity.value !== "all") {
      const parentHotel = hotelsList.value.find((h: any) => h.id === item.hotelId || h.name === item.hotelId || h.name === item.hotelNameAr);
      if (parentHotel && parentHotel.city !== selectedCity.value) {
        return false;
      }
    }

    // Hotel filter match
    if (selectedHotelId.value !== "all") {
      const matchId = item.hotelId === selectedHotelId.value;
      const matchName = item.hotelNameAr === selectedHotelId.value || item.hotelNameEn === selectedHotelId.value;
      if (!matchId && !matchName) return false;
    }

    // Room Type filter match
    if (selectedRoomType.value !== "all") {
      if (item.roomType && item.roomType !== selectedRoomType.value) {
        return false;
      }
    }

    return true;
  });
});

const getWhatsAppLink = (item: CmsPriceItem) => {
  const phone = content.value.support?.whatsapp?.replace(/[^0-9]/g, "") || "";
  const itemName = isEn.value ? (item.nameEn || item.nameAr) : item.nameAr;
  const hotelName = getHotelName(item);
  const permit = getItemPermit(item);

  const text = isEn.value
    ? `Booking inquiry for: ${itemName}${hotelName ? ` at (${hotelName})` : ''} - Rate: ${item.priceSar} SAR / ${item.unitEn || 'night'}${permit ? ` [Permit #${permit}]` : ''}`
    : `طلب حجز واستفسار عن: ${itemName}${hotelName ? ` في (${hotelName})` : ''} - السعر المعلن: ${item.priceSar} ر.س / ${item.unitAr || 'ليلة'} [شامل 15% ضريبة]${permit ? ` (تصريح: ${permit})` : ''}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

const onBookPriceItem = (item: CmsPriceItem) => {
  const permit = getItemPermit(item);
  const hotelName = getHotelName(item);

  selectForBooking({
    priceItemId: item.id,
    name: hotelName ? `${hotelName} - ${item.nameAr}` : item.nameAr,
    nameEn: hotelName ? `${hotelName} - ${item.nameEn || item.nameAr}` : (item.nameEn || item.nameAr),
    permitNumber: permit,
    priceSar: item.priceSar,
    unit: item.unitAr,
    unitEn: item.unitEn,
  });
};
</script>
