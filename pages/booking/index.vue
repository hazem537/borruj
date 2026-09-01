<template>
  <div class="max-w-5xl mx-auto px-4 py-8 space-y-8" dir="rtl">
    <!-- Header Banner -->
    <div class="glass-panel rounded-3xl p-6 md:p-10 shadow-xl border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <ULink to="/" class="hover:text-amber-500 transition-colors">الرئيسية</ULink>
          <UIcon name="i-mdi-chevron-left" class="w-3.5 h-3.5" />
          <span class="text-amber-500 font-semibold">الحجز والسداد الإلكتروني المباشر</span>
        </div>
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
          <UIcon name="i-mdi-credit-card-check-outline" class="text-amber-500" />
          <span>خدمة الحجز والدفع الإلكتروني المباشر</span>
        </h1>
        <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl">
          احجز إقامتك الفندقية وادفع فوراً عبر بطاقات الائتمان (فيزا وماستركارد) بأسعار معلنة وشاملة لضريبة القيمة المضافة (15%) وكافة الرسوم النظامية.
        </p>
      </div>

      <!-- Regulatory Badge -->
      <div class="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-stone-800 dark:text-stone-200 shrink-0 space-y-1 text-right">
        <div class="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <UIcon name="i-mdi-shield-check" />
          <span>{{ content.legal.tradeName }}</span>
        </div>
        <div>ترخيص سياحي: <strong class="font-mono text-emerald-600">{{ content.legal.licenseNumber }}</strong></div>
        <div>سجل تجاري: <strong class="font-mono">{{ content.legal.crNumber }}</strong></div>
      </div>
    </div>

    <!-- Sandbox Mode Notification Banner -->
    <div v-if="isSandboxMode" class="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
      <UIcon name="i-mdi-flask-outline" class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <div class="space-y-1">
        <p class="font-bold">بوابة السداد في وضع الاختبار والتجربة (Moyasar Sandbox):</p>
        <p class="text-xs leading-relaxed opacity-90">
          يمكنك اختبار إجراء عملية حجز وسداد تجريبية ناجحة ببطاقات فيزا وماستركارد الاختبارية، مع إصدار فوري لمستند الحجز المعتمد.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Step 1 & 2 Form (7 cols) -->
      <div class="lg:col-span-7 space-y-6">
        <!-- 1. Select Service / Accommodation -->
        <div class="glass-panel p-6 rounded-3xl shadow-lg border border-stone-200 dark:border-stone-800 space-y-4">
          <h2 class="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
            <span class="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-extrabold">1</span>
            <span>اختيار الخدمة أو الوحدة الفندقية المرخصة</span>
          </h2>

          <div class="space-y-3">
            <div
              v-for="item in availableItems"
              :key="item.id"
              class="p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3"
              :class="selectedItemId === item.id
                ? 'bg-amber-500/10 border-amber-500 shadow-md'
                : 'bg-white/70 dark:bg-stone-900/70 border-stone-200 dark:border-stone-800 hover:border-amber-500/40'"
              @click="selectedItemId = item.id"
            >
              <div class="space-y-1.5 grow">
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    :id="item.id"
                    :value="item.id"
                    v-model="selectedItemId"
                    class="text-amber-500 focus:ring-amber-500"
                  />
                  <label :for="item.id" class="font-bold text-sm text-stone-900 dark:text-stone-100 cursor-pointer">
                    {{ item.nameAr }}
                  </label>
                </div>
                <p class="text-xs text-stone-600 dark:text-stone-400 leading-relaxed ps-5">
                  {{ item.descriptionAr }}
                </p>
                <div class="flex flex-wrap items-center gap-2 ps-5 pt-1 text-[11px]">
                  <span class="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-stone-600 dark:text-stone-300">
                    رقم التصريح: {{ item.permitNumber }}
                  </span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
                    شامل الضريبة 15%
                  </span>
                </div>
              </div>

              <div class="text-left shrink-0">
                <span class="text-lg font-extrabold text-amber-500 font-mono">{{ item.priceSar }}</span>
                <span class="text-xs text-stone-500 block">ر.س / {{ item.unitAr }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Stay Dates & Guests -->
        <div class="glass-panel p-6 rounded-3xl shadow-lg border border-stone-200 dark:border-stone-800 space-y-4">
          <h2 class="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
            <span class="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-extrabold">2</span>
            <span>تواريخ الإقامة وعدد الضيوف</span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormGroup label="تاريخ تسجيل الدخول (Check-in)" required>
              <UInput
                v-model="dates.checkIn"
                type="date"
                size="md"
                class="rounded-xl"
                :min="minCheckInDate"
              />
            </UFormGroup>

            <UFormGroup label="تاريخ تسجيل الخروج (Check-out)" required>
              <UInput
                v-model="dates.checkOut"
                type="date"
                size="md"
                class="rounded-xl"
                :min="dates.checkIn || minCheckInDate"
              />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <UFormGroup label="عدد النزلاء / الضيوف">
              <USelect
                v-model="guestCount"
                :options="[
                  { label: 'نزيل واحد (1)', value: 1 },
                  { label: 'نزيلان (2)', value: 2 },
                  { label: '3 نزلاء', value: 3 },
                  { label: '4 نزلاء', value: 4 },
                  { label: '5 نزلاء فأكثر', value: 5 },
                ]"
                option-attribute="label"
                value-attribute="value"
                size="md"
                class="rounded-xl"
              />
            </UFormGroup>

            <UFormGroup label="عدد الغرف / الوحدات">
              <USelect
                v-model="roomsCount"
                :options="[
                  { label: 'غرفة واحدة (1)', value: 1 },
                  { label: 'غرفتان (2)', value: 2 },
                  { label: '3 غرف', value: 3 },
                ]"
                option-attribute="label"
                value-attribute="value"
                size="md"
                class="rounded-xl"
              />
            </UFormGroup>
          </div>
        </div>

        <!-- 3. Guest Information -->
        <div class="glass-panel p-6 rounded-3xl shadow-lg border border-stone-200 dark:border-stone-800 space-y-4">
          <h2 class="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
            <span class="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-extrabold">3</span>
            <span>بيانات الضيف الأساسية للتأكيد وإصدار السند</span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormGroup label="الاسم الثلاثي (كما بالهوية / الجواز)" required>
              <UInput
                v-model="guest.name"
                placeholder="أدخل اسمك الكريم"
                size="md"
                icon="i-mdi-account"
                class="rounded-xl"
              />
            </UFormGroup>

            <UFormGroup label="رقم الجوال للتواصل وتأكيد الحجز" required>
              <UInput
                v-model="guest.phone"
                placeholder="05XXXXXXXX"
                size="md"
                icon="i-mdi-phone"
                class="rounded-xl"
                dir="ltr"
              />
            </UFormGroup>
          </div>

          <UFormGroup label="البريد الإلكتروني لإرسال مستند الحجز الرسمي" required>
            <UInput
              v-model="guest.email"
              type="email"
              placeholder="name@example.com"
              size="md"
              icon="i-mdi-email"
              class="rounded-xl"
            />
          </UFormGroup>

          <UFormGroup label="ملاحظات أو طلبات خاصة (اختياري)">
            <UTextarea
              v-model="guest.notes"
              placeholder="مثال: سرير إضافي، وصول متأخر، إطلالة معينة..."
              :rows="2"
              class="rounded-xl"
            />
          </UFormGroup>
        </div>

        <!-- 4. Mandatory Statutory Policy Acknowledgements -->
        <div class="glass-panel p-6 rounded-3xl shadow-lg border border-emerald-500/30 bg-emerald-500/5 space-y-3">
          <h2 class="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <UIcon name="i-mdi-checkbox-marked-circle-outline" class="text-emerald-600" />
            <span>الإقرار بالموافقة على الشروط والسياسات النظامية</span>
          </h2>

          <div class="space-y-2.5 text-xs text-stone-700 dark:text-stone-300">
            <label class="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                v-model="agreements.policies"
                class="mt-0.5 rounded text-amber-500 focus:ring-amber-500"
              />
              <span class="leading-relaxed">
                أوافق على <ULink to="/policies#booking-policy" target="_blank" class="text-amber-600 dark:text-amber-400 underline font-semibold">شروط وسياسة الحجز</ULink>
                و<ULink to="/policies#cancellation-policy" target="_blank" class="text-amber-600 dark:text-amber-400 underline font-semibold">سياسة الإلغاء والتعديل</ULink>
                (تلتزم المنشأة بالبت والرد على طلب الإلغاء/التعديل خلال مدة أقصاها 24 ساعة).
              </span>
            </label>

            <label class="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                v-model="agreements.refund"
                class="mt-0.5 rounded text-amber-500 focus:ring-amber-500"
              />
              <span class="leading-relaxed">
                أقر باطلاعي على <ULink to="/policies#refund-policy" target="_blank" class="text-amber-600 dark:text-amber-400 underline font-semibold">ضمان حقوق السائح واسترجاع المبالغ وفق المادة (23)</ULink>
                (تخيير العميل بين خدمة بديلة مساوية أو استرجاع فوري كامل دون خصم أي رسوم في حال تعذر تقديم الخدمة).
              </span>
            </label>

            <label class="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                v-model="agreements.insurance"
                class="mt-0.5 rounded text-amber-500 focus:ring-amber-500"
              />
              <span class="leading-relaxed">
                أعلم بأنه <ULink to="/policies#insurance-policy" target="_blank" class="text-amber-600 dark:text-amber-400 underline font-semibold">لا يُطلب أي مبلغ تأمين إضافي</ULink> عبر الموقع الإلكتروني.
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Price Summary & Payment Card (5 cols) -->
      <div class="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
        <div class="glass-panel p-6 rounded-3xl shadow-xl border border-amber-500/30 space-y-6">
          <div class="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
            <h3 class="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <UIcon name="i-mdi-receipt-text-outline" class="text-amber-500" />
              <span>ملخص الفاتورة والسداد</span>
            </h3>
            <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              سعر إجمالي شامل الضريبة
            </span>
          </div>

          <!-- Item Details Summary -->
          <div v-if="selectedItem" class="space-y-3 text-xs">
            <div class="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/80 space-y-1">
              <span class="font-bold text-stone-900 dark:text-stone-100 block">{{ selectedItem.nameAr }}</span>
              <span class="text-stone-500 block">تصريح رقم: <strong class="font-mono text-stone-700 dark:text-stone-300">{{ selectedItem.permitNumber }}</strong></span>
            </div>

            <div class="flex justify-between py-1 text-stone-600 dark:text-stone-400">
              <span>عدد الليالي المحسوبة:</span>
              <span class="font-bold text-stone-800 dark:text-stone-200 font-mono">{{ totalNights }} ليلة</span>
            </div>

            <div class="flex justify-between py-1 text-stone-600 dark:text-stone-400">
              <span>المبلغ الأساسي قبل الضريبة (تقريباً):</span>
              <span class="font-bold text-stone-800 dark:text-stone-200 font-mono">{{ subtotalBeforeVat }} ر.س</span>
            </div>

            <div class="flex justify-between py-1 text-emerald-700 dark:text-emerald-400">
              <span>ضريبة القيمة المضافة النظامية (15%):</span>
              <span class="font-bold font-mono">{{ vatAmount }} ر.س</span>
            </div>

            <div class="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-baseline justify-between">
              <div>
                <span class="text-sm font-bold text-stone-900 dark:text-stone-100 block">الإجمالي النهائي المطلوب:</span>
                <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">شامل 15% ضريبة وكافة الرسوم</span>
              </div>
              <div class="text-left">
                <span class="text-2xl font-extrabold text-amber-500 font-mono">{{ grandTotalSar }}</span>
                <span class="text-xs text-stone-500 font-bold block">ريال سعودي</span>
              </div>
            </div>
          </div>

          <!-- Accepted Cards & Gateway Badges (Visa + Mastercard) -->
          <div class="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
            <span class="text-xs font-bold text-stone-800 dark:text-stone-200 block">الدفع المباشر عبر بطاقات الائتمان المعتمدة:</span>
            <div class="flex items-center gap-3">
              <div class="flex-1 p-2 rounded-xl border border-blue-500/30 bg-blue-500/5 flex items-center justify-center gap-2">
                <UIcon name="i-mdi-credit-card-outline" class="w-5 h-5 text-blue-600" />
                <span class="text-xs font-extrabold text-blue-600 font-mono">VISA</span>
              </div>
              <div class="flex-1 p-2 rounded-xl border border-red-500/30 bg-red-500/5 flex items-center justify-center gap-2">
                <UIcon name="i-mdi-credit-card-multiple-outline" class="w-5 h-5 text-red-500" />
                <span class="text-xs font-extrabold text-red-500 font-mono">Mastercard</span>
              </div>
            </div>
            <p class="text-[11px] text-stone-500 leading-tight">
              معالجة آمنة ومشفرة مباشرة بالتعاون مع بوابة ميسار (Moyasar) المرخصة من البنك المركزي السعودي.
            </p>
          </div>

          <!-- Submit Button -->
          <UButton
            block
            color="amber"
            size="xl"
            :loading="isProcessing"
            :disabled="!canSubmit"
            class="font-extrabold rounded-2xl shadow-lg hover:shadow-amber-500/40 transition-all text-stone-950 text-base"
            @click="initiateBookingAndPayment"
          >
            <template #leading>
              <UIcon name="i-mdi-lock-check" class="w-5 h-5" />
            </template>
            الانتقال للسداد بـ فيزا / ماستركارد ({{ grandTotalSar }} ر.س)
          </UButton>

          <p v-if="!canSubmit" class="text-[11px] text-amber-600 dark:text-amber-400 text-center">
            * يرجى إكمال بيانات الضيف وتحديد التواريخ والموافقة على السياسات النظامية للمتابعة.
          </p>
        </div>

        <!-- 24/7 Assistance Note -->
        <div class="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-mdi-headset" class="w-5 h-5 text-emerald-500 shrink-0" />
            <span>هل تواجه أي استفسار حول الحجز أو السداد؟</span>
          </div>
          <a
            :href="`https://wa.me/${content.support.whatsapp.replace(/[^0-9]/g, '')}`"
            target="_blank"
            class="text-emerald-600 font-bold hover:underline shrink-0"
          >
            واتساب 24/7
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useCmsContent } from "~/composables/useCmsContent";

const { content } = useCmsContent();
const route = useRoute();
const config = useRuntimeConfig();
const db = useFirestore();
const toast = useToast();

const isSandboxMode = computed(() => !!config.public.isPaymentSandbox);

const availableItems = computed(() => {
  return content.value.prices?.items || [];
});

const selectedItemId = ref<string>("");

onMounted(() => {
  const qItem = route.query.itemId as string;
  if (qItem && availableItems.value.some((i) => i.id === qItem)) {
    selectedItemId.value = qItem;
  } else if (availableItems.value.length > 0) {
    selectedItemId.value = availableItems.value[0].id;
  }
});

const selectedItem = computed(() => {
  return availableItems.value.find((i) => i.id === selectedItemId.value) || availableItems.value[0];
});

// Dates setup
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const formatDate = (d: Date) => d.toISOString().split("T")[0];

const minCheckInDate = formatDate(today);

const dates = reactive({
  checkIn: formatDate(today),
  checkOut: formatDate(tomorrow),
});

const guestCount = ref(2);
const roomsCount = ref(1);

const guest = reactive({
  name: "",
  phone: "",
  email: "",
  notes: "",
});

const agreements = reactive({
  policies: true,
  refund: true,
  insurance: true,
});

const totalNights = computed(() => {
  if (!dates.checkIn || !dates.checkOut) return 1;
  const start = new Date(dates.checkIn).getTime();
  const end = new Date(dates.checkOut).getTime();
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
});

const grandTotalSar = computed(() => {
  const baseRate = selectedItem.value?.priceSar || 0;
  return baseRate * totalNights.value * roomsCount.value;
});

const vatAmount = computed(() => {
  // 15% VAT component calculated from inclusive total: Total - (Total / 1.15)
  const total = grandTotalSar.value;
  const sub = Math.round((total / 1.15) * 100) / 100;
  return Math.round((total - sub) * 100) / 100;
});

const subtotalBeforeVat = computed(() => {
  return Math.round((grandTotalSar.value - vatAmount.value) * 100) / 100;
});

const canSubmit = computed(() => {
  return (
    !!selectedItem.value &&
    !!guest.name.trim() &&
    !!guest.phone.trim() &&
    !!guest.email.trim() &&
    agreements.policies &&
    agreements.refund &&
    agreements.insurance
  );
});

const isProcessing = ref(false);

const initiateBookingAndPayment = async () => {
  if (!canSubmit.value) return;

  try {
    isProcessing.value = true;

    // 1. Create a pending booking record in Firestore
    const bookingRef = await addDoc(collection(db, "bookings"), {
      itemId: selectedItem.value.id,
      itemNameAr: selectedItem.value.nameAr,
      itemNameEn: selectedItem.value.nameEn,
      permitNumber: selectedItem.value.permitNumber || "73103970",
      totalNights: totalNights.value,
      roomsCount: roomsCount.value,
      guestCount: guestCount.value,
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
      guestName: guest.name,
      guestPhone: guest.phone,
      guestEmail: guest.email,
      guestNotes: guest.notes || "",
      amountSar: grandTotalSar.value,
      amountHalalas: grandTotalSar.value * 100,
      vatAmountSar: vatAmount.value,
      status: "pending_payment",
      paymentGateway: "moyasar",
      acceptedCards: ["visa", "mastercard"],
      isSandbox: isSandboxMode.value,
      licenseNumber: content.value.legal.licenseNumber,
      createdAt: serverTimestamp(),
      createdDateString: new Date().toLocaleString("ar-SA"),
    });

    const bookingId = bookingRef.id;

    // 2. Call Nitro server endpoint to initialize Moyasar invoice / payment
    const callbackUrl = `${window.location.origin}/booking/callback?bookingId=${bookingId}`;

    const paymentResponse: any = await $fetch("/api/payments/create", {
      method: "POST",
      body: {
        amountHalalas: grandTotalSar.value * 100,
        description: `حجز ${selectedItem.value.nameAr} - مؤسسة بروج (ترخيص: ${content.value.legal.licenseNumber})`,
        bookingId,
        guestName: guest.name,
        guestEmail: guest.email,
        guestPhone: guest.phone,
        callbackUrl,
      },
    });

    if (paymentResponse?.url) {
      // Redirect to Moyasar payment checkout or sandbox handler
      window.location.href = paymentResponse.url;
    } else {
      throw new Error("لم يتم استلام رابط السداد من بوابة الدفع");
    }
  } catch (err: any) {
    console.error("Booking submission error:", err);
    toast.add({
      title: "تعذر بدء عملية الدفع",
      description: err?.message || "يرجى التحقق من البيانات والمحاولة مجدداً.",
      color: "red",
      icon: "i-mdi-alert-circle",
    });
  } finally {
    isProcessing.value = false;
  }
};

useHead({
  title: "الحجز والدفع الإلكتروني المباشر (فيزا وماستركارد) | مؤسسة بروج المميزة للسياحة",
  meta: [
    {
      name: "description",
      content: "خدمة الحجز والسداد المباشر ببطاقات فيزا وماستركارد بأسعار إجمالية شاملة لضريبة القيمة المضافة 15% مع إصدار فوري لمستند الحجز.",
    },
  ],
});
</script>
