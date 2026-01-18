import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HeaderBar } from './HeaderBar';

describe('HeaderBar - logo display', () => {
  it('should render header with slide counter (0-based)', () => {
    const { getByText } = render(<HeaderBar slideNumber={0} totalSlides={5} />);
    expect(getByText(/\[0\/4\]/)).toBeTruthy();
  });
});

describe('HeaderBar - slide counter format', () => {
  it('should display slide counter in 0-based format', () => {
    const { getByText } = render(<HeaderBar slideNumber={2} totalSlides={10} />);
    expect(getByText(/\[2\/9\]/)).toBeTruthy();
  });
});

describe('HeaderBar - dynamic counter width', () => {
  it('should handle single digit slide numbers', () => {
    const { getByText } = render(<HeaderBar slideNumber={0} totalSlides={5} />);
    expect(getByText(/\[0\/4\]/)).toBeTruthy();
  });

  it('should handle multi-digit slide numbers', () => {
    const { getByText } = render(<HeaderBar slideNumber={41} totalSlides={123} />);
    expect(getByText(/\[41\/122\]/)).toBeTruthy();
  });
});
