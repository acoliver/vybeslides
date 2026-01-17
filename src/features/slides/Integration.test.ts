import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { validatePresentation } from './Validator';
import { loadSlides } from './SlideLoader';

const BASE_DIR = path.resolve(__dirname, '../../../test-fixtures');
const BASIC_PATH = path.join(BASE_DIR, 'valid-presentations', 'basic');
const TRANSITIONS_PATH = path.join(BASE_DIR, 'valid-presentations', 'with-transitions');

interface ValidationSuccess {
  success: true;
  entries: {
    filename: string;
    beforeTransition: string | null;
    afterTransition: string | null;
  }[];
}

function hasEntries(result: Awaited<ReturnType<typeof validatePresentation>>): result is ValidationSuccess {
  return Boolean(result.entries);
}

function requireEntries(result: Awaited<ReturnType<typeof validatePresentation>>): ValidationSuccess {
  if (!hasEntries(result)) {
    throw new Error('Expected entries to be defined');
  }
  return result;
}

describe('Integration: Full slide loading pipeline', () => {
  it('should validate, parse, and load basic presentation', async () => {
    const validationResult = await validatePresentation(BASIC_PATH);
    expect(validationResult.success).toBe(true);
  });

  it('should return entries from validation', async () => {
    const validationResult = await validatePresentation(BASIC_PATH);
    expect(validationResult.entries).toHaveLength(2);
  });

  it('should load slides from validated entries', async () => {
    const validationResult = await validatePresentation(BASIC_PATH);
    const entries = requireEntries(validationResult).entries;
    const slides = await loadSlides(BASIC_PATH, entries);
    expect(slides).toHaveLength(2);
  });

  it('should preserve content from loaded slides', async () => {
    const validationResult = await validatePresentation(BASIC_PATH);
    const entries = requireEntries(validationResult).entries;
    const slides = await loadSlides(BASIC_PATH, entries);
    expect(slides[0].content.includes('Welcome to VybeSlides')).toBe(true);
  });

  it('should handle presentation with transitions', async () => {
    const validationResult = await validatePresentation(TRANSITIONS_PATH);
    expect(validationResult.success).toBe(true);
  });

  it('should preserve transition data through pipeline', async () => {
    const validationResult = await validatePresentation(TRANSITIONS_PATH);
    const entries = requireEntries(validationResult).entries;
    const slides = await loadSlides(TRANSITIONS_PATH, entries);
    expect(slides[0].beforeTransition).toBe('tvon');
  });

  it('should maintain slide order through pipeline', async () => {
    const validationResult = await validatePresentation(TRANSITIONS_PATH);
    const entries = requireEntries(validationResult).entries;
    const slides = await loadSlides(TRANSITIONS_PATH, entries);
    expect(slides[0].filename).toBe('00-tvon.md');
  });

  it('should handle both before and after transitions', async () => {
    const validationResult = await validatePresentation(TRANSITIONS_PATH);
    const entries = requireEntries(validationResult).entries;
    const slides = await loadSlides(TRANSITIONS_PATH, entries);
    const slideWithBoth = slides.find((s) => s.filename === '02-both.md');
    expect(slideWithBoth?.beforeTransition).toBe('topwipe');
  });
});
