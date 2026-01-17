import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FooterBar } from './FooterBar';

describe('FooterBar - navigation hints', () => {
  it('should display navigation hints', () => {
    const { getByText } = render(<FooterBar />);
    expect(getByText(/prev/i)).toBeTruthy();
  });

  it('should display next hint', () => {
    const { getByText } = render(<FooterBar />);
    expect(getByText(/next/i)).toBeTruthy();
  });

  it('should display help hint', () => {
    const { getByText } = render(<FooterBar />);
    expect(getByText(/help/i)).toBeTruthy();
  });

  it('should display quit hint', () => {
    const { getByText } = render(<FooterBar />);
    expect(getByText(/quit/i)).toBeTruthy();
  });
});

describe('FooterBar - time display', () => {
  it('should display current time', () => {
    const { container } = render(<FooterBar />);
    expect(container.textContent).toMatch(/\d{1,2}:\d{2}/);
  });
});
