// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/seo",
    "@nuxt/content",
    "nuxt-llms",
    "@nuxt/eslint",
    "@nuxt/ui",
    "nuxt-studio",
  ],
  llms: {
    domain: "https://nuxtcms.studywithwoody.site",
    title: "Woody's tech blog",
    description: "Tech blog about AI, Nuxt, Python, and Web Dev",
    content: {
      collections: ["content"],
    },
    full: {
      includeContent: true,
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: "github-light",
            dark: "github-dark",
          },
          langs: ["vue", "js", "ts", "bash", "yaml", "python", "css", "html"],
        },
      },
    },
  },
  studio: {
    repository: {
      provider: "github", // 'github' or 'gitlab'
      owner: "woody1234567",
      repo: "Nuxt_tech_blog",
      branch: "master",
    },
  },
  site: {
    url: "https://nuxtcms.studywithwoody.site",
    name: "Woody's tech blog",
    description: "Tech blog about AI, Nuxt, Python, and Web Dev",
    defaultLocale: "zh-Hant",
  },
  css: ["~/assets/css/main.css"],
});
