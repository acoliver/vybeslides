import { z } from 'zod';

export const SlideSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['content', 'title', 'code', 'image']),
  title: z.string().optional(),
  content: z.array(z.string()).optional(),
});

export type Slide = z.infer<typeof SlideSchema>;
