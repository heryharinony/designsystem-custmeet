import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    route: z.string(),
    label: z.string(),
    category: z.enum(['Fondations', 'Composants']),
    order: z.number().int(),
    legacyId: z.string(),
    icon: z.string().optional(),
    headline: z.string().optional(),
    eyebrow: z.string().optional(),
    lead: z.string().optional(),
    tone: z.enum(['plain', 'alt', 'dark']).default('plain'),
  }),
});

export const collections = { docs };
