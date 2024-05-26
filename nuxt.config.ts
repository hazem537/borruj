// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr:false,
  modules: [
   
    "@nuxt/ui",
    "@nuxtjs/color-mode"
  ],
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },
  ui: {
    icons: ['mdi']
  },
  css:['./assets/base.css']
})
