import { describe, it, expect } from 'vitest';
import { computeSpacing } from './spacing';
import type { MarkdownElement } from '../features/markdown/Types';

describe('computeSpacing - H2 followed by bullet list', () => {
  it('should have NO top margin on bullet list after H2', () => {
    const elements: MarkdownElement[] = [
      { type: 'header', level: 2, content: 'Section' },
      { type: 'bullet_list', items: [{ content: 'Item 1' }] },
    ];
    const spacing = computeSpacing(elements, 1);
    expect(spacing.marginTop).toBe(0);
  });
});

describe('computeSpacing - bullet list followed by H2', () => {
  it('should have top margin on H2 after bullet list', () => {
    const elements: MarkdownElement[] = [
      { type: 'bullet_list', items: [{ content: 'Item 1' }] },
      { type: 'header', level: 2, content: 'Next Section' },
    ];
    const spacing = computeSpacing(elements, 1);
    expect(spacing.marginTop).toBe(1);
  });
});

describe('computeSpacing - bullet list followed by paragraph', () => {
  it('should have top margin on paragraph after bullet list', () => {
    const elements: MarkdownElement[] = [
      { type: 'bullet_list', items: [{ content: 'Item 1' }] },
      { type: 'paragraph', content: 'Closing text.' },
    ];
    const spacing = computeSpacing(elements, 1);
    expect(spacing.marginTop).toBe(1);
  });
});

describe('computeSpacing - code block followed by H2', () => {
  it('should have top margin on H2 after code block', () => {
    const elements: MarkdownElement[] = [
      { type: 'code_block', language: 'bash', content: 'npm install' },
      { type: 'header', level: 2, content: 'Next Section' },
    ];
    const spacing = computeSpacing(elements, 1);
    expect(spacing.marginTop).toBe(1);
  });
});

describe('computeSpacing - code block followed by paragraph', () => {
  it('should have top margin on paragraph after code block', () => {
    const elements: MarkdownElement[] = [
      { type: 'code_block', language: 'bash', content: 'npm install' },
      { type: 'paragraph', content: 'Run the command above.' },
    ];
    const spacing = computeSpacing(elements, 1);
    expect(spacing.marginTop).toBe(1);
  });
});

describe('computeSpacing - H2 followed by H2', () => {
  it('should have NO top margin on H2 after H2 (consecutive headers)', () => {
    const elements: MarkdownElement[] = [
      { type: 'header', level: 2, content: 'Section 1' },
      { type: 'header', level: 2, content: 'Section 2' },
    ];
    const spacing = computeSpacing(elements, 1);
    expect(spacing.marginTop).toBe(0);
  });
});

describe('computeSpacing - H1 at start', () => {
  it('should have NO top margin on first H1', () => {
    const elements: MarkdownElement[] = [{ type: 'header', level: 1, content: 'Title' }];
    const spacing = computeSpacing(elements, 0);
    expect(spacing.marginTop).toBe(0);
  });
});

describe('computeSpacing - H1 after content', () => {
  it('should have top margin on H1 after other content', () => {
    const elements: MarkdownElement[] = [
      { type: 'paragraph', content: 'Intro text.' },
      { type: 'header', level: 1, content: 'Main Title' },
    ];
    const spacing = computeSpacing(elements, 1);
    expect(spacing.marginTop).toBe(1);
  });
});
