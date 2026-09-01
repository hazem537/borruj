<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <!-- Header with Breadcrumbs and Language Toggle -->
    <div class="glass-panel rounded-3xl p-6 md:p-10 shadow-xl border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <ULink to="/" class="hover:text-amber-500 transition-colors">{{ t.nav.home }}</ULink>
          <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" class="w-3.5 h-3.5" />
          <span class="text-amber-500 font-semibold">{{ isEn ? 'Statutory Policies & Guarantees' : 'السياسات والضمانات النظامية' }}</span>
        </div>
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
          <UIcon name="i-mdi-file-certificate-outline" class="text-amber-500" />
          <span>{{ isEn ? 'Statutory Policies & Guest Rights' : 'السياسات والشروط والضمانات النظامية' }}</span>
        </h1>
        <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl">
          {{ isEn
            ? 'Compliant with the Ministry of Tourism Travel and Tourism Services Regulations (Articles 18, 20, 22, and 23).'
            : 'معدّة وفقاً للائحة خدمات السفر والسياحة الصادرة عن وزارة السياحة بالمملكة العربية السعودية (المواد 18، 20، 22، 23).' }}
        </p>
      </div>

      <!-- Language Toggle AR / EN -->
      <div class="flex items-center gap-2 bg-stone-100 dark:bg-stone-800/80 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-700 shrink-0">
        <button
          type="button"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
          :class="!isEn ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'"
          @click="setLang('ar')"
        >
          العربية (AR)
        </button>
        <button
          type="button"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
          :class="isEn ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'"
          @click="setLang('en')"
        >
          English (EN)
        </button>
      </div>
    </div>

    <!-- Legal Establishment Identification Box -->
    <div class="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4 text-xs">
      <div class="flex flex-wrap items-center gap-3">
        <span class="font-bold text-stone-900 dark:text-stone-100 text-sm">{{ isEn ? (content.legal.tradeNameEn || content.legal.tradeName) : content.legal.tradeName }}</span>
        <span>{{ t.legal.crLabel }} <strong class="font-mono">{{ content.legal.crNumber }}</strong></span>
        <span>{{ t.legal.licenseLabel }} <strong class="font-mono text-emerald-600 dark:text-emerald-400">{{ content.legal.licenseNumber }}</strong></span>
        <span>{{ t.legal.categoryLabel }} <strong>{{ isEn ? (content.legal.licenseCategoryEn || content.legal.licenseCategory) : content.legal.licenseCategory }}</strong></span>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
          <UIcon name="i-mdi-headset" class="w-4 h-4" />
          <span>{{ t.legal.support247 }}: {{ content.support.phone }}</span>
        </span>
      </div>
    </div>

    <!-- Quick Navigation Index -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <a
        href="#booking-policy"
        class="p-4 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 hover:shadow-md transition-all flex items-center gap-3 group"
      >
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
          <UIcon name="i-mdi-book-check-outline" class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xs font-bold text-stone-900 dark:text-stone-100">{{ isEn ? '1. Booking Terms & Doc' : '1. سياسة وشروط الحجز' }}</h2>
          <span class="text-[11px] text-stone-500">{{ isEn ? 'Issuance & confirmation' : 'آلية الحجز وإصدار السند' }}</span>
        </div>
      </a>

      <a
        href="#cancellation-policy"
        class="p-4 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 hover:shadow-md transition-all flex items-center gap-3 group"
      >
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
          <UIcon name="i-mdi-calendar-clock-outline" class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xs font-bold text-stone-900 dark:text-stone-100">{{ isEn ? '2. Cancellation & SLA' : '2. الإلغاء والتعديل' }}</h2>
          <span class="text-[11px] text-stone-500">{{ isEn ? 'Response SLA: ≤24h' : 'البت خلال 24 ساعة' }}</span>
        </div>
      </a>

      <a
        href="#insurance-policy"
        class="p-4 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 hover:shadow-md transition-all flex items-center gap-3 group"
      >
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
          <UIcon name="i-mdi-shield-lock-outline" class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xs font-bold text-stone-900 dark:text-stone-100">{{ isEn ? '3. Security Deposit' : '3. مبالغ التأمين' }}</h2>
          <span class="text-[11px] text-stone-500">{{ isEn ? 'Clear zero-deposit policy' : 'شروط وآلية الاسترجاع' }}</span>
        </div>
      </a>

      <a
        href="#refund-policy"
        class="p-4 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 hover:shadow-md transition-all flex items-center gap-3 group"
      >
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
          <UIcon name="i-mdi-cash-refund" class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xs font-bold text-stone-900 dark:text-stone-100">{{ isEn ? '4. Article 23 Refund' : '4. سياسة الاسترجاع' }}</h2>
          <span class="text-[11px] text-stone-500">{{ isEn ? 'Equivalent or full refund' : 'المادة 23: استرجاع أو بديل' }}</span>
        </div>
      </a>
    </div>

    <!-- Section 1: Booking Terms & Confirmation Document -->
    <section id="booking-policy" class="glass-panel p-6 md:p-8 rounded-3xl shadow-lg border border-stone-200 dark:border-stone-800 space-y-4">
      <div class="flex items-center gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
        <div class="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg">1</div>
        <div>
          <h2 class="text-xl font-bold text-stone-900 dark:text-stone-100">
            {{ isEn ? 'Booking Terms & Document Issuance (Article 22 - Paragraph 1)' : 'سياسة وشروط الحجز وإصدار المستند (المادة الثانية والعشرون — الفقرة ١ و ١/أ)' }}
          </h2>
          <p class="text-xs text-stone-500">{{ isEn ? 'Statutory booking workflow and digital receipt commitment' : 'إلزامية تسليم السائح وثيقة الحجز الإلكترونية' }}</p>
        </div>
      </div>

      <div class="prose-custom text-stone-700 dark:text-stone-300 text-sm md:text-base leading-relaxed" v-html="isEn ? content.policies.bookingPolicyEn : content.policies.bookingPolicyAr"></div>

      <div class="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-stone-700 dark:text-stone-300 space-y-2">
        <span class="font-bold text-amber-600 dark:text-amber-400 block">{{ isEn ? 'Key Information Included on Every Booking Receipt:' : 'البيانات الإلزامية في وثيقة الحجز الصادرة للعميل:' }}</span>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <li class="flex items-center gap-1.5"><UIcon name="i-mdi-check-circle" class="text-emerald-500 shrink-0" /><span>{{ isEn ? 'Booking Reference & Issue Date' : 'الرقم المرجعي وتاريخ الإصدار' }}</span></li>
          <li class="flex items-center gap-1.5"><UIcon name="i-mdi-check-circle" class="text-emerald-500 shrink-0" /><span>{{ isEn ? 'Licensed Facility Name & Permit #' : 'اسم المرفق ورقم تصريح وزارة السياحة' }}</span></li>
          <li class="flex items-center gap-1.5"><UIcon name="i-mdi-check-circle" class="text-emerald-500 shrink-0" /><span>{{ isEn ? 'Check-in and Check-out Times' : 'مواعيد تسجيل الدخول والخروج' }}</span></li>
          <li class="flex items-center gap-1.5"><UIcon name="i-mdi-check-circle" class="text-emerald-500 shrink-0" /><span>{{ isEn ? 'Total Price with 15% VAT Breakdown' : 'السعر الإجمالي وتفصيل ضريبة 15%' }}</span></li>
        </ul>
      </div>
    </section>

    <!-- Section 2: Cancellation & Modification Policy -->
    <section id="cancellation-policy" class="glass-panel p-6 md:p-8 rounded-3xl shadow-lg border border-stone-200 dark:border-stone-800 space-y-4">
      <div class="flex items-center gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
        <div class="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg">2</div>
        <div>
          <h2 class="text-xl font-bold text-stone-900 dark:text-stone-100">
            {{ isEn ? 'Cancellation & Modification Policy (Article 22 - Paragraph 2)' : 'سياسة وإجراءات إلغاء وتعديل الحجز (المادة الثانية والعشرون — الفقرة ٢)' }}
          </h2>
          <p class="text-xs text-stone-500">{{ isEn ? 'Guaranteed response SLA within 24 hours' : 'تحديد آلية التقديم والتزام الرد خلال مدة محددة لا تتجاوز 24 ساعة' }}</p>
        </div>
      </div>

      <div class="prose-custom text-stone-700 dark:text-stone-300 text-sm md:text-base leading-relaxed" v-html="isEn ? content.policies.cancellationPolicyEn : content.policies.cancellationPolicyAr"></div>

      <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-800 dark:text-emerald-300">
        <UIcon name="i-mdi-clock-fast" class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <span class="font-bold block">{{ isEn ? 'Response SLA Commitment:' : 'الالتزام الزمني بالرد والبت في طلبات الإلغاء:' }}</span>
          <span>
            {{ isEn
              ? `Burouj Al Mumayaza commits to deciding upon any cancellation/modification request within ${content.policies.cancelResponseHours} hours max from official submission.`
              : `تلتزم مؤسسة بروج المميزة بالرد على طلب الإلغاء أو التعديل والبت فيه خلال مدة لا تتجاوز ${content.policies.cancelResponseHours} ساعة من استلام الطلب.` }}
          </span>
        </div>
      </div>
    </section>

    <!-- Section 3: Security Deposit Policy -->
    <section id="insurance-policy" class="glass-panel p-6 md:p-8 rounded-3xl shadow-lg border border-stone-200 dark:border-stone-800 space-y-4">
      <div class="flex items-center gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
        <div class="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg">3</div>
        <div>
          <h2 class="text-xl font-bold text-stone-900 dark:text-stone-100">
            {{ isEn ? 'Security Deposit & Insurance Policy (Article 22 - Paragraph 3)' : 'سياسة مبالغ التأمين وشروط وآلية استرجاعها (المادة الثانية والعشرون — الفقرة ٣)' }}
          </h2>
          <p class="text-xs text-stone-500">{{ isEn ? 'Transparency on incidental deposit requirements' : 'توضيح فرض التأمين من عدمه وآلية رده فور الاستحقاق' }}</p>
        </div>
      </div>

      <div class="prose-custom text-stone-700 dark:text-stone-300 text-sm md:text-base leading-relaxed" v-html="isEn ? content.policies.insurancePolicyEn : content.policies.insurancePolicyAr"></div>
    </section>

    <!-- Section 4: Refund Policy (Article 23) -->
    <section id="refund-policy" class="glass-panel p-6 md:p-8 rounded-3xl shadow-lg border border-stone-200 dark:border-stone-800 space-y-4">
      <div class="flex items-center gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
        <div class="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg">4</div>
        <div>
          <h2 class="text-xl font-bold text-stone-900 dark:text-stone-100">
            {{ isEn ? 'Refund Policy (Statutory Compliance with Article 23)' : 'سياسة استرجاع المبالغ (وفق المادة الثالثة والعشرون من اللائحة)' }}
          </h2>
          <p class="text-xs text-stone-500">{{ isEn ? 'Equivalent alternative or immediate 100% refund without deduction' : 'تخيير السائح بين خدمة بديلة مساوية أو استرجاع كامل المبلغ دون استقطاع' }}</p>
        </div>
      </div>

      <div class="prose-custom text-stone-700 dark:text-stone-300 text-sm md:text-base leading-relaxed" v-html="isEn ? content.policies.refundPolicyEn : content.policies.refundPolicyAr"></div>

      <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-stone-800 dark:text-stone-200">
        <UIcon name="i-mdi-cash-fast" class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span class="font-bold block">{{ isEn ? 'Statutory Refund Execution Period:' : 'المدة الزمنية لإعادة المبلغ للحساب:' }}</span>
          <span>
            {{ isEn
              ? `Refund transactions are issued immediately and processed to guest's original payment method within ${content.policies.refundExecutionDays} business days.`
              : `يتم إصدار أمر الاسترجاع فورياً وتصل المبالغ لحساب العميل البنكي خلال ${content.policies.refundExecutionDays} أيام عمل كحد أقصى.` }}
          </span>
        </div>
      </div>
    </section>

    <!-- Bottom Actions -->
    <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
      <ULink
        to="/#contactUs"
        class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
      >
        <UIcon name="i-mdi-email-edit-outline" />
        <span>{{ isEn ? 'Submit Cancellation / Inquiry Request' : 'تقديم طلب إلغاء أو استفسار رسمي' }}</span>
      </ULink>

      <a
        :href="`https://wa.me/${content.support.whatsapp.replace(/[^0-9]/g, '')}`"
        target="_blank"
        rel="noopener noreferrer"
        class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
      >
        <UIcon name="i-mdi-whatsapp" />
        <span>{{ isEn ? 'Instant 24/7 Support Desk' : 'محادثة الدعم المباشر (24/7)' }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCmsContent } from "~/composables/useCmsContent";
import { useAppLang } from "~/composables/useAppLang";

const { content } = useCmsContent();
const { isEn, t, setLang } = useAppLang();

useHead({
  title: () => isEn.value
    ? "Statutory Policies & Guarantees | Burouj Al Mumayaza Tourism (License #73103970)"
    : "السياسات والضمانات النظامية | مؤسسة بروج المميزة للسياحة (ترخيص 73103970)",
  meta: [
    {
      name: "description",
      content: () => isEn.value
        ? "Official statutory policies for booking, cancellation (24h response), security deposits, and full refunds (Article 23) in compliance with Saudi Ministry of Tourism regulations."
        : "السياسات والضمانات النظامية لحجوزات مؤسسة بروج المميزة للسياحة: سياسة الحجز، الإلغاء والتعديل خلال 24 ساعة، مبالغ التأمين، والاسترجاع المالي الفوري أو البديل طبقاً للمادة 23 من لائحة وزارة السياحة.",
    },
  ],
});
</script>
