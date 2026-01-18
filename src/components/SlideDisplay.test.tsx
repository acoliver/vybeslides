import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SlideDisplay } from './SlideDisplay';

describe('SlideDisplay - slide container', () => {
  it('should render child content', () => {
    const { getByText } = render(
      <SlideDisplay>
        <text>Test slide</text>
      </SlideDisplay>,
    );
    expect(getByText('Test slide')).toBeTruthy();
  });
});

describe('SlideDisplay - optional header/footer', () => {
  it('should render with header (0-based index)', () => {
    const { getByText } = render(
      <SlideDisplay showHeader={true} slideNumber={0} totalSlides={5}>
        <text>Content</text>
      </SlideDisplay>,
    );
    expect(getByText(/\[0\/4\]/)).toBeTruthy();
  });

  it('should render without header', () => {
    const { queryByText } = render(
      <SlideDisplay showHeader={false} slideNumber={0} totalSlides={5}>
        <text>Content</text>
      </SlideDisplay>,
    );
    expect(queryByText(/\[0\/4\]/)).toBeNull();
  });

  it('should render with footer', () => {
    const { getByText } = render(
      <SlideDisplay showFooter={true}>
        <text>Content</text>
      </SlideDisplay>,
    );
    expect(getByText(/prev/i)).toBeTruthy();
  });

  it('should render without footer', () => {
    const { queryByText } = render(
      <SlideDisplay showFooter={false}>
        <text>Content</text>
      </SlideDisplay>,
    );
    expect(queryByText(/prev/i)).toBeNull();
  });
});
