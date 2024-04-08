// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.BASE_URL || "http://127.0.0.1:8001",
    },
  },
  css: ['notivue/notification.css', 'notivue/animations.css'],
  
  imports: {
    dirs: ["./utils/*", "./composable/*", "./plugins/*/composables/*"],
    presets: [],
  },
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "@pinia/nuxt","@pinia-plugin-persistedstate/nuxt",'notivue/nuxt'],
  notivue: {
    position: 'top-right',
    limit: 4,
    enqueue: true,
    avoidDuplicates: false,
    notifications: {
      global: {
        duration: 3000
      }
    }
  }
})