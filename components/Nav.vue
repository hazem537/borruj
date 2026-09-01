<template>
  <header class="w-full">
    <div class="glass-panel rounded-full px-3 sm:px-4 py-2 shadow-lg transition-all duration-300 flex items-center justify-between gap-2">
      <!-- Logo & Title -->
      <ULink to="/#container" class="flex items-center gap-2 sm:gap-3 group shrink-0">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1 group-hover:scale-105 transition-transform shrink-0">
          <img src="/log.svg" alt="بروج" class="h-7 sm:h-8 w-auto object-contain" onerror="this.style.display='none'" />
          <UIcon name="i-mdi-office-building" class="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
        </div>
        <div class="flex flex-col text-start whitespace-nowrap">
          <span class="text-amber-500 font-bold text-sm sm:text-base md:text-lg lg:text-xl leading-tight">
            {{ isEn ? (content.hero.brandNameEn || t.brand) : (content.hero.brandName || t.brand) }}
          </span>
          <span class="text-[9px] sm:text-[10px] text-stone-600 dark:text-stone-300">
            {{ t.brandSubtitle }} | {{ t.licenseShort }} {{ content.legal.licenseNumber }}
          </span>
        </div>
      </ULink>

      <!-- Desktop Navigation Links -->
      <nav class="hidden md:flex items-center gap-0.5 lg:gap-1 xl:gap-2">
        <template v-if="!user">
          <ULink
            to="/#hero"
            class="px-2 py-1 lg:px-2.5 lg:py-1.5 rounded-full text-[11px] lg:text-xs xl:text-sm font-semibold whitespace-nowrap hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
          >
            {{ t.nav.home }}
          </ULink>
          <ULink
            to="/#aboutUs"
            class="px-2 py-1 lg:px-2.5 lg:py-1.5 rounded-full text-[11px] lg:text-xs xl:text-sm font-semibold whitespace-nowrap hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
          >
            {{ t.nav.about }}
          </ULink>
          <ULink
            to="/#hotels"
            class="px-2 py-1 lg:px-2.5 lg:py-1.5 rounded-full text-[11px] lg:text-xs xl:text-sm font-semibold whitespace-nowrap hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
          >
            {{ t.nav.hotels }}
          </ULink>
          <ULink
            to="/#prices"
            class="px-2 py-1 lg:px-2.5 lg:py-1.5 rounded-full text-[11px] lg:text-xs xl:text-sm font-semibold whitespace-nowrap hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
          >
            {{ t.nav.prices }}
          </ULink>
          <ULink
            to="/policies"
            class="px-2 py-1 lg:px-2.5 lg:py-1.5 rounded-full text-[11px] lg:text-xs xl:text-sm font-semibold whitespace-nowrap hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
          >
            {{ t.nav.policies }}
          </ULink>
          <ULink
            to="/#contactUs"
            class="px-2 py-1 lg:px-2.5 lg:py-1.5 rounded-full text-[11px] lg:text-xs xl:text-sm font-semibold whitespace-nowrap hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
          >
            {{ t.nav.contact }}
          </ULink>
        </template>

        <template v-else>
          <ULink
            to="/admin"
            class="px-2.5 py-1.5 rounded-full text-xs lg:text-sm font-semibold whitespace-nowrap hover:text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center gap-1.5"
          >
            <UIcon name="i-mdi-view-dashboard-outline" class="w-4 h-4 text-amber-500" />
            {{ t.nav.dashboard }}
          </ULink>
          <ULink
            to="/"
            class="px-2.5 py-1.5 rounded-full text-xs lg:text-sm font-semibold whitespace-nowrap hover:text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center gap-1.5"
          >
            <UIcon name="i-mdi-web" class="w-4 h-4 text-amber-500" />
            {{ t.nav.viewSite }}
          </ULink>
        </template>
      </nav>

      <!-- Actions (Language Switcher, Booking Button, Theme Switcher, Admin Button, Mobile Toggle) -->
      <div class="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
        <!-- Direct Booking CTA Button (if enabled in CMS) -->
        <ULink
          v-if="content.features.enableDirectPayment"
          to="/booking"
          class="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs whitespace-nowrap shadow-sm transition-all"
        >
          <UIcon name="i-mdi-credit-card-check-outline" class="w-3.5 h-3.5" />
          <span>{{ t.nav.directBooking }}</span>
        </ULink>

        <!-- Global Language Switcher Button -->
        <button
          type="button"
          class="px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap"
          @click="toggleLang"
          :title="isEn ? 'التبديل إلى العربية' : 'Switch to English'"
        >
          <UIcon name="i-mdi-translate" class="w-3.5 h-3.5 text-amber-500" />
          <span>{{ t.nav.langSwitch }}</span>
        </button>

        <!-- Color Mode Toggle -->
        <UButton
          :icon="isDark ? 'i-mdi-weather-night' : 'i-mdi-weather-sunny'"
          color="gray"
          variant="ghost"
          :aria-label="t.nav.toggleTheme"
          class="rounded-full text-amber-500 hover:bg-amber-500/10"
          @click="toggleColorMode"
        />

        <!-- Admin / Auth Actions -->
        <template v-if="user">
          <UButton
            size="xs"
            color="red"
            variant="soft"
            icon="i-mdi-logout"
            class="rounded-full hidden sm:flex items-center"
            @click="logout"
          >
            {{ t.nav.logout }}
          </UButton>
        </template>
        <template v-else>
          <ULink
            to="/admin/login"
            class="hidden sm:flex items-center gap-1 text-xs text-stone-500 hover:text-amber-500 px-2 py-1 rounded-full hover:bg-amber-500/10 transition-colors"
            :title="t.nav.login"
          >
            <UIcon name="i-mdi-shield-account-outline" class="w-4 h-4" />
          </ULink>
        </template>

        <!-- Mobile Menu Button -->
        <UButton
          class="md:hidden rounded-full"
          color="gray"
          variant="ghost"
          icon="i-mdi-menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden mt-2 glass-panel rounded-2xl p-4 shadow-xl flex flex-col gap-2"
      >
        <template v-if="!user">
          <!-- Direct Booking if enabled -->
          <ULink
            v-if="content.features.enableDirectPayment"
            to="/booking"
            class="px-3 py-2 rounded-xl text-sm font-bold bg-amber-500 text-stone-950 flex items-center justify-between"
            @click="mobileMenuOpen = false"
          >
            <span class="flex items-center gap-1.5">
              <UIcon name="i-mdi-credit-card-check-outline" />
              <span>{{ t.nav.directBooking }}</span>
            </span>
            <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" />
          </ULink>

          <ULink
            to="/#hero"
            class="px-3 py-2 rounded-xl text-sm font-medium hover:bg-amber-500/10 transition-colors flex items-center justify-between"
            @click="mobileMenuOpen = false"
          >
            <span>{{ t.nav.home }}</span>
            <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" />
          </ULink>
          <ULink
            to="/#aboutUs"
            class="px-3 py-2 rounded-xl text-sm font-medium hover:bg-amber-500/10 transition-colors flex items-center justify-between"
            @click="mobileMenuOpen = false"
          >
            <span>{{ t.nav.about }}</span>
            <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" />
          </ULink>
          <ULink
            to="/#hotels"
            class="px-3 py-2 rounded-xl text-sm font-medium hover:bg-amber-500/10 transition-colors flex items-center justify-between"
            @click="mobileMenuOpen = false"
          >
            <span>{{ t.nav.hotels }}</span>
            <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" />
          </ULink>
          <ULink
            to="/#prices"
            class="px-3 py-2 rounded-xl text-sm font-medium hover:bg-amber-500/10 transition-colors flex items-center justify-between"
            @click="mobileMenuOpen = false"
          >
            <span>{{ t.nav.prices }}</span>
            <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" />
          </ULink>
          <ULink
            to="/policies"
            class="px-3 py-2 rounded-xl text-sm font-medium hover:bg-amber-500/10 transition-colors flex items-center justify-between"
            @click="mobileMenuOpen = false"
          >
            <span>{{ t.nav.policies }}</span>
            <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" />
          </ULink>
          <ULink
            to="/#contactUs"
            class="px-3 py-2 rounded-xl text-sm font-medium hover:bg-amber-500/10 transition-colors flex items-center justify-between"
            @click="mobileMenuOpen = false"
          >
            <span>{{ t.nav.contact }}</span>
            <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" />
          </ULink>

          <button
            type="button"
            class="w-full text-start px-3 py-2 rounded-xl text-sm font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-between"
            @click="toggleLang"
          >
            <span class="flex items-center gap-2">
              <UIcon name="i-mdi-translate" />
              <span>{{ isEn ? 'التبديل إلى العربية' : 'Switch to English' }}</span>
            </span>
            <UIcon :name="isEn ? 'i-mdi-chevron-right' : 'i-mdi-chevron-left'" />
          </button>

          <ULink
            to="/admin/login"
            class="px-3 py-2 rounded-xl text-sm font-medium text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center justify-between"
            @click="mobileMenuOpen = false"
          >
            <span>{{ t.nav.login }}</span>
            <UIcon name="i-mdi-lock-outline" />
          </ULink>
        </template>
        <template v-else>
          <ULink
            to="/admin"
            class="px-3 py-2 rounded-xl text-sm font-medium text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center justify-between"
            @click="mobileMenuOpen = false"
          >
            <span>{{ t.nav.dashboard }}</span>
            <UIcon name="i-mdi-view-dashboard-outline" />
          </ULink>
          <ULink
            to="/"
            class="px-3 py-2 rounded-xl text-sm font-medium hover:bg-amber-500/10 transition-colors flex items-center justify-between"
            @click="mobileMenuOpen = false"
          >
            <span>{{ t.nav.viewSite }}</span>
            <UIcon name="i-mdi-web" />
          </ULink>
          <button
            class="w-full text-start px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-between"
            @click="logout"
          >
            <span>{{ t.nav.logout }}</span>
            <UIcon name="i-mdi-logout" />
          </button>
        </template>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCurrentUser, useFirebaseAuth } from "vuefire";
import { signOut } from "firebase/auth";
import { useCmsContent } from "~/composables/useCmsContent";
import { useAppLang } from "~/composables/useAppLang";

const { content } = useCmsContent();
const { isEn, t, toggleLang } = useAppLang();

const colorMode = useColorMode();
const isDark = computed({
  get: () => colorMode.value === "dark",
  set: () => {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const toggleColorMode = () => {
  isDark.value = !isDark.value;
};

const mobileMenuOpen = ref(false);
const user = useCurrentUser();
const auth = useFirebaseAuth();

const logout = async () => {
  mobileMenuOpen.value = false;
  if (auth) {
    await signOut(auth);
  }
  navigateTo("/admin/login");
};
</script>
