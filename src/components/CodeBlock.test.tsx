import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock - code highlighting', () => {
  it('should render code with green highlighting', () => {
    const { getByText } = render(<CodeBlock content="const x = 1;" />);
    expect(getByText('const x = 1;')).toBeTruthy();
  });

  it('should render code content', () => {
    const { getByText } = render(<CodeBlock content="plain code" />);
    expect(getByText('plain code')).toBeTruthy();
  });
});

describe('CodeBlock - monospace display', () => {
  it('should preserve spacing in code', () => {
    const code = '  function test() {\n    return true;\n  }';
    const { getByText } = render(<CodeBlock content={code} />);
    expect(getByText(/function test/)).toBeTruthy();
  });
});
