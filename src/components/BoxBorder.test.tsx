import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BoxBorder } from './BoxBorder';

describe('BoxBorder - basic rendering', () => {
  it('should render child content', () => {
    const { getByText } = render(
      <BoxBorder>
        <text>Content</text>
      </BoxBorder>
    );
    expect(getByText('Content')).toBeTruthy();
  });
});

describe('BoxBorder - border style', () => {
  it('should render with rounded border style', () => {
    const { getByText } = render(
      <BoxBorder borderStyle="rounded">
        <text>Content</text>
      </BoxBorder>
    );
    expect(getByText('Content')).toBeTruthy();
  });

  it('should render with lightweight border style', () => {
    const { getByText } = render(
      <BoxBorder borderStyle="lightweight">
        <text>Content</text>
      </BoxBorder>
    );
    expect(getByText('Content')).toBeTruthy();
  });
});

describe('BoxBorder - content wrapping', () => {
  it('should wrap child content', () => {
    const { getByText } = render(
      <BoxBorder>
        <text>Test Content</text>
      </BoxBorder>
    );
    expect(getByText('Test Content')).toBeTruthy();
  });
});
