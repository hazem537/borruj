// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxt/ui", "@nuxtjs/color-mode", "nuxt-vuefire"],
  colorMode: {
    preference: "system",
    fallback: "dark",
    classSuffix: "",
  },
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  ui: {
    icons: ["mdi"],
  },
  css: ["./assets/base.css"],
  runtimeConfig: {
    // Secret server-only keys
    moyasarSecretKey: process.env.MOYASAR_SECRET_KEY || "sk_test_mock_secret_key",
    public: {
      // Public publishable keys for client
      moyasarPublishableKey: process.env.NUXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY || process.env.MOYASAR_PUBLISHABLE_KEY || "pk_test_mock_publishable_key",
      isPaymentSandbox: !((process.env.NUXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY || "").startsWith("pk_live_")),
    },
  },
  vuefire: {
    auth: { enabled: true },
    config: {
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
    },
  },
});
