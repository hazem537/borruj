<template>
  <footer class="w-full mt-16 border-t border-stone-200 dark:border-stone-800/80 bg-white/70 dark:bg-stone-950/90 backdrop-blur-md transition-colors text-start">
    <!-- Top License & Regulatory Commitment Bar -->
    <div class="border-b border-stone-200/80 dark:border-stone-800/80 bg-amber-500/5 py-3 px-4">
      <div class="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-300">
        <div class="flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
            <UIcon name="i-mdi-certificate" class="w-4 h-4 text-amber-500" />
            <span>{{ isEn ? (content.legal.tradeNameEn || content.legal.tradeName) : content.legal.tradeName }}</span>
          </span>
          <span class="text-stone-400">|</span>
          <span>{{ t.legal.crLabel }} <strong class="font-mono">{{ content.legal.crNumber }}</strong></span>
          <span class="text-stone-400">|</span>
          <span>{{ t.legal.licenseLabel }} <strong class="font-mono text-emerald-600 dark:text-emerald-400">{{ content.legal.licenseNumber }}</strong></span>
          <span class="text-stone-400">|</span>
          <span class="text-stone-500">{{ t.legal.categoryLabel }} {{ isEn ? (content.legal.licenseCategoryEn || content.legal.licenseCategory) : content.legal.licenseCategory }}</span>
        </div>

        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
            <UIcon name="i-mdi-clock-check-outline" class="w-3.5 h-3.5" />
            <span>{{ t.legal.inquiriesComplaints247 }}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand & Description -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1 shrink-0">
              <img src="/log.svg" alt="بروج" class="h-8 w-auto object-contain" onerror="this.style.display='none'" />
              <UIcon name="i-mdi-office-building" class="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <span class="text-amber-500 font-bold text-xl leading-none block">
                {{ isEn ? (content.hero.brandNameEn || t.brand) : (content.hero.brandName || t.brand) }}
              </span>
              <span class="text-xs text-stone-600 dark:text-stone-400">{{ t.brandSubtitle }}</span>
            </div>
          </div>
          <p class="text-xs md:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            {{ isEn ? (content.footer.aboutTextEn || content.footer.aboutText) : content.footer.aboutText }}
          </p>

          <!-- Accepted Payment Methods (Visible when enabled in CMS) -->
          <div v-if="content.features.enableDirectPayment" class="pt-2 border-t border-stone-200 dark:border-stone-800">
            <span class="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-2">{{ t.legal.acceptedCards }}</span>
            <div class="flex items-center gap-2">
              <div class="px-2.5 py-1 rounded-md bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 shadow-sm flex items-center gap-1.5" title="Visa">
                <UIcon name="i-mdi-credit-card-outline" class="w-4 h-4 text-blue-600" />
                <span class="text-xs font-bold text-blue-600 font-mono">VISA</span>
              </div>
              <div class="px-2.5 py-1 rounded-md bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 shadow-sm flex items-center gap-1.5" title="Mastercard">
                <UIcon name="i-mdi-credit-card-multiple-outline" class="w-4 h-4 text-red-500" />
                <span class="text-xs font-bold text-red-500 font-mono">Mastercard</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Navigation Links -->
        <div>
          <h4 class="text-sm font-bold text-amber-500 mb-4 flex items-center gap-1.5">
            <UIcon name="i-mdi-navigation-variant-outline" />
            <span>{{ t.footer.quickLinks }}</span>
          </h4>
          <ul class="space-y-2 text-xs md:text-sm text-stone-600 dark:text-stone-400">
            <li>
              <ULink to="/#hero" class="hover:text-amber-500 transition-colors flex items-center gap-1">
                <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" class="w-4 h-4 text-amber-500/70" />
                <span>{{ t.nav.home }}</span>
              </ULink>
            </li>
            <li>
              <ULink to="/#aboutUs" class="hover:text-amber-500 transition-colors flex items-center gap-1">
                <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" class="w-4 h-4 text-amber-500/70" />
                <span>{{ t.nav.about }}</span>
              </ULink>
            </li>
            <li>
              <ULink to="/#hotels" class="hover:text-amber-500 transition-colors flex items-center gap-1">
                <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" class="w-4 h-4 text-amber-500/70" />
                <span>{{ t.nav.hotels }}</span>
              </ULink>
            </li>
            <li>
              <ULink to="/#prices" class="hover:text-amber-500 transition-colors flex items-center gap-1">
                <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" class="w-4 h-4 text-amber-500/70" />
                <span>{{ t.nav.prices }}</span>
              </ULink>
            </li>
            <li>
              <ULink to="/policies" class="hover:text-amber-500 transition-colors flex items-center gap-1">
                <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" class="w-4 h-4 text-amber-500/70" />
                <span>{{ t.nav.policies }}</span>
              </ULink>
            </li>
            <li v-if="content.features.enableDirectPayment">
              <ULink to="/booking" class="hover:text-amber-500 transition-colors flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                <UIcon name="i-mdi-credit-card-check-outline" class="w-4 h-4" />
                <span>{{ t.nav.directBooking }}</span>
              </ULink>
            </li>
          </ul>
        </div>

        <!-- Statutory Policies & Guarantees -->
        <div>
          <h4 class="text-sm font-bold text-amber-500 mb-4 flex items-center gap-1.5">
            <UIcon name="i-mdi-file-document-check-outline" />
            <span>{{ t.footer.statutoryPolicies }}</span>
          </h4>
          <ul class="space-y-2 text-xs md:text-sm text-stone-600 dark:text-stone-400">
            <li>
              <ULink to="/policies#booking-policy" class="hover:text-amber-500 transition-colors flex items-center gap-1">
                <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" class="w-4 h-4 text-amber-500/70" />
                <span>{{ t.footer.bookingPolicy }}</span>
              </ULink>
            </li>
            <li>
              <ULink to="/policies#cancellation-policy" class="hover:text-amber-500 transition-colors flex items-center gap-1">
                <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" class="w-4 h-4 text-amber-500/70" />
                <span>{{ t.footer.cancelPolicy }}</span>
              </ULink>
            </li>
            <li>
              <ULink to="/policies#insurance-policy" class="hover:text-amber-500 transition-colors flex items-center gap-1">
                <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" class="w-4 h-4 text-amber-500/70" />
                <span>{{ t.footer.depositPolicy }}</span>
              </ULink>
            </li>
            <li>
              <ULink to="/policies#refund-policy" class="hover:text-amber-500 transition-colors flex items-center gap-1">
                <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" class="w-4 h-4 text-amber-500/70" />
                <span>{{ t.footer.refundPolicy }}</span>
              </ULink>
            </li>
            <li class="pt-2">
              <ULink to="/admin/login" class="hover:text-amber-500 transition-colors flex items-center gap-1 text-stone-500">
                <UIcon name="i-mdi-shield-lock-outline" class="w-4 h-4" />
                <span>{{ t.footer.adminPortal }}</span>
              </ULink>
            </li>
          </ul>
        </div>

        <!-- 24/7 Complaints & Inquiries Support -->
        <div>
          <h4 class="text-sm font-bold text-amber-500 mb-4 flex items-center gap-1.5">
            <UIcon name="i-mdi-headset" />
            <span>{{ t.footer.complaintsSupport }}</span>
          </h4>
          <p class="text-xs text-stone-600 dark:text-stone-400 mb-3 leading-relaxed">
            {{ t.footer.complaintsDesc }}
          </p>
          <ul class="space-y-2.5 text-xs md:text-sm text-stone-600 dark:text-stone-400">
            <li class="flex items-center gap-2">
              <UIcon name="i-mdi-phone" class="w-4 h-4 text-amber-500 shrink-0" />
              <a :href="`tel:${content.contact.phone}`" class="hover:text-amber-500" dir="ltr">{{ content.contact.phone }}</a>
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-mdi-whatsapp" class="w-4 h-4 text-emerald-500 shrink-0" />
              <a :href="`https://wa.me/${content.support.whatsapp.replace(/[^0-9]/g, '')}`" target="_blank" class="hover:text-emerald-500" dir="ltr">{{ content.support.whatsapp }}</a>
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-mdi-email" class="w-4 h-4 text-amber-500 shrink-0" />
              <span class="truncate">{{ content.support.complaintsEmail }}</span>
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-mdi-map-marker" class="w-4 h-4 text-amber-500 shrink-0" />
              <span>{{ isEn ? (content.contact.locationEn || content.contact.location) : content.contact.location }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright bar -->
      <div class="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500 dark:text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {{ new Date().getFullYear() }} {{ isEn ? (content.footer.copyrightTextEn || t.legal.rightsReserved) : (content.footer.copyrightText || t.legal.rightsReserved) }} — {{ t.legal.licenseLabel }} {{ content.legal.licenseNumber }}</span>
        <span class="text-amber-500 font-medium">{{ t.legal.locationCity }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useCmsContent } from "~/composables/useCmsContent";
import { useAppLang } from "~/composables/useAppLang";

const { content } = useCmsContent();
const { isEn, t } = useAppLang();
</script>
