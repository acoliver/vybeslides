import { describe, it, expect } from 'vitest';
import { PresentationSchema } from './PresentationSchema';

describe('PresentationSchema', () => {
  describe('valid presentation', () => {
    it('should parse presentation with required fields', () => {
      const input = {
        id: 'pres-1',
        title: 'My Presentation',
        slides: [{ id: 'slide-1', type: 'content' }],
      };

      const result = PresentationSchema.safeParse(input);

      expect(result.success).toBe(true);
    });

    it('should parse presentation with optional author', () => {
      const input = {
        id: 'pres-2',
        title: 'Tech Talk',
        author: 'John Doe',
        slides: [],
      };

      const result = PresentationSchema.safeParse(input);

      expect(result.success).toBe(true);
    });

    it('should parse presentation with optional metadata', () => {
      const input = {
        id: 'pres-3',
        title: 'Conference Keynote',
        slides: [],
        metadata: {
          date: '2024-01-15',
          duration: 45,
        },
      };

      const result = PresentationSchema.safeParse(input);

      expect(result.success).toBe(true);
    });

    it('should parse presentation with multiple slides', () => {
      const input = {
        id: 'pres-4',
        title: 'Workshop',
        slides: [
          { id: 'slide-1', type: 'title' },
          { id: 'slide-2', type: 'content' },
          { id: 'slide-3', type: 'code' },
        ],
      };

      const result = PresentationSchema.safeParse(input);

      expect(result.success).toBe(true);
    });
  });

  describe('invalid presentation', () => {
    it('should reject presentation without id', () => {
      const input = {
        title: 'My Presentation',
        slides: [],
      };

      const result = PresentationSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject presentation without title', () => {
      const input = {
        id: 'pres-5',
        slides: [],
      };

      const result = PresentationSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject presentation without slides', () => {
      const input = {
        id: 'pres-6',
        title: 'Incomplete',
      };

      const result = PresentationSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject presentation with invalid slide', () => {
      const input = {
        id: 'pres-7',
        title: 'Bad Slides',
        slides: [{ id: '', type: 'content' }],
      };

      const result = PresentationSchema.safeParse(input);

      expect(result.success).toBe(false);
    });
  });
});
