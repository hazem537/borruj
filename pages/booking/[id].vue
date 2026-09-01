<template>
  <div class="max-w-4xl mx-auto px-4 py-12 space-y-8" dir="rtl">
    <!-- Breadcrumb -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-2 text-xs text-stone-500">
        <ULink to="/" class="hover:text-amber-500">الرئيسية</ULink>
        <UIcon name="i-mdi-chevron-left" class="w-3 h-3" />
        <ULink to="/booking" class="hover:text-amber-500">الحجز والدفع</ULink>
        <UIcon name="i-mdi-chevron-left" class="w-3 h-3" />
        <span class="text-amber-500 font-semibold">مستند الحجز</span>
      </div>

      <button
        type="button"
        class="px-4 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-50 flex items-center gap-1.5 shadow-sm print:hidden"
        @click="printReceipt"
      >
        <UIcon name="i-mdi-printer" class="w-4 h-4 text-amber-500" />
        <span>طباعة المستند</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="glass-panel p-12 rounded-3xl shadow-xl text-center">
      <UIcon name="i-mdi-loading" class="w-10 h-10 text-amber-500 animate-spin mx-auto mb-3" />
      <p class="text-xs text-stone-500">جاري تحميل مستند الحجز...</p>
    </div>

    <!-- Booking Receipt -->
    <div v-else-if="booking" class="glass-panel p-6 sm:p-10 rounded-3xl shadow-xl border border-stone-200 dark:border-stone-800 space-y-8 bg-white dark:bg-stone-900">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <UIcon name="i-mdi-office-building" class="w-8 h-8" />
          </div>
          <div>
            <span class="text-xl font-extrabold text-stone-900 dark:text-stone-100 block">{{ content.legal.tradeName }}</span>
            <span class="text-xs text-stone-500">
              ترخيص وزارة السياحة: <strong class="font-mono text-emerald-600">{{ content.legal.licenseNumber }}</strong> | س.ت: <strong class="font-mono">{{ content.legal.crNumber }}</strong>
            </span>
          </div>
        </div>

        <div class="text-left sm:text-right">
          <span class="text-[11px] text-stone-400 block">رقم الحجز:</span>
          <span class="text-sm font-mono font-extrabold text-amber-600 dark:text-amber-400" dir="ltr">{{ route.params.id }}</span>
          <span class="text-[10px] text-stone-400 block">{{ booking.createdDateString || '-' }}</span>
        </div>
      </div>

      <!-- Status Pill -->
      <div class="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
        <span class="text-xs font-semibold text-stone-700 dark:text-stone-300">حالة مستند الحجز:</span>
        <span
          class="px-3 py-1 rounded-xl text-xs font-bold"
          :class="booking.status === 'paid' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'"
        >
          {{ booking.status === 'paid' ? 'مؤكد ومسدد بالكامل (PAID)' : 'قيد السداد' }}
        </span>
      </div>

      <!-- Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
          <h3 class="font-bold text-amber-600 dark:text-amber-400">بيانات الضيف</h3>
          <div class="flex justify-between"><span>الاسم:</span><strong>{{ booking.guestName }}</strong></div>
          <div class="flex justify-between"><span>الجوال:</span><span dir="ltr">{{ booking.guestPhone }}</span></div>
          <div class="flex justify-between"><span>البريد:</span><span>{{ booking.guestEmail }}</span></div>
        </div>

        <div class="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
          <h3 class="font-bold text-amber-600 dark:text-amber-400">تفاصيل الإقامة</h3>
          <div class="flex justify-between"><span>الوحدة:</span><strong>{{ booking.itemNameAr }}</strong></div>
          <div class="flex justify-between"><span>رقم تصريح المرفق:</span><strong class="font-mono text-emerald-600">{{ booking.permitNumber }}</strong></div>
          <div class="flex justify-between"><span>تاريخ الدخول:</span><span>{{ booking.checkIn }}</span></div>
          <div class="flex justify-between"><span>تاريخ الخروج:</span><span>{{ booking.checkOut }}</span></div>
        </div>
      </div>

      <!-- Financials -->
      <div class="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
        <div class="flex justify-between text-stone-600 dark:text-stone-400">
          <span>المبلغ قبل الضريبة:</span>
          <span class="font-mono">{{ Math.round((booking.amountSar / 1.15) * 100) / 100 }} ر.س</span>
        </div>
        <div class="flex justify-between text-emerald-700 dark:text-emerald-400">
          <span>ضريبة القيمة المضافة 15%:</span>
          <span class="font-mono">{{ booking.vatAmountSar || (Math.round((booking.amountSar - (booking.amountSar / 1.15)) * 100) / 100) }} ر.س</span>
        </div>
        <div class="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between items-baseline text-sm font-extrabold text-stone-900 dark:text-stone-100">
          <span>الإجمالي المسدد:</span>
          <span class="text-lg text-amber-500 font-mono">{{ booking.amountSar }} ر.س</span>
        </div>
      </div>

      <!-- Statutory SLA Terms -->
      <div class="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-stone-600 dark:text-stone-300 space-y-1">
        <p><strong>سياسة الإلغاء والتعديل:</strong> البت والرد خلال مدة أقصاها 24 ساعة.</p>
        <p><strong>المادة 23:</strong> عند تعذر تقديم الخدمة، تخيير السائح بين بديل مساوٍ أو استرجاع فوري كامل دون خصم أي رسوم.</p>
        <p><strong>خدمة 24/7:</strong> هاتف: {{ content.support.phone }} | واتساب: {{ content.support.whatsapp }}</p>
      </div>
    </div>

    <div v-else class="glass-panel p-12 rounded-3xl shadow-xl text-center space-y-4">
      <UIcon name="i-mdi-alert-circle-outline" class="w-12 h-12 text-amber-500 mx-auto" />
      <h2 class="text-lg font-bold">لم يتم العثور على الحجز</h2>
      <ULink to="/booking" class="text-amber-500 underline text-xs">العودة لصفحة الحجز</ULink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { doc } from "firebase/firestore";
import { useDocument, useFirestore } from "vuefire";
import { useCmsContent } from "~/composables/useCmsContent";

const route = useRoute();
const db = useFirestore();
const { content } = useCmsContent();

const bookingDoc = doc(db, "bookings", String(route.params.id));
const { data: booking, pending } = useDocument(bookingDoc);

const printReceipt = () => {
  window.print();
};
</script>

<style scoped>
@media print {
  .print\:hidden {
    display: none !important;
  }
}
</style>
