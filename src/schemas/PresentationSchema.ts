import { z } from 'zod';
import { SlideSchema } from './SlideSchema';

export const PresentationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  author: z.string().optional(),
  slides: z.array(SlideSchema),
  metadata: z.record(z.unknown()).optional(),
});

export type Presentation = z.infer<typeof PresentationSchema>;
