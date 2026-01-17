import { describe, it, expect } from 'vitest';
import { SlideSchema } from './SlideSchema';

describe('SlideSchema', () => {
  describe('valid slide', () => {
    it('should parse slide with required fields', () => {
      const input = {
        id: 'slide-1',
        type: 'content',
      };

      const result = SlideSchema.safeParse(input);

      expect(result.success).toBe(true);
    });

    it('should parse slide with optional title', () => {
      const input = {
        id: 'slide-2',
        type: 'content',
        title: 'My Slide Title',
      };

      const result = SlideSchema.safeParse(input);

      expect(result.success).toBe(true);
    });

    it('should parse slide with optional content array', () => {
      const input = {
        id: 'slide-3',
        type: 'content',
        content: ['First line', 'Second line'],
      };

      const result = SlideSchema.safeParse(input);

      expect(result.success).toBe(true);
    });
  });

  describe('invalid slide', () => {
    it('should reject slide without id', () => {
      const input = {
        type: 'content',
      };

      const result = SlideSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject slide without type', () => {
      const input = {
        id: 'slide-4',
      };

      const result = SlideSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject slide with invalid type', () => {
      const input = {
        id: 'slide-5',
        type: 'invalid-type',
      };

      const result = SlideSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject slide with empty id', () => {
      const input = {
        id: '',
        type: 'content',
      };

      const result = SlideSchema.safeParse(input);

      expect(result.success).toBe(false);
    });
  });
});
