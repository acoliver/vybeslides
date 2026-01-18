import { describe, it, expect } from 'vitest';
import { parseMarkdown } from './Parser';

describe('parseMarkdown - headers', () => {
  it('should parse H1 header with correct type', () => {
    const result = parseMarkdown('# Hello World');
    expect(result.elements[0]?.type).toBe('header');
  });

  it('should store level 1 for H1 headers', () => {
    const result = parseMarkdown('# Hello World');
    const element = result.elements[0];
    const level = element.type === 'header' ? element.level : null;
    expect(level).toBe(1);
  });

  it('should parse H1 header with correct content', () => {
    const result = parseMarkdown('# Hello World');
    const element = result.elements[0];
    const content = element.type === 'header' ? element.content : null;
    expect(content).toBe('Hello World');
  });

  it('should parse H2 header', () => {
    const result = parseMarkdown('## Second Level');
    const element = result.elements[0];
    const level = element.type === 'header' ? element.level : null;
    expect(level).toBe(2);
  });

  it('should parse H6 header', () => {
    const result = parseMarkdown('###### Sixth Level');
    const element = result.elements[0];
    const level = element.type === 'header' ? element.level : null;
    expect(level).toBe(6);
  });
});

describe('parseMarkdown - paragraphs', () => {
  it('should parse single paragraph', () => {
    const result = parseMarkdown('This is a paragraph.');
    expect(result.elements[0]?.type).toBe('paragraph');
  });
});

describe('parseMarkdown - bullet lists', () => {
  it('should parse bullet list items', () => {
    const result = parseMarkdown('- First item\n- Second item');
    expect(result.elements[0]?.type).toBe('bullet_list');
  });

  it('should parse bullet list with correct items', () => {
    const result = parseMarkdown('- First item\n- Second item');
    const element = result.elements[0];
    const items = element.type === 'bullet_list' ? element.items : [];
    expect(items).toHaveLength(2);
  });
});

describe('parseMarkdown - numbered lists', () => {
  it('should parse numbered list items', () => {
    const result = parseMarkdown('1. First item\n2. Second item');
    expect(result.elements[0]?.type).toBe('numbered_list');
  });

  it('should parse numbered list with correct items', () => {
    const result = parseMarkdown('1. First item\n2. Second item');
    const element = result.elements[0];
    const items = element.type === 'numbered_list' ? element.items : [];
    expect(items).toHaveLength(2);
  });
});

describe('parseMarkdown - code blocks', () => {
  it('should parse code block with language', () => {
    const result = parseMarkdown('```typescript\nconst x = 1;\n```');
    expect(result.elements[0]?.type).toBe('code_block');
  });

  it('should parse ascii art block', () => {
    const result = parseMarkdown('```ascii\n  /\\_/\\\n ( o.o )\n```');
    expect(result.elements[0]?.type).toBe('ascii_art');
  });

  it('should parse code block without language', () => {
    const result = parseMarkdown('```\nconst x = 1;\n```');
    const element = result.elements[0];
    const language = element.type === 'code_block' ? element.language : undefined;
    expect(language).toBeNull();
  });
});

describe('parseMarkdown - tables', () => {
  it('should parse markdown table', () => {
    const result = parseMarkdown(
      '| Header1 | Header2 |\n|---------|----------|\n| Cell1   | Cell2   |',
    );
    expect(result.elements[0]?.type).toBe('table');
  });
});

describe('parseMarkdown - blockquotes', () => {
  it('should parse blockquote', () => {
    const result = parseMarkdown('> This is a quote');
    expect(result.elements[0]?.type).toBe('blockquote');
  });
});

describe('parseMarkdown - integration', () => {
  it('should parse mixed markdown content', () => {
    const markdown = `# Title

This is a paragraph.

- Item 1
- Item 2

\`\`\`typescript
const x = 1;
\`\`\``;
    const result = parseMarkdown(markdown);
    expect(result.elements).toHaveLength(4);
  });

  it('should parse fixture content', () => {
    const markdown = `# Welcome to VybeSlides

A retro terminal-based slide presenter`;
    const result = parseMarkdown(markdown);
    const header = result.elements[0];
    const content = header.type === 'header' ? header.content : null;
    expect(content).toBe('Welcome to VybeSlides');
  });
});

describe('parseMarkdown - spacing context', () => {
  it('should track that H2 following H2 needs no spacing (both headers)', () => {
    const markdown = `## Section 1
## Section 2`;
    const result = parseMarkdown(markdown);
    expect(result.elements).toHaveLength(2);
    expect(result.elements[0]?.type).toBe('header');
    expect(result.elements[1]?.type).toBe('header');
  });

  it('should track that bullet list follows H2 directly', () => {
    const markdown = `## Section
- Item 1
- Item 2`;
    const result = parseMarkdown(markdown);
    expect(result.elements).toHaveLength(2);
    expect(result.elements[0]?.type).toBe('header');
    expect(result.elements[1]?.type).toBe('bullet_list');
  });

  it('should track paragraph after code block', () => {
    const markdown = `\`\`\`bash
npm install
\`\`\`
Run the command above.`;
    const result = parseMarkdown(markdown);
    expect(result.elements).toHaveLength(2);
    expect(result.elements[0]?.type).toBe('code_block');
    expect(result.elements[1]?.type).toBe('paragraph');
  });

  it('should track H2 after code block', () => {
    const markdown = `\`\`\`bash
npm install
\`\`\`
## Next Section`;
    const result = parseMarkdown(markdown);
    expect(result.elements).toHaveLength(2);
    expect(result.elements[0]?.type).toBe('code_block');
    expect(result.elements[1]?.type).toBe('header');
  });

  it('should track paragraph after bullet list', () => {
    const markdown = `- Item 1
- Item 2
This is a note.`;
    const result = parseMarkdown(markdown);
    expect(result.elements).toHaveLength(2);
    expect(result.elements[0]?.type).toBe('bullet_list');
    expect(result.elements[1]?.type).toBe('paragraph');
  });
});
