import { z } from 'zod';
import { TRANSITION_NAMES } from './Types';

export const TransitionNameSchema = z.enum(TRANSITION_NAMES);

export const SlideEntrySchema = z.object({
  filename: z.string().min(1),
  beforeTransition: TransitionNameSchema.nullable(),
  afterTransition: TransitionNameSchema.nullable(),
});

export const LoadedSlideSchema = z.object({
  filename: z.string().min(1),
  content: z.string(),
  beforeTransition: TransitionNameSchema.nullable(),
  afterTransition: TransitionNameSchema.nullable(),
});
