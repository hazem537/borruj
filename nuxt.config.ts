// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxt/ui", "@nuxtjs/color-mode", "nuxt-vuefire"],
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  ui: {
    icons: ["mdi"],
  },
  css: ["./assets/base.css"],
  vuefire: {
    auth:{enabled:true,},
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
