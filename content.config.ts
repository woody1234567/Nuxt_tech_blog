import { defineContentConfig, defineCollection, z } from "@nuxt/content";
import { asSeoCollection } from "@nuxtjs/seo/content";

export default defineContentConfig({
  collections: {
    content: defineCollection(
      asSeoCollection({
        type: "page",
        source: "blogs/**/*.md",
        schema: z.object({
          category: z.string().optional(),
          date: z.string().optional(),
          tags: z.array(z.string()).default([]),
        }),
      }),
    ),
  },
});
