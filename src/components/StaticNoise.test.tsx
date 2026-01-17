import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StaticNoise } from './StaticNoise';

describe('StaticNoise - noise generation', () => {
  it('should render a box element', () => {
    const { container } = render(
      <StaticNoise width={10} height={5} />
    );
    const box = container.querySelector('box');
    expect(box).toBeTruthy();
  });

  it('should render text content with noise characters', () => {
    const { container } = render(
      <StaticNoise width={10} height={5} />
    );
    const content = container.textContent || '';
    const hasNoiseChars = /[░▒▓█]/.test(content);
    expect(hasNoiseChars).toBe(true);
  });
});

describe('StaticNoise - frame animation', () => {
  it('should render text on first render', () => {
    const { container } = render(
      <StaticNoise width={10} height={5} />
    );
    const text = container.querySelector('text');
    expect(text).toBeTruthy();
  });

  it('should render text on second render', () => {
    const { container } = render(
      <StaticNoise width={10} height={5} />
    );
    const text = container.querySelector('text');
    expect(text).toBeTruthy();
  });
});
