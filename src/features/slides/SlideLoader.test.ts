import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { loadSlide, loadSlides } from './SlideLoader';
import type { SlideEntry } from './Types';

const BASE_DIR = path.resolve(__dirname, '../../../');
const BASIC_DIR = path.join('test-fixtures', 'valid-presentations', 'basic');
const TITLE_SLIDE = path.join(BASIC_DIR, '00-title.md');
const CONTENT_SLIDE = path.join(BASIC_DIR, '01-content.md');

describe('loadSlide', () => {
  it('should load slide content from file', async () => {
    const entry: SlideEntry = {
      filename: TITLE_SLIDE,
      beforeTransition: null,
      afterTransition: null,
    };
    const result = await loadSlide(BASE_DIR, entry);
    expect(result.filename).toBe(TITLE_SLIDE);
  });

  it('should preserve transition information', async () => {
    const entry: SlideEntry = {
      filename: TITLE_SLIDE,
      beforeTransition: 'tvon',
      afterTransition: 'leftwipe',
    };
    const result = await loadSlide(BASE_DIR, entry);
    expect(result.beforeTransition).toBe('tvon');
  });

  it('should load non-empty content', async () => {
    const entry: SlideEntry = {
      filename: TITLE_SLIDE,
      beforeTransition: null,
      afterTransition: null,
    };
    const result = await loadSlide(BASE_DIR, entry);
    expect(result.content.length).toBeGreaterThan(0);
  });
});

describe('loadSlides', () => {
  it('should load multiple slides', async () => {
    const entries: SlideEntry[] = [
      { filename: TITLE_SLIDE, beforeTransition: null, afterTransition: null },
      { filename: CONTENT_SLIDE, beforeTransition: null, afterTransition: null },
    ];
    const result = await loadSlides(BASE_DIR, entries);
    expect(result).toHaveLength(2);
  });

  it('should maintain slide order', async () => {
    const entries: SlideEntry[] = [
      { filename: TITLE_SLIDE, beforeTransition: null, afterTransition: null },
      { filename: CONTENT_SLIDE, beforeTransition: null, afterTransition: null },
    ];
    const result = await loadSlides(BASE_DIR, entries);
    expect(result[0].filename).toBe(TITLE_SLIDE);
  });
});
