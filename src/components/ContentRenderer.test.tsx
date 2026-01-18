import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ContentRenderer } from './ContentRenderer';
import type { MarkdownElement } from '../features/markdown/Types';

describe('ContentRenderer - headers', () => {
  it('should render H1 header', () => {
    const elements: MarkdownElement[] = [{ type: 'header', level: 1, content: 'Title' }];
    const { getByText } = render(<ContentRenderer elements={elements} />);
    expect(getByText('Title')).toBeTruthy();
  });

  it('should render H2 header', () => {
    const elements: MarkdownElement[] = [{ type: 'header', level: 2, content: 'Subtitle' }];
    const { getByText } = render(<ContentRenderer elements={elements} />);
    expect(getByText('Subtitle')).toBeTruthy();
  });
});

describe('ContentRenderer - paragraphs', () => {
  it('should render paragraph content', () => {
    const elements: MarkdownElement[] = [{ type: 'paragraph', content: 'This is a paragraph.' }];
    const { getByText } = render(<ContentRenderer elements={elements} />);
    expect(getByText('This is a paragraph.')).toBeTruthy();
  });
});

describe('ContentRenderer - lists', () => {
  it('should render bullet list items', () => {
    const elements: MarkdownElement[] = [{ type: 'bullet_list', items: ['Item 1', 'Item 2'] }];
    const { getByText } = render(<ContentRenderer elements={elements} />);
    expect(getByText('• Item 1')).toBeTruthy();
  });

  it('should render numbered list items', () => {
    const elements: MarkdownElement[] = [{ type: 'numbered_list', items: ['First', 'Second'] }];
    const { getByText } = render(<ContentRenderer elements={elements} />);
    expect(getByText('1. First')).toBeTruthy();
  });
});
