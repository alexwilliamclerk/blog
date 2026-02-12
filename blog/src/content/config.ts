import { defineCollection, z } from "astro:content";

const poems = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(), // ✅ 关键：兼容 "2026-02-01" 这种写法
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { poems };