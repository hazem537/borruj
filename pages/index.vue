<template>
  <div class="flex flex-col gap-12 md:gap-24 w-full" id="container">
    <Hero id="hero" />
    <div class="max-w-6xl mx-auto px-4 w-full flex flex-col gap-16 md:gap-28">
      <AboutUs id="aboutUs" />
      <Hotels id="hotels" />
      <PricesList id="prices" />
      <ContactUs id="contactUs" />
    </div>
    <Footer id="footer" />
  </div>
</template>

<script lang="ts" setup>
import { useAppLang } from "~/composables/useAppLang";

const { isEn } = useAppLang();

useHead({
  title: () => isEn.value
    ? "Burouj Al Mumayaza Tourism | Makkah & Madinah Hotel Reservations (License #73103970)"
    : "مؤسسة بروج المميزة للسياحة | حجز فنادق مكة والمدينة ودفع إلكتروني مباشر (ترخيص 73103970)",
  meta: [
    {
      name: "description",
      content: () => isEn.value
        ? "Burouj Al Mumayaza Tourism Est. (CR: 7027874945 | Tourism License: 73103970) specializing in Makkah and Madinah hotel reservations at transparent, 15% VAT-inclusive rates with 24/7 guest support."
        : "مؤسسة بروج المميزة للسياحة (سجل تجاري 7027874945 | ترخيص وزارة السياحة 73103970)، متخصصة في توفير حجوزات فنادق مكة المكرمة والمدينة المنورة بأسعار معلنة شاملة لضريبة القيمة المضافة 15% وخدمة واستفسارات 24/7.",
    },
  ],
});
</script>
