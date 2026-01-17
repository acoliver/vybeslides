import { describe, it, expect } from 'vitest';
import { parseSlideEntry, parseSlidesText } from './SlidesParser';

describe('parseSlideEntry', () => {
  it('should parse slide entry with no transitions', () => {
    const result = parseSlideEntry('slide.md');
    expect(result).toStrictEqual({
      filename: 'slide.md',
      beforeTransition: null,
      afterTransition: null,
    });
  });

  it('should parse slide entry with before transition', () => {
    const result = parseSlideEntry('slide.md before:tvon');
    expect(result).toStrictEqual({
      filename: 'slide.md',
      beforeTransition: 'tvon',
      afterTransition: null,
    });
  });

  it('should parse slide entry with after transition', () => {
    const result = parseSlideEntry('slide.md after:leftwipe');
    expect(result).toStrictEqual({
      filename: 'slide.md',
      beforeTransition: null,
      afterTransition: 'leftwipe',
    });
  });

  it('should parse slide entry with both transitions', () => {
    const result = parseSlideEntry('slide.md before:diagonal after:tvoff');
    expect(result).toStrictEqual({
      filename: 'slide.md',
      beforeTransition: 'diagonal',
      afterTransition: 'tvoff',
    });
  });

  it('should parse with extra whitespace', () => {
    const result = parseSlideEntry('  slide.md  before:tvon  after:tvoff  ');
    expect(result).toStrictEqual({
      filename: 'slide.md',
      beforeTransition: 'tvon',
      afterTransition: 'tvoff',
    });
  });

  it('should parse with directives before filename', () => {
    const result = parseSlideEntry('before:diagonal after:tvoff slide.md');
    expect(result).toStrictEqual({
      filename: 'slide.md',
      beforeTransition: 'diagonal',
      afterTransition: 'tvoff',
    });
  });

  it('should parse with mixed order', () => {
    const result = parseSlideEntry('before:topwipe slide.md after:bottomwipe');
    expect(result).toStrictEqual({
      filename: 'slide.md',
      beforeTransition: 'topwipe',
      afterTransition: 'bottomwipe',
    });
  });

  it('should parse with only after directive', () => {
    const result = parseSlideEntry('slide.md after:rightwipe');
    expect(result).toStrictEqual({
      filename: 'slide.md',
      beforeTransition: null,
      afterTransition: 'rightwipe',
    });
  });

  it('should parse directive-only line with empty filename', () => {
    const result = parseSlideEntry('before:tvon after:leftwipe');
    expect(result.filename).toBe('');
  });

  it('should preserve transitions when filename is empty', () => {
    const result = parseSlideEntry('before:tvon after:leftwipe');
    expect(result.beforeTransition).toBe('tvon');
  });
});

describe('parseSlidesText', () => {
  it('should parse single slide entry', () => {
    const result = parseSlidesText('slide.md');
    expect(result).toHaveLength(1);
  });

  it('should parse multiple slide entries', () => {
    const content = 'slide1.md\nslide2.md\nslide3.md';
    const result = parseSlidesText(content);
    expect(result).toHaveLength(3);
  });

  it('should skip empty lines', () => {
    const content = 'slide1.md\n\nslide2.md\n\n\nslide3.md';
    const result = parseSlidesText(content);
    expect(result).toHaveLength(3);
  });

  it('should skip lines with only whitespace', () => {
    const content = 'slide1.md\n   \nslide2.md\n\t\nslide3.md';
    const result = parseSlidesText(content);
    expect(result).toHaveLength(3);
  });

  it('should parse all entries correctly', () => {
    const content = `slide1.md before:tvon
slide2.md after:leftwipe
slide3.md before:topwipe after:bottomwipe`;
    const result = parseSlidesText(content);
    expect(result).toStrictEqual([
      { filename: 'slide1.md', beforeTransition: 'tvon', afterTransition: null },
      { filename: 'slide2.md', beforeTransition: null, afterTransition: 'leftwipe' },
      { filename: 'slide3.md', beforeTransition: 'topwipe', afterTransition: 'bottomwipe' },
    ]);
  });
});
