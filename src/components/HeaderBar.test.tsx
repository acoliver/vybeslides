import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HeaderBar } from './HeaderBar';

describe('HeaderBar - logo display', () => {
  it('should render header with slide counter', () => {
    const { getByText } = render(
      <HeaderBar slideNumber={1} totalSlides={5} />
    );
    expect(getByText(/\[1\/5\]/)).toBeTruthy();
  });
});

describe('HeaderBar - slide counter format', () => {
  it('should display slide counter in correct format', () => {
    const { getByText } = render(
      <HeaderBar slideNumber={3} totalSlides={10} />
    );
    expect(getByText(/\[3\/10\]/)).toBeTruthy();
  });
});

describe('HeaderBar - dynamic counter width', () => {
  it('should handle single digit slide numbers', () => {
    const { getByText } = render(
      <HeaderBar slideNumber={1} totalSlides={5} />
    );
    expect(getByText(/\[1\/5\]/)).toBeTruthy();
  });

  it('should handle multi-digit slide numbers', () => {
    const { getByText } = render(
      <HeaderBar slideNumber={42} totalSlides={123} />
    );
    expect(getByText(/\[42\/123\]/)).toBeTruthy();
  });
});
