import { defineCollection, z } from "astro:content";

/**
 * ✅ 原则：不改变你现有功能/UI
 * - 保留 poems 里原本就要求的：title / date / tags
 * - 其他字段全部 optional（避免你旧内容缺字段导致构建报错）
 * - date 用 z.coerce.date()：兼容 "2026-02-01" 这种字符串日期
 */

const poems = defineCollection({
  type: "content",
  schema: z.object({
    // ✅ 你原来就有的（保持不变）
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),

    // ✅ 下面这些只做“兼容字段”，不会强迫你每篇都写
    summary: z.string().optional(),
    category: z.string().optional(),
    series: z.string().optional(),
    seriesOrder: z.number().int().optional(),
    cover: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const photos = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),

    summary: z.string().optional(),
    location: z.string().optional(),
    camera: z.string().optional(),
    lens: z.string().optional(),

    // 拍摄参数：可选（你要用就写，不用也不报错）
    settings: z
      .object({
        focal: z.string().optional(),
        aperture: z.string().optional(),
        shutter: z.string().optional(),
        iso: z.union([z.number(), z.string()]).optional(),
      })
      .optional(),

    // 照片列表：建议至少 1 张（你开始做摄影页时再填）
    photos: z.array(z.string()).optional(),

    cover: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  poems,
  photos,
};
