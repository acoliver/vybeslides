import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HelpOverlay } from './HelpOverlay';

describe('HelpOverlay - modal display', () => {
  it('should render help text', () => {
    const { getAllByText } = render(<HelpOverlay />);
    const helpTexts = getAllByText(/help/i);
    expect(helpTexts.length).toBeGreaterThan(0);
  });
});

describe('HelpOverlay - key bindings display', () => {
  it('should display next navigation binding', () => {
    const { getByText } = render(<HelpOverlay />);
    expect(getByText(/next/i)).toBeTruthy();
  });

  it('should display previous navigation binding', () => {
    const { getByText } = render(<HelpOverlay />);
    expect(getByText(/prev/i)).toBeTruthy();
  });

  it('should display quit binding', () => {
    const { getByText } = render(<HelpOverlay />);
    expect(getByText(/quit/i)).toBeTruthy();
  });

  it('should display help binding', () => {
    const { getAllByText } = render(<HelpOverlay />);
    const helpTexts = getAllByText(/help/i);
    expect(helpTexts.length).toBeGreaterThan(0);
  });

  it('should display jump binding', () => {
    const { getByText } = render(<HelpOverlay />);
    expect(getByText(/jump/i)).toBeTruthy();
  });
});
