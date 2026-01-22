// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxt/content", "@nuxt/eslint", "@nuxt/ui", "@nuxt/test-utils", "@nuxtjs/seo"],
  site: {
    url: 'https://nuxt-skills.com',
    name: 'Nuxt Skills Blog',
    description: 'Tech blog about AI, Nuxt, Python, and Web Dev',
    defaultLocale: 'zh-Hant',
  },
  css: ["~/assets/css/main.css"],
});
