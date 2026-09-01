<template>
  <section class="w-full flex flex-col items-center" id="contactUs">
    <div class="glass-panel w-full rounded-3xl p-6 md:p-12 shadow-xl relative overflow-hidden transition-all duration-300">
      <!-- Section Header -->
      <div class="flex flex-col items-center text-center gap-2 mb-10">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <UIcon name="i-mdi-card-account-phone-outline" class="w-4 h-4" />
          {{ isEn ? (content.contact.badgeEn || t.contact.badge) : (content.contact.badge || t.contact.badge) }}
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">
          {{ isEn ? (content.contact.titleEn || t.contact.title) : (content.contact.title || t.contact.title) }}
        </h2>
        <div class="prose-custom max-w-2xl text-stone-600 dark:text-stone-300 text-sm md:text-base mt-1">
          <div v-html="contactDescriptionHtml"></div>
        </div>
        <div class="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-2"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Contact & Complaint Form (7 cols) -->
        <div class="lg:col-span-7 bg-white/80 dark:bg-stone-900/80 p-6 md:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-md">
          <div class="flex items-center justify-between mb-6 pb-3 border-b border-stone-200 dark:border-stone-800">
            <h3 class="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <UIcon name="i-mdi-email-edit-outline" class="text-amber-500" />
              <span>{{ t.contact.formHeader }}</span>
            </h3>
            <span class="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-lg">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{{ t.contact.availableNow }}</span>
            </span>
          </div>

          <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
            <!-- Request Category -->
            <UFormGroup :label="t.contact.typeLabel" name="type" required :help="t.contact.typeHelp">
              <USelect
                v-model="state.type"
                :options="requestTypeOptions"
                option-attribute="label"
                value-attribute="value"
                size="md"
                icon="i-mdi-format-list-bulleted-type"
                class="rounded-xl"
              />
            </UFormGroup>

            <!-- Selected package card (same for price-list flow & contact form selection) -->
            <div
              v-if="isBookingRequest && selectedPackageCard"
              class="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-start justify-between gap-3 shadow-sm animate-fade-in"
            >
              <div class="flex items-start gap-2.5">
                <UIcon name="i-mdi-tag-check-outline" class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div class="space-y-0.5">
                  <span class="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                    {{ isEn ? '✨ Selected package for booking:' : '✨ الباقة المختارة للحجز:' }}
                  </span>
                  <span class="text-xs text-stone-800 dark:text-stone-200 font-semibold block">
                    {{ selectedPackageCard.name }}
                    <span v-if="selectedPackageCard.priceSar" class="text-amber-600 dark:text-amber-400 font-mono font-bold">
                      ({{ selectedPackageCard.priceSar }} {{ isEn ? 'SAR' : 'ريال' }} / {{ selectedPackageCard.unit }})
                    </span>
                  </span>
                  <span v-if="selectedPackageCard.permitNumber" class="text-[11px] text-stone-500 font-mono block">
                    {{ t.hotels.permitLabel }} {{ selectedPackageCard.permitNumber }}
                  </span>
                </div>
              </div>
              <button
                type="button"
                @click="clearSelectedPackage"
                class="text-xs text-stone-500 hover:text-red-500 font-semibold underline p-1 shrink-0"
                :title="isEn ? 'Clear selected package' : 'إلغاء اختيار الباقة'"
              >
                {{ isEn ? 'Reset' : 'إعادة الضبط' }}
              </button>
            </div>


            <!-- Guest Name & Email -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup :label="t.contact.nameLabel" name="name" required>
                <UInput
                  v-model="state.name"
                  :placeholder="t.contact.namePlaceholder"
                  size="md"
                  icon="i-mdi-account"
                  class="rounded-xl"
                />
              </UFormGroup>

              <UFormGroup :label="t.contact.emailLabel" name="email" required>
                <UInput
                  v-model="state.email"
                  type="email"
                  placeholder="example@domain.com"
                  size="md"
                  icon="i-mdi-email"
                  class="rounded-xl"
                />
              </UFormGroup>
            </div>

            <!-- Phone and Subject -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup :label="t.contact.phoneLabel" name="phone">
                <UInput
                  v-model="state.phone"
                  placeholder="05XXXXXXXX"
                  size="md"
                  icon="i-mdi-phone"
                  class="rounded-xl"
                  dir="ltr"
                />
              </UFormGroup>

              <UFormGroup :label="t.contact.subjectLabel" name="object" required>
                <UInput
                  v-model="state.object"
                  :placeholder="t.contact.subjectPlaceholder"
                  size="md"
                  icon="i-mdi-format-title"
                  class="rounded-xl"
                />
              </UFormGroup>
            </div>

            <!-- Price package selector (booking — shown until a package is selected) -->
            <UFormGroup
              v-if="isBookingRequest && !selectedPackageCard"
              :label="isEn ? 'Select package from price list' : 'اختيار الباقة من قائمة الأسعار'"
              name="selectedPriceId"
              required
            >
              <USelect
                v-model="state.selectedPriceId"
                :options="pricePackageOptions"
                option-attribute="label"
                value-attribute="value"
                size="md"
                icon="i-mdi-tag-multiple-outline"
                class="rounded-xl"
                :placeholder="isEn ? 'Choose hotel / room package...' : 'اختر الفندق / الباقة السعرية...'"
              />
            </UFormGroup>

            <UFormGroup :label="t.contact.messageLabel" name="message" required>
              <UTextarea
                v-model="state.message"
                :placeholder="messagePlaceholder"
                :rows="5"
                class="rounded-xl"
              />
            </UFormGroup>

            <div class="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-stone-600 dark:text-stone-300 flex items-start gap-2">
              <UIcon name="i-mdi-shield-check-outline" class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                {{ t.contact.statutoryCommitment }}
              </span>
            </div>

            <UButton
              block
              type="submit"
              color="amber"
              size="lg"
              :loading="isSubmitting"
              class="font-bold rounded-xl shadow-md hover:shadow-amber-500/30 transition-all mt-4"
            >
              <template #leading>
                <UIcon name="i-mdi-send" />
              </template>
              {{ t.contact.submitBtn }}
            </UButton>
          </UForm>
        </div>

        <!-- Contact Information Cards (5 cols) -->
        <div class="lg:col-span-5 flex flex-col gap-4">
          <!-- Direct Communication Card -->
          <div class="bg-white/80 dark:bg-stone-900/80 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-md">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-amber-500 flex items-center gap-2">
                <UIcon name="i-mdi-phone-classic" />
                <span>{{ t.contact.channelsTitle }}</span>
              </h3>
              <span class="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">24/7</span>
            </div>

            <div class="space-y-4">
              <!-- Phone -->
              <a
                v-if="content.contact.phone"
                :href="`tel:${content.contact.phone}`"
                class="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 hover:bg-amber-500/15 border border-amber-500/10 transition-colors group"
              >
                <div class="w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                  <UIcon name="i-mdi-phone" class="w-5 h-5" />
                </div>
                <div>
                  <span class="text-xs text-stone-500 dark:text-stone-400 block">{{ t.contact.phoneCall }}</span>
                  <span class="text-base font-bold text-stone-800 dark:text-stone-100 group-hover:text-amber-500" dir="ltr">
                    {{ content.contact.phone }}
                  </span>
                </div>
              </a>

              <!-- WhatsApp -->
              <a
                v-if="content.contact.whatsapp"
                :href="`https://wa.me/${content.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(isEn ? 'Hello, I have an inquiry / complaint' : 'السلام عليكم، أود تقديم استفسار / شكوى')}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/15 border border-emerald-500/10 transition-colors group"
              >
                <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <UIcon name="i-mdi-whatsapp" class="w-5 h-5" />
                </div>
                <div>
                  <span class="text-xs text-stone-500 dark:text-stone-400 block">{{ t.contact.whatsappChat }}</span>
                  <span class="text-base font-bold text-emerald-600 dark:text-emerald-400" dir="ltr">
                    {{ content.contact.whatsapp }}
                  </span>
                </div>
              </a>

              <!-- Email -->
              <a
                v-if="content.contact.email"
                :href="`mailto:${content.contact.email}`"
                class="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 hover:bg-amber-500/15 border border-amber-500/10 transition-colors group"
              >
                <div class="w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                  <UIcon name="i-mdi-email" class="w-5 h-5" />
                </div>
                <div class="truncate">
                  <span class="text-xs text-stone-500 dark:text-stone-400 block">{{ t.contact.officialEmail }}</span>
                  <span class="text-sm font-semibold text-stone-800 dark:text-stone-100 group-hover:text-amber-500 truncate block">
                    {{ content.contact.email }}
                  </span>
                </div>
              </a>
            </div>
          </div>

          <!-- Working Hours & Licensing Card -->
          <div class="bg-white/80 dark:bg-stone-900/80 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-md">
            <h3 class="text-lg font-bold text-amber-500 mb-3 flex items-center gap-2">
              <UIcon name="i-mdi-clock-time-four-outline" />
              <span>{{ t.contact.workAndLicenseTitle }}</span>
            </h3>

            <div class="space-y-3 text-sm text-stone-700 dark:text-stone-300">
              <div class="flex items-start gap-2.5">
                <UIcon name="i-mdi-calendar-clock" class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span class="font-semibold block">{{ isEn ? (content.contact.workingDaysEn || content.contact.workingDays) : content.contact.workingDays }}</span>
                  <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{{ isEn ? (content.contact.workingHoursEn || content.contact.workingHours) : content.contact.workingHours }}</span>
                </div>
              </div>

              <div class="flex items-start gap-2.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                <UIcon name="i-mdi-certificate" class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span class="font-semibold block">{{ isEn ? (content.legal.tradeNameEn || content.legal.tradeName) : content.legal.tradeName }}</span>
                  <span class="text-xs text-stone-500 dark:text-stone-400">
                    {{ t.legal.licenseLabel }} <strong class="font-mono text-emerald-600">{{ content.legal.licenseNumber }}</strong> | {{ t.legal.crLabel }} <strong class="font-mono">{{ content.legal.crNumber }}</strong>
                  </span>
                </div>
              </div>

              <div v-if="content.contact.location" class="flex items-start gap-2.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                <UIcon name="i-mdi-map-marker-outline" class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span class="font-semibold block">{{ isEn ? 'Headquarters' : 'المقر الرئيسي' }}</span>
                  <span class="text-xs text-stone-500 dark:text-stone-400">{{ isEn ? (content.contact.locationEn || content.contact.location) : content.contact.location }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Direct Payment Option Link (if enabled in CMS) -->
          <div v-if="content.features.enableDirectPayment" class="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 border border-amber-500/30 shadow-md">
            <div class="flex items-center gap-2 mb-2">
              <UIcon name="i-mdi-credit-card-check" class="w-5 h-5 text-amber-500" />
              <h4 class="font-bold text-stone-900 dark:text-stone-100 text-sm">{{ t.contact.directBookingPromptTitle }}</h4>
            </div>
            <p class="text-xs text-stone-600 dark:text-stone-300 mb-3 leading-relaxed">
              {{ t.contact.directBookingPromptDesc }}
            </p>
            <ULink
              to="/booking"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-sm transition-all"
            >
              <UIcon :name="isEn ? 'i-mdi-arrow-right' : 'i-mdi-arrow-left'" class="w-4 h-4" />
              <span>{{ t.contact.directBookingPromptBtn }}</span>
            </ULink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { object, string } from "yup";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useCmsContent, type CmsPriceItem } from "~/composables/useCmsContent";
import { useAppLang } from "~/composables/useAppLang";
import { useBookingDraft } from "~/composables/useBookingDraft";

const { content } = useCmsContent();
const { isEn, t } = useAppLang();
const { draft, isDraftActive, setDraft, clearDraft } = useBookingDraft();

const db = useFirestore();
const toast = useToast();
const isSubmitting = ref(false);

const contactDescriptionHtml = computed(() => {
  if (isEn.value) {
    return content.value.contact?.descriptionHtmlEn || content.value.contact?.descriptionHtml || "";
  }
  return content.value.contact?.descriptionHtml || "";
});

const requestTypeOptions = computed(() => [
  { label: t.value.contact.types.inquiry, value: "inquiry" },
  { label: t.value.contact.types.complaint, value: "complaint" },
  { label: t.value.contact.types.booking, value: "booking_request" },
  { label: t.value.contact.types.cancelOrMod, value: "cancellation_or_modification" },
]);

const isBookingRequest = computed(() => state.type === "booking_request");

const priceItems = computed(() => content.value.prices?.items || []);

const pricePackageOptions = computed(() => {
  return priceItems.value.map((item: CmsPriceItem) => {
    const hotelName = item.hotelNameAr || item.hotelNameEn || "";
    const packageName = isEn.value ? (item.nameEn || item.nameAr) : item.nameAr;
    const unit = isEn.value ? (item.unitEn || "night") : (item.unitAr || "ليلة");
    const label = hotelName
      ? `${hotelName} — ${packageName} (${item.priceSar} ${isEn.value ? "SAR" : "ر.س"} / ${unit})`
      : `${packageName} (${item.priceSar} ${isEn.value ? "SAR" : "ر.س"} / ${unit})`;

    return {
      label,
      value: item.id,
    };
  });
});

const selectedPackageCard = computed(() => {
  if (state.selectedPriceId) {
    const item = getPriceItemById(state.selectedPriceId);
    if (item) {
      const hotelName = isEn.value ? (item.hotelNameEn || item.hotelNameAr) : item.hotelNameAr;
      const packageName = isEn.value ? (item.nameEn || item.nameAr) : item.nameAr;
      return {
        name: hotelName ? `${hotelName} - ${packageName}` : packageName,
        priceSar: item.priceSar,
        unit: isEn.value ? (item.unitEn || "night") : (item.unitAr || "ليلة"),
        permitNumber: item.permitNumber || content.value.legal?.licenseNumber || "",
      };
    }
  }

  if (draft.value && isDraftActive.value) {
    return {
      name: isEn.value ? (draft.value.nameEn || draft.value.name) : draft.value.name,
      priceSar: draft.value.priceSar,
      unit: isEn.value ? (draft.value.unitEn || "night") : (draft.value.unit || "ليلة"),
      permitNumber: draft.value.permitNumber,
    };
  }

  return null;
});

const syncDraftFromPriceItem = (item: CmsPriceItem) => {
  const hotelNameAr = item.hotelNameAr || "";
  const hotelNameEn = item.hotelNameEn || hotelNameAr;
  const displayNameAr = hotelNameAr ? `${hotelNameAr} - ${item.nameAr}` : item.nameAr;
  const displayNameEn = hotelNameEn ? `${hotelNameEn} - ${item.nameEn || item.nameAr}` : (item.nameEn || item.nameAr);

  setDraft(
    {
      priceItemId: item.id,
      name: displayNameAr,
      nameEn: displayNameEn,
      permitNumber: item.permitNumber || content.value.legal?.licenseNumber || "",
      priceSar: item.priceSar,
      unit: item.unitAr,
      unitEn: item.unitEn,
    },
    { scroll: false }
  );
};

const messagePlaceholder = computed(() => {
  if (!isBookingRequest.value) return t.value.contact.messagePlaceholder;
  return isEn.value
    ? "Please include check-in/out dates, number of guests, rooms, and any special requests..."
    : "يرجى ذكر تواريخ الدخول والخروج، عدد النزلاء والغرف، وأي ملاحظات إضافية...";
});

const schema = object({
  type: string().required("Type is required"),
  name: string().required("Name is required"),
  email: string().email("Valid email required").required("Email is required"),
  phone: string().optional(),
  object: string().required("Subject is required"),
  message: string().required("Message is required"),
});

const state = reactive({
  type: "inquiry",
  name: "",
  email: "",
  phone: "",
  object: "",
  message: "",
  selectedPriceId: "",
});

const getPriceItemById = (id: string) => priceItems.value.find((p: CmsPriceItem) => p.id === id);

const buildBookingSubject = (item: CmsPriceItem) => {
  const packageName = isEn.value ? (item.nameEn || item.nameAr) : item.nameAr;
  const hotelName = isEn.value ? (item.hotelNameEn || item.hotelNameAr) : item.hotelNameAr;
  const permit = item.permitNumber || content.value.legal?.licenseNumber || "";
  const permitText = permit ? ` (${isEn.value ? "Permit #" : "تصريح:"} ${permit})` : "";
  const label = hotelName ? `${hotelName} - ${packageName}` : packageName;

  return isEn.value ? `Booking: ${label}${permitText}` : `طلب حجز: ${label}${permitText}`;
};

const buildBookingDetailsPayload = (item: CmsPriceItem | null) => {
  if (!item) return draft.value ? { ...draft.value } : null;

  const hotelName = isEn.value ? (item.hotelNameEn || item.hotelNameAr) : item.hotelNameAr;
  const packageName = isEn.value ? (item.nameEn || item.nameAr) : item.nameAr;

  return {
    priceItemId: item.id,
    name: hotelName ? `${hotelName} - ${item.nameAr}` : item.nameAr,
    nameEn: hotelName ? `${hotelName} - ${item.nameEn || item.nameAr}` : (item.nameEn || item.nameAr),
    permitNumber: item.permitNumber || content.value.legal?.licenseNumber || "",
    priceSar: item.priceSar,
    unit: item.unitAr,
    unitEn: item.unitEn,
    hotelId: item.hotelId,
    hotelNameAr: item.hotelNameAr,
    hotelNameEn: item.hotelNameEn,
    roomType: item.roomType,
    packageNameAr: item.nameAr,
    packageNameEn: item.nameEn,
  };
};

// React to booking draft selection from price list / hotels
watch(
  [draft, isDraftActive],
  ([newDraft, active]) => {
    if (newDraft && active) {
      state.type = "booking_request";
      if (newDraft.priceItemId) {
        state.selectedPriceId = newDraft.priceItemId;
      }
      const itemName = isEn.value ? (newDraft.nameEn || newDraft.name) : newDraft.name;
      const permitText = newDraft.permitNumber ? ` (${isEn.value ? "Permit #" : "تصريح:"} ${newDraft.permitNumber})` : "";
      state.object = isEn.value ? `Booking: ${itemName}${permitText}` : `طلب حجز: ${itemName}${permitText}`;
    }
  },
  { immediate: true, deep: true }
);

// When user picks a package from the dropdown, sync card, subject & draft
watch(
  () => state.selectedPriceId,
  (id) => {
    if (!id || state.type !== "booking_request") return;
    const item = getPriceItemById(id);
    if (item) {
      state.object = buildBookingSubject(item);
      syncDraftFromPriceItem(item);
    }
  }
);

watch(
  () => state.type,
  (type) => {
    if (type !== "booking_request") {
      clearSelectedPackage();
    }
  }
);

const clearSelectedPackage = () => {
  state.selectedPriceId = "";
  clearDraft();
  if (state.type === "booking_request" && (state.object.startsWith("طلب حجز:") || state.object.startsWith("Booking:"))) {
    state.object = "";
  }
};

const handleResetAll = () => {
  clearSelectedPackage();
  state.type = "inquiry";
  state.name = "";
  state.email = "";
  state.phone = "";
  state.object = "";
  state.message = "";
};

const onSubmit = async () => {
  try {
    isSubmitting.value = true;
    const isBooking = isBookingRequest.value;
    const selectedItem = state.selectedPriceId ? getPriceItemById(state.selectedPriceId) : null;
    const bookingDetails = isBooking ? buildBookingDetailsPayload(selectedItem) : null;

    await addDoc(collection(db, "messages"), {
      type: state.type,
      name: state.name,
      email: state.email,
      phone: state.phone || "",
      object: state.object,
      message: state.message,
      selectedPriceId: isBooking && state.selectedPriceId ? state.selectedPriceId : null,
      bookingDetails,
      status: "new",
      createdAt: serverTimestamp(),
      dateString: new Date().toLocaleString(isEn.value ? "en-US" : "ar-SA"),
    });

    toast.add({
      title: isEn.value ? "Request submitted successfully" : "تم استلام طلبك بنجاح",
      description: isBooking
        ? (isEn.value ? "Your booking request has been received. Our team will contact you shortly to confirm." : "تم استلام طلب الحجز بنجاح، سيقوم فريق العمليات بالتواصل معكم فوراً لتأكيد الحجز.")
        : state.type === "complaint"
        ? (isEn.value ? "Your complaint is logged with our 24/7 team with resolution SLA within 24 hours." : "تم تسجيل شكواك برقم مرجعي، وفريقنا متواجد 24/7 للبت فيها والرد خلال 24 ساعة.")
        : (isEn.value ? "Thank you for reaching out. Our team will contact you shortly." : "شكراً لتواصلك معنا، سيقوم فريقنا بالرد عليك في أقرب وقت على مدار الساعة."),
      color: "emerald",
      icon: "i-mdi-check-circle",
    });

    handleResetAll();
  } catch (error: any) {
    console.error("Error submitting contact form:", error);
    toast.add({
      title: isEn.value ? "Submission error" : "حدث خطأ أثناء الإرسال",
      description: isEn.value ? "Please try again or contact us via WhatsApp directly." : "يرجى المحاولة مرة أخرى أو مراسلتنا عبر الواتساب مباشرة.",
      color: "red",
      icon: "i-mdi-alert-circle",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
