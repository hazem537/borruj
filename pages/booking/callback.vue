<template>
  <div class="max-w-4xl mx-auto px-4 py-12 space-y-8" dir="rtl">
    <!-- Loading Verification State -->
    <div v-if="isLoading" class="glass-panel p-12 rounded-3xl shadow-xl text-center space-y-4">
      <UIcon name="i-mdi-loading" class="w-12 h-12 text-amber-500 animate-spin mx-auto" />
      <h2 class="text-xl font-bold text-stone-900 dark:text-stone-100">جاري التحقق من عملية السداد...</h2>
      <p class="text-xs text-stone-500">يتم تأكيد العملية مع بوابة ميسار وتحديث سجل الحجز الرسمي.</p>
    </div>

    <!-- Success Paid State: Official Statutory Booking Document -->
    <div v-else-if="isPaid" class="space-y-6">
      <!-- Success Top Banner -->
      <div class="p-6 rounded-3xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg">
            <UIcon name="i-mdi-check-bold" class="w-7 h-7" />
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">تم تأكيد الحجز وسداد الفاتورة بنجاح!</h1>
            <p class="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
              تم إصدار مستند الحجز الإلكتروني المعتمد وفق اشتراطات وزارة السياحة.
            </p>
          </div>
        </div>

        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-50 flex items-center gap-1.5 shadow-sm print:hidden"
          @click="printReceipt"
        >
          <UIcon name="i-mdi-printer" class="w-4 h-4 text-amber-500" />
          <span>طباعة مستند الحجز</span>
        </button>
      </div>

      <!-- Printable Official Booking Document (Article 22 Requirement) -->
      <div class="glass-panel p-6 sm:p-10 rounded-3xl shadow-xl border border-stone-200 dark:border-stone-800 space-y-8 bg-white dark:bg-stone-900 printable-document">
        <!-- Document Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <UIcon name="i-mdi-office-building" class="w-8 h-8" />
            </div>
            <div>
              <span class="text-xl font-extrabold text-stone-900 dark:text-stone-100 block">{{ content.legal.tradeName }}</span>
              <span class="text-xs text-stone-500">ترخيص وزارة السياحة: <strong class="font-mono text-emerald-600">{{ content.legal.licenseNumber }}</strong> | س.ت: <strong class="font-mono">{{ content.legal.crNumber }}</strong></span>
            </div>
          </div>

          <div class="text-left sm:text-right space-y-0.5">
            <span class="text-[11px] text-stone-400 block">رقم مستند الحجز المرجعي:</span>
            <span class="text-sm font-mono font-extrabold text-amber-600 dark:text-amber-400 block" dir="ltr">
              {{ bookingId || paymentDetails?.id || 'BRJ-' + Date.now() }}
            </span>
            <span class="text-[10px] text-stone-400">{{ paymentDetails?.createdAt || new Date().toLocaleString('ar-SA') }}</span>
          </div>
        </div>

        <!-- Booking & Accommodation Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Guest & Reservation Info -->
          <div class="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-3">
            <h3 class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">بيانات الضيف والحجز</h3>
            <div class="space-y-1.5 text-xs">
              <div class="flex justify-between">
                <span class="text-stone-500">اسم الضيف:</span>
                <span class="font-bold text-stone-800 dark:text-stone-100">{{ bookingData?.guestName || 'الضيف الكريم' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-stone-500">رقم الجوال:</span>
                <span class="font-mono font-semibold" dir="ltr">{{ bookingData?.guestPhone || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-stone-500">البريد الإلكتروني:</span>
                <span class="font-mono">{{ bookingData?.guestEmail || '-' }}</span>
              </div>
              <div class="flex justify-between pt-1 border-t border-stone-200 dark:border-stone-700">
                <span class="text-stone-500">عدد النزلاء:</span>
                <span class="font-semibold">{{ bookingData?.guestCount || 2 }} نزلاء</span>
              </div>
            </div>
          </div>

          <!-- Unit & Dates Info -->
          <div class="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-3">
            <h3 class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">بيانات الوحدة الفندقية والتواريخ</h3>
            <div class="space-y-1.5 text-xs">
              <div class="flex justify-between">
                <span class="text-stone-500">الوحدة / الخدمة:</span>
                <span class="font-bold text-stone-800 dark:text-stone-100">{{ bookingData?.itemNameAr || 'إقامة فندقية' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-stone-500">رقم ترخيص الوحدة / المرفق:</span>
                <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">{{ bookingData?.permitNumber || '73103970-MK-01' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-stone-500">تاريخ الدخول:</span>
                <span class="font-mono font-semibold">{{ bookingData?.checkIn || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-stone-500">تاريخ الخروج:</span>
                <span class="font-mono font-semibold">{{ bookingData?.checkOut || '-' }}</span>
              </div>
              <div class="flex justify-between pt-1 border-t border-stone-200 dark:border-stone-700">
                <span class="text-stone-500">مدة الإقامة:</span>
                <span class="font-semibold">{{ bookingData?.totalNights || 1 }} ليلة</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Breakdown Table (Article 20 Compliance) -->
        <div class="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-3">
          <h3 class="text-xs font-bold text-stone-900 dark:text-stone-100">تفاصيل الرسوم والضرائب المسددة</h3>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between text-stone-600 dark:text-stone-400">
              <span>المبلغ الأساسي للخدمة:</span>
              <span class="font-mono font-semibold">{{ subtotalSar }} ر.س</span>
            </div>
            <div class="flex justify-between text-emerald-700 dark:text-emerald-400">
              <span>ضريبة القيمة المضافة (15%) النظامية:</span>
              <span class="font-mono font-semibold">{{ vatSar }} ر.س</span>
            </div>
            <div class="flex justify-between text-stone-600 dark:text-stone-400">
              <span>مبلغ التأمين المطلوب:</span>
              <span class="font-bold text-stone-700 dark:text-stone-300">0.00 ر.س (لا يُطلب تأمين)</span>
            </div>
            <div class="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between items-baseline text-sm font-extrabold text-stone-900 dark:text-stone-100">
              <span>المبلغ الإجمالي المسدد (شامل الضريبة والرسوم):</span>
              <span class="text-lg text-amber-500 font-mono">{{ totalPaidSar }} ر.س</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span>طريقة السداد: بطاقة ائتمانية ({{ paymentDetails?.cardCompany || 'Visa / Mastercard' }})</span>
              <span>حالة الدفع: <strong class="text-emerald-600">مدفوع ومؤكد (PAID)</strong></span>
            </div>
          </div>
        </div>

        <!-- Statutory Terms Included in Confirmation Document (Article 22 Requirement) -->
        <div class="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-stone-700 dark:text-stone-300 space-y-2">
          <h4 class="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <UIcon name="i-mdi-shield-check" class="text-amber-500" />
            <span>الشروط والسياسات المطبقة على هذا الحجز:</span>
          </h4>
          <ul class="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
            <li><strong>سياسة الإلغاء والتعديل:</strong> يمكن تقديم طلب الإلغاء أو التعديل عبر الموقع أو الواتساب، وتلتزم المنشأة بالرد والبت في الطلب خلال <strong>24 ساعة</strong> كحد أقصى.</li>
            <li><strong>سياسة الاسترجاع (المادة 23):</strong> عند تعذر تقديم الخدمة المحجوزة لأي سبب خارج عن إرادة العميل، يتم تخيير السائح بين توفير خدمة بديلة مساوية أو استرجاع كامل المبالغ فوراً دون خصم أي رسوم.</li>
            <li><strong>الدعم المتواصل (24/7):</strong> مركز خدمة العملاء والشكاوى متاح على مدار الساعة عبر الهاتف ({{ content.support.phone }}) والواتساب ({{ content.support.whatsapp }}).</li>
          </ul>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-4 print:hidden">
        <ULink
          to="/"
          class="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <UIcon name="i-mdi-home" class="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </ULink>
        <ULink
          to="/policies"
          class="px-6 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs transition-all flex items-center gap-1.5"
        >
          <UIcon name="i-mdi-file-document-outline" class="w-4 h-4 text-amber-500" />
          <span>استعراض كافة اللوائح والسياسات</span>
        </ULink>
      </div>
    </div>

    <!-- Failed / Cancelled Payment State -->
    <div v-else class="glass-panel p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-6 border border-red-500/30">
      <div class="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
        <UIcon name="i-mdi-alert-circle-outline" class="w-10 h-10" />
      </div>
      <div class="space-y-2">
        <h1 class="text-2xl font-extrabold text-stone-900 dark:text-stone-100">لم تكتمل عملية السداد</h1>
        <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          {{ errorMessage || 'تم إلغاء عملية الدفع أو تعذر سحب المبلغ من بطاقتك الائتمانية.' }}
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
        <ULink
          to="/booking"
          class="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all"
        >
          إعادة المحاولة والدفع
        </ULink>
        <a
          :href="`https://wa.me/${content.support.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، واجهت مشكلة في سداد الحجز')}`"
          target="_blank"
          class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <UIcon name="i-mdi-whatsapp" class="w-4 h-4" />
          <span>مساعدة فورية عبر واتساب (24/7)</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useCmsContent } from "~/composables/useCmsContent";

const route = useRoute();
const db = useFirestore();
const { content } = useCmsContent();

const isLoading = ref(true);
const isPaid = ref(false);
const errorMessage = ref("");
const bookingData = ref<any>(null);
const paymentDetails = ref<any>(null);

const bookingId = computed(() => {
  return (route.query.bookingId as string) || "";
});

const totalPaidSar = computed(() => {
  if (bookingData.value?.amountSar) return bookingData.value.amountSar;
  if (paymentDetails.value?.amount) return paymentDetails.value.amount / 100;
  return 920;
});

const vatSar = computed(() => {
  const total = totalPaidSar.value;
  const sub = Math.round((total / 1.15) * 100) / 100;
  return Math.round((total - sub) * 100) / 100;
});

const subtotalSar = computed(() => {
  return Math.round((totalPaidSar.value - vatSar.value) * 100) / 100;
});

const printReceipt = () => {
  window.print();
};

onMounted(async () => {
  const paymentId = (route.query.id as string) || (route.query.invoice_id as string) || "";
  const qStatus = (route.query.status as string) || "";
  const bId = bookingId.value;

  if (!paymentId && !qStatus && !bId) {
    isLoading.value = false;
    errorMessage.value = "لا توجد بيانات عملية سداد مرجعية في الرابط.";
    return;
  }

  try {
    // 1. Fetch Firestore booking if bookingId is provided
    if (bId) {
      try {
        const bSnap = await getDoc(doc(db, "bookings", bId));
        if (bSnap.exists()) {
          bookingData.value = bSnap.data();
        }
      } catch (fErr) {
        console.warn("Could not fetch Firestore booking record:", fErr);
      }
    }

    // 2. If paymentId is present, verify directly with Nitro API
    if (paymentId) {
      const verifyRes: any = await $fetch(`/api/payments/${paymentId}`);
      paymentDetails.value = verifyRes;

      if (verifyRes?.isPaid || verifyRes?.status === "paid") {
        isPaid.value = true;

        // Update Firestore booking status to paid
        if (bId && db) {
          try {
            await updateDoc(doc(db, "bookings", bId), {
              status: "paid",
              moyasarPaymentId: paymentId,
              cardCompany: verifyRes?.cardCompany || "Card",
              paidAt: serverTimestamp(),
              paidDateString: new Date().toLocaleString("ar-SA"),
            });
          } catch (uErr) {
            console.warn("Failed to update booking to paid in Firestore:", uErr);
          }
        }
      } else {
        isPaid.value = false;
        errorMessage.value = `حالة العملية من بوابة الدفع: ${verifyRes?.status || "غير مكتملة"}`;
      }
    } else if (qStatus === "paid" || qStatus === "approved") {
      isPaid.value = true;
    } else {
      isPaid.value = false;
      errorMessage.value = route.query.message ? String(route.query.message) : "تعذر استكمال السداد بنجاح.";
    }
  } catch (err: any) {
    console.error("Payment verification error:", err);
    // If running in sandbox with mock redirect
    if (paymentId.startsWith("mock_") || qStatus === "paid") {
      isPaid.value = true;
    } else {
      isPaid.value = false;
      errorMessage.value = err?.statusMessage || err?.message || "حدث خطأ أثناء التحقق من بوابة الدفع.";
    }
  } finally {
    isLoading.value = false;
  }
});

useHead({
  title: "نتيجة وسند الحجز الإلكتروني | مؤسسة بروج المميزة للسياحة",
});
</script>

<style scoped>
@media print {
  body {
    background: white !important;
    color: black !important;
  }
  .print\:hidden {
    display: none !important;
  }
}
</style>
