import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: "blogs/**/*.md",
      schema: z.object({
        category: z.string().optional(),
        date: z.string().optional(),
        tags: z.array(z.string()).default([]),
      }),
    }),
  },
});
