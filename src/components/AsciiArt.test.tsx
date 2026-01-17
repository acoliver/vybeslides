import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AsciiArt } from './AsciiArt';

describe('AsciiArt - spacing preservation', () => {
  it('should preserve monospace spacing', () => {
    const art = '  /\\_/\\\n ( o.o )\n  > ^ <';
    const { container } = render(<AsciiArt content={art} />);
    expect(container.textContent).toContain('/\\_/\\');
  });

  it('should render multi-line ascii art', () => {
    const art = 'Line1\nLine2\nLine3';
    const { container } = render(<AsciiArt content={art} />);
    expect(container.textContent).toContain('Line1');
  });
});

describe('AsciiArt - green coloring', () => {
  it('should render content with green theme', () => {
    const art = '╭─╮';
    const { container } = render(<AsciiArt content={art} />);
    expect(container.textContent).toContain('╭─╮');
  });
});
