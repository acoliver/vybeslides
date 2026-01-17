import { describe, it, expect } from 'vitest';
import { createPresentationController } from './PresentationController';
import type { LoadedSlide } from '../slides/Types';

describe('PresentationController - Transition Selection', () => {
  it('should use instant transition when no after on current and no before on next', () => {
    const slides: LoadedSlide[] = [
      { filename: '1.md', content: 'A', beforeTransition: null, afterTransition: null },
      { filename: '2.md', content: 'B', beforeTransition: null, afterTransition: null },
    ];
    const controller = createPresentationController(slides);
    const transition = controller.getTransitionForNavigation(0, 1, 'navigation');
    
    expect(transition.type).toBe('instant');
  });

  it('should use overlapping wipe when no after on current but before on next', () => {
    const slides: LoadedSlide[] = [
      { filename: '1.md', content: 'A', beforeTransition: null, afterTransition: null },
      { filename: '2.md', content: 'B', beforeTransition: 'leftwipe', afterTransition: null },
    ];
    const controller = createPresentationController(slides);
    const transition = controller.getTransitionForNavigation(0, 1, 'navigation');
    
    expect(transition.type).toBe('overlapping');
  });

  it('should use sequential with blank when after on current and no before on next', () => {
    const slides: LoadedSlide[] = [
      { filename: '1.md', content: 'A', beforeTransition: null, afterTransition: 'rightwipe' },
      { filename: '2.md', content: 'B', beforeTransition: null, afterTransition: null },
    ];
    const controller = createPresentationController(slides);
    const transition = controller.getTransitionForNavigation(0, 1, 'navigation');
    
    expect(transition.type).toBe('sequential');
  });

  it('should use sequential with blank when both after on current and before on next', () => {
    const slides: LoadedSlide[] = [
      { filename: '1.md', content: 'A', beforeTransition: null, afterTransition: 'topwipe' },
      { filename: '2.md', content: 'B', beforeTransition: 'bottomwipe', afterTransition: null },
    ];
    const controller = createPresentationController(slides);
    const transition = controller.getTransitionForNavigation(0, 1, 'navigation');
    
    expect(transition.type).toBe('sequential');
  });
});

describe('PresentationController - Transition Names', () => {
  it('should return correct transition name for overlapping wipe', () => {
    const slides: LoadedSlide[] = [
      { filename: '1.md', content: 'A', beforeTransition: null, afterTransition: null },
      { filename: '2.md', content: 'B', beforeTransition: 'diagonal', afterTransition: null },
    ];
    const controller = createPresentationController(slides);
    const transition = controller.getTransitionForNavigation(0, 1, 'navigation');
    
    expect(transition.transitionName).toBe('diagonal');
  });

  it('should return correct transition name for sequential transition', () => {
    const slides: LoadedSlide[] = [
      { filename: '1.md', content: 'A', beforeTransition: null, afterTransition: 'tvoff' },
      { filename: '2.md', content: 'B', beforeTransition: null, afterTransition: null },
    ];
    const controller = createPresentationController(slides);
    const transition = controller.getTransitionForNavigation(0, 1, 'navigation');
    
    expect(transition.transitionName).toBe('tvoff');
  });

  it('should use current after transition when both present', () => {
    const slides: LoadedSlide[] = [
      { filename: '1.md', content: 'A', beforeTransition: null, afterTransition: 'leftwipe' },
      { filename: '2.md', content: 'B', beforeTransition: 'rightwipe', afterTransition: null },
    ];
    const controller = createPresentationController(slides);
    const transition = controller.getTransitionForNavigation(0, 1, 'navigation');
    
    expect(transition.transitionName).toBe('leftwipe');
  });
});

describe('PresentationController - Blank Delay', () => {
  it('should have blank delay for sequential transitions', () => {
    const slides: LoadedSlide[] = [
      { filename: '1.md', content: 'A', beforeTransition: null, afterTransition: 'topwipe' },
      { filename: '2.md', content: 'B', beforeTransition: null, afterTransition: null },
    ];
    const controller = createPresentationController(slides);
    const transition = controller.getTransitionForNavigation(0, 1, 'navigation');
    
    expect(transition.hasBlankDelay).toBe(true);
  });

  it('should not have blank delay for instant transitions', () => {
    const slides: LoadedSlide[] = [
      { filename: '1.md', content: 'A', beforeTransition: null, afterTransition: null },
      { filename: '2.md', content: 'B', beforeTransition: null, afterTransition: null },
    ];
    const controller = createPresentationController(slides);
    const transition = controller.getTransitionForNavigation(0, 1, 'navigation');
    
    expect(transition.hasBlankDelay).toBe(false);
  });

  it('should not have blank delay for overlapping transitions', () => {
    const slides: LoadedSlide[] = [
      { filename: '1.md', content: 'A', beforeTransition: null, afterTransition: null },
      { filename: '2.md', content: 'B', beforeTransition: 'diagonal', afterTransition: null },
    ];
    const controller = createPresentationController(slides);
    const transition = controller.getTransitionForNavigation(0, 1, 'navigation');
    
    expect(transition.hasBlankDelay).toBe(false);
  });
});

describe('PresentationController - Special Cases', () => {
  it('should use instant transition for first slide with no before', () => {
    const slides: LoadedSlide[] = [
      { filename: '1.md', content: 'A', beforeTransition: null, afterTransition: null },
    ];
    const controller = createPresentationController(slides);
    const transition = controller.getTransitionForNavigation(0, 0, 'navigation');
    
    expect(transition.type).toBe('instant');
  });

  it('should use before transition for first slide when specified', () => {
    const slides: LoadedSlide[] = [
      { filename: '1.md', content: 'A', beforeTransition: 'tvon', afterTransition: null },
    ];
    const controller = createPresentationController(slides);
    const firstSlideTransition = controller.getTransitionForNavigation(-1, 0, 'navigation');
    
    expect(firstSlideTransition.transitionName).toBe('tvon');
  });

  it('should handle last slide after:tvoff only on quit', () => {
    const slides: LoadedSlide[] = [
      { filename: '1.md', content: 'A', beforeTransition: null, afterTransition: null },
      { filename: '2.md', content: 'B', beforeTransition: null, afterTransition: 'tvoff' },
    ];
    const controller = createPresentationController(slides);
    const transition = controller.getTransitionForNavigation(1, 1, 'quit');
    
    expect(transition.transitionName).toBe('tvoff');
  });

  it('should not trigger after transition when navigating on same slide', () => {
    const slides: LoadedSlide[] = [
      { filename: '1.md', content: 'A', beforeTransition: null, afterTransition: null },
      { filename: '2.md', content: 'B', beforeTransition: null, afterTransition: 'tvoff' },
    ];
    const controller = createPresentationController(slides);
    const transition = controller.getTransitionForNavigation(1, 1, 'navigation');
    
    expect(transition.transitionName).toBeNull();
  });
});
