import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Artigos do blog em src/content/blog/*.md. A capa é uma chave de imagem do catálogo (ver lib/catalog-images). */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(90),
    description: z.string().min(70).max(165),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['pisos', 'fitness', 'guias']),
    cover: z.string(),
    coverAlt: z.string(),
    tags: z.array(z.string()).default([]),
    relatedProducts: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
